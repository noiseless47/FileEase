from flask import Flask, request, jsonify, send_file
import os
import tempfile
from pdf_compressor import PDFCompressor, format_size
from image_compressor import ImageCompressor
from secure_files import SecureFileHandler
from password_protect import PasswordProtector
from zip_utils import ZipHandler
import uuid
import traceback
import logging
from flask_cors import CORS  # Add CORS support
import shutil
import zipfile

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   handlers=[logging.StreamHandler()])
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max upload size

# Create necessary directories if they don't exist
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
COMPRESSED_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'compressed')
ZIP_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zips')
EXTRACT_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'extracted')
SECURE_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'secured')
PROTECTED_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'protected')

for folder in [UPLOAD_FOLDER, COMPRESSED_FOLDER, ZIP_FOLDER, EXTRACT_FOLDER, SECURE_FOLDER, PROTECTED_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

@app.route('/api/compress-pdf', methods=['POST'])
def compress_pdf():
    """API endpoint to compress a PDF file"""
    
    # Check if PDF file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if the file is a PDF
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are supported'}), 400
    
    # Get compression level from request
    compression_level = request.form.get('compression_level', 'medium')
    if compression_level not in ['low', 'medium', 'high', 'extreme']:
        compression_level = 'medium'
    
    # Get output filename if provided
    output_filename = request.form.get('output_filename', '')
    if not output_filename or not output_filename.lower().endswith('.pdf'):
        output_filename = f"compressed_{file.filename}"
        
    # Make sure output filename is safe
    output_filename = os.path.basename(output_filename)
    
    # Generate unique filenames for internal use
    unique_id = str(uuid.uuid4())
    input_filename = os.path.join(UPLOAD_FOLDER, f"{unique_id}_input.pdf")
    output_filename_internal = os.path.join(COMPRESSED_FOLDER, f"{unique_id}_compressed.pdf")
    
    logger.info(f"Processing file: {file.filename} with compression level: {compression_level}")
    logger.info(f"Output filename requested: {output_filename}")
    logger.info(f"Saving to: {input_filename}")
    
    # Save uploaded file
    try:
        file.save(input_filename)
        logger.info(f"File saved successfully. Size: {os.path.getsize(input_filename)} bytes")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded file'}), 500
    
    try:
        # Create compressor and compress PDF
        logger.info("Starting PDF compression")
        compressor = PDFCompressor(compression_level=compression_level)
        output_path, stats = compressor.compress_pdf(input_filename, output_filename_internal)
        logger.info(f"Compression complete. Original: {stats['original_size']}, Compressed: {stats['compressed_size']} bytes")
        
        # Calculate compression ratio - positive value means reduction (smaller file)
        original_size = stats['original_size']
        compressed_size = stats['compressed_size']
        saved_bytes = original_size - compressed_size
        saved_percent = (saved_bytes / original_size) * 100 if original_size > 0 else 0
        
        # Format stats for response
        formatted_stats = {
            'original_size': original_size,
            'original_size_formatted': format_size(original_size),
            'compressed_size': compressed_size,
            'compressed_size_formatted': format_size(compressed_size),
            'saved_bytes': saved_bytes,
            'saved_bytes_formatted': format_size(saved_bytes),
            'saved_percent': saved_percent,
            'compression_level': stats['compression_level']
        }
        
        # Set headers for the response to include original file size
        response = send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/pdf'
        )
        
        # Add stats as headers
        response.headers['X-Original-Size'] = str(original_size)
        response.headers['X-Compressed-Size'] = str(compressed_size)
        response.headers['X-Compression-Ratio'] = str(saved_percent)
        
        return response
        
    except Exception as e:
        logger.error(f"Error during compression: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded file
        try:
            if os.path.exists(input_filename):
                os.remove(input_filename)
                logger.info(f"Cleaned up input file: {input_filename}")
        except Exception as e:
            logger.warning(f"Failed to clean up file {input_filename}: {str(e)}")

@app.route('/api/compression-stats', methods=['POST'])
def get_compression_stats():
    """Get compression stats without downloading the file"""
    
    # Check if PDF file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if the file is a PDF
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are supported'}), 400
    
    # Get compression level from request
    compression_level = request.form.get('compression_level', 'medium')
    if compression_level not in ['low', 'medium', 'high', 'extreme']:
        compression_level = 'medium'
    
    unique_id = str(uuid.uuid4())
    
    # Create temporary files
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as input_file:
        input_filename = input_file.name
        file.save(input_filename)
        
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as output_file:
        output_filename = output_file.name
    
    try:
        # Create compressor and compress PDF
        compressor = PDFCompressor(compression_level=compression_level)
        output_path, stats = compressor.compress_pdf(input_filename, output_filename)
        
        # Format stats for response
        formatted_stats = {
            'original_size': stats['original_size'],
            'original_size_formatted': format_size(stats['original_size']),
            'compressed_size': stats['compressed_size'],
            'compressed_size_formatted': format_size(stats['compressed_size']),
            'saved_bytes': stats['saved_bytes'],
            'saved_bytes_formatted': format_size(stats['saved_bytes']),
            'saved_percent': round(stats['saved_percent'], 2),
            'compression_level': stats['compression_level'],
            'token': unique_id
        }
        
        return jsonify(formatted_stats)
    except Exception as e:
        logger.error(f"Error during stats calculation: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up temporary files
        for filename in [input_filename, output_filename]:
            try:
                if os.path.exists(filename):
                    os.remove(filename)
            except Exception as e:
                logger.warning(f"Failed to clean up temporary file {filename}: {str(e)}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to verify the API is working"""
    return jsonify({"status": "ok", "message": "PDF compression service is running"}), 200

@app.route('/api/compress-image', methods=['POST'])
def compress_image():
    """API endpoint to compress image files"""
    
    # Check if image file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if the file is a valid image
    image_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    if not file.filename or not any(file.filename.lower().endswith(ext) for ext in image_extensions):
        return jsonify({'error': 'Only image files are supported (JPG, JPEG, PNG, WebP)'}), 400
    
    # Get compression level from request
    compression_level = request.form.get('compression_level', 'medium')
    if compression_level not in ['low', 'medium', 'high', 'extreme']:
        compression_level = 'medium'
    
    # Get output filename if provided
    output_filename = request.form.get('output_filename', '')
    if not output_filename:
        output_filename = f"compressed_{file.filename}"
        
    # Make sure output filename is safe
    output_filename = os.path.basename(output_filename)
    
    # Generate unique filenames for internal use
    unique_id = str(uuid.uuid4())
    input_filename = os.path.join(UPLOAD_FOLDER, f"{unique_id}_input{os.path.splitext(file.filename)[1]}")
    output_filename_internal = os.path.join(COMPRESSED_FOLDER, f"{unique_id}_compressed{os.path.splitext(file.filename)[1]}")
    
    logger.info(f"Processing image file: {file.filename} with compression level: {compression_level}")
    logger.info(f"Output filename requested: {output_filename}")
    logger.info(f"Saving to: {input_filename}")
    
    # Save uploaded file
    try:
        file.save(input_filename)
        logger.info(f"File saved successfully. Size: {os.path.getsize(input_filename)} bytes")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded file'}), 500
    
    try:
        # Create compressor and compress image
        logger.info("Starting image compression")
        compressor = ImageCompressor(compression_level=compression_level)
        output_path, stats = compressor.compress_image(input_filename, output_filename_internal)
        logger.info(f"Compression complete. Original: {stats['original_size']}, Compressed: {stats['compressed_size']} bytes")
        
        # Calculate compression ratio - positive value means reduction (smaller file)
        original_size = stats['original_size']
        compressed_size = stats['compressed_size']
        saved_bytes = original_size - compressed_size
        saved_percent = (saved_bytes / original_size) * 100 if original_size > 0 else 0
        
        # Format stats for response
        formatted_stats = {
            'original_size': original_size,
            'original_size_formatted': format_size(original_size),
            'compressed_size': compressed_size,
            'compressed_size_formatted': format_size(compressed_size),
            'saved_bytes': saved_bytes,
            'saved_bytes_formatted': format_size(saved_bytes),
            'saved_percent': saved_percent,
            'compression_level': stats['compression_level'],
            'format': stats.get('format', 'unknown')
        }
        
        # Set headers for the response to include original file size
        response = send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype=file.mimetype
        )
        
        # Add stats as headers
        response.headers['X-Original-Size'] = str(original_size)
        response.headers['X-Compressed-Size'] = str(compressed_size)
        response.headers['X-Compression-Ratio'] = str(saved_percent)
        
        return response
        
    except Exception as e:
        logger.error(f"Error during image compression: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded file
        try:
            if os.path.exists(input_filename):
                os.remove(input_filename)
                logger.info(f"Cleaned up input file: {input_filename}")
        except Exception as e:
            logger.warning(f"Failed to clean up file {input_filename}: {str(e)}")

@app.route('/api/zip-files', methods=['POST'])
def zip_files():
    """API endpoint to zip multiple files"""
    
    # Check if files were included in the request
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
        
    files = request.files.getlist('files[]')
    
    # Check if any files were provided
    if len(files) == 0:
        return jsonify({'error': 'No files provided'}), 400
    
    # Get compression level from request (0-9)
    compression_level = request.form.get('compression_level', '6')
    try:
        compression_level = int(compression_level)
        if compression_level < 0 or compression_level > 9:
            compression_level = 6
    except ValueError:
        compression_level = 6
    
    # Get output filename if provided
    output_filename = request.form.get('output_filename', '')
    if not output_filename or not output_filename.lower().endswith('.zip'):
        output_filename = "archive.zip"
        
    # Make sure output filename is safe
    output_filename = os.path.basename(output_filename)
    
    # Generate unique identifier
    unique_id = str(uuid.uuid4())
    
    # Calculate the total file size before saving
    total_size = 0
    for file in files:
        if hasattr(file, 'seek') and hasattr(file, 'tell'):
            file.seek(0, os.SEEK_END)
            total_size += file.tell()
            file.seek(0)
    
    # Save uploaded files
    saved_file_paths = []
    valid_files = False
    try:
        for file in files:
            if file.filename:
                file_path = os.path.join(UPLOAD_FOLDER, f"{unique_id}_{file.filename}")
                file.save(file_path)
                if os.path.getsize(file_path) > 0:
                    valid_files = True
                saved_file_paths.append(file_path)
                logger.info(f"Saved uploaded file: {file_path}, size: {os.path.getsize(file_path)}")
        
        if not valid_files:
            logger.warning("No valid files were uploaded (all empty)")
    except Exception as e:
        logger.error(f"Error saving uploaded files: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded files'}), 500
    
    # Path for the output zip file
    output_zip_path = os.path.join(ZIP_FOLDER, f"{unique_id}_{output_filename}")
    
    try:
        # Create zip handler and zip the files
        logger.info(f"Starting zip operation with compression level {compression_level}")
        zip_handler = ZipHandler(compression_level=compression_level)
        output_path, stats = zip_handler.zip_files(saved_file_paths, output_zip_path)
        logger.info(f"Zip complete. Original total: {stats['original_size']}, "
                   f"Compressed: {stats['compressed_size']} bytes")
        
        # Check if the original size is correct and use the pre-calculated size if needed
        if stats['original_size'] == 0 and total_size > 0:
            stats['original_size'] = total_size
            logger.info(f"Using pre-calculated file size: {total_size}")
        
        # Send the zip file as response
        response = send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/zip'
        )
        
        # Add stats as headers
        response.headers['X-Original-Size'] = str(stats['original_size'] or total_size or 1)
        response.headers['X-Compressed-Size'] = str(max(1, stats['compressed_size']))
        
        # Calculate safe compression ratio
        if stats['original_size'] > 0:
            ratio = stats['saved_percent'] 
        elif total_size > 0 and stats['compressed_size'] > 0:
            # Calculate from our pre-measured total size
            ratio = ((total_size - stats['compressed_size']) / total_size) * 100
        else:
            ratio = 0
            
        response.headers['X-Compression-Ratio'] = str(ratio)
        response.headers['X-File-Count'] = str(len(files))
        
        return response
        
    except Exception as e:
        logger.error(f"Error during zip operation: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded files
        for file_path in saved_file_paths:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Cleaned up file: {file_path}")
            except Exception as e:
                logger.warning(f"Failed to clean up file {file_path}: {str(e)}")

@app.route('/api/unzip-file', methods=['POST'])
def unzip_file():
    """API endpoint to unzip a file"""
    
    # Check if zip file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if the file is a zip
    if not file.filename or not file.filename.lower().endswith('.zip'):
        return jsonify({'error': 'Only ZIP files are supported'}), 400
    
    # Generate unique identifier
    unique_id = str(uuid.uuid4())
    
    # Save uploaded zip file
    zip_file_path = os.path.join(UPLOAD_FOLDER, f"{unique_id}_{file.filename}")
    try:
        file.save(zip_file_path)
        logger.info(f"Saved uploaded zip file: {zip_file_path}")
    except Exception as e:
        logger.error(f"Error saving zip file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded zip file'}), 500
    
    # Create extract directory
    extract_dir = os.path.join(EXTRACT_FOLDER, f"{unique_id}")
    if not os.path.exists(extract_dir):
        os.makedirs(extract_dir)
    
    try:
        # Extract the zip file
        logger.info(f"Starting unzip operation for file: {zip_file_path}")
        zip_handler = ZipHandler()
        extract_path, stats = zip_handler.unzip_file(zip_file_path, extract_dir)
        logger.info(f"Unzip complete. Zip size: {stats['zip_size']}, "
                   f"Extracted: {stats['total_extracted_size']} bytes")
        
        # Check the number of files
        file_count = stats['file_count']
        
        if file_count == 0:
            return jsonify({'error': 'The zip file is empty'}), 400
        
        # If only one file, send it directly
        if file_count == 1:
            file_info = stats['extracted_files'][0]
            file_path = file_info['path']
            
            response = send_file(
                file_path,
                as_attachment=True,
                download_name=file_info['name'],
            )
            
        # If multiple files, create a zip with them
        else:
            # Create a temp zip of all extracted files
            response_zip_path = os.path.join(ZIP_FOLDER, f"{unique_id}_extracted.zip")
            
            # Create a basic zip file with the extracted contents
            with zipfile.ZipFile(response_zip_path, 'w') as zipf:
                for file_info in stats['extracted_files']:
                    zipf.write(file_info['path'], arcname=file_info['name'])
            
            response = send_file(
                response_zip_path,
                as_attachment=True,
                download_name=f"extracted_{os.path.basename(file.filename)}",
                mimetype='application/zip'
            )
        
        # Add stats as headers
        response.headers['X-Zip-Size'] = str(stats['zip_size'])
        response.headers['X-Extracted-Size'] = str(stats['total_extracted_size'])
        response.headers['X-File-Count'] = str(file_count)
        
        return response
        
    except Exception as e:
        logger.error(f"Error during unzip operation: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded zip file
        try:
            if os.path.exists(zip_file_path):
                os.remove(zip_file_path)
                logger.info(f"Cleaned up zip file: {zip_file_path}")
        except Exception as e:
            logger.warning(f"Failed to clean up zip file {zip_file_path}: {str(e)}")
        
        # Clean up the extracted directory
        try:
            if os.path.exists(extract_dir):
                shutil.rmtree(extract_dir)
                logger.info(f"Cleaned up extract directory: {extract_dir}")
        except Exception as e:
            logger.warning(f"Failed to clean up extract directory {extract_dir}: {str(e)}")

@app.route('/api/secure-file', methods=['POST'])
def secure_file():
    """API endpoint to encrypt a file with a password"""
    
    # Check if file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if a file was selected
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400
    
    # Get password from request
    password = request.form.get('password')
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # Get output filename if provided
    output_filename = request.form.get('output_filename', '')
    if not output_filename:
        output_filename = f"secured_{file.filename}"
        
    # Make sure output filename is safe
    output_filename = os.path.basename(output_filename)
    
    # Generate unique filenames for internal use
    unique_id = str(uuid.uuid4())
    input_filename = os.path.join(UPLOAD_FOLDER, f"{unique_id}_input{os.path.splitext(file.filename)[1]}")
    output_filename_internal = os.path.join(SECURE_FOLDER, f"{unique_id}_secured{os.path.splitext(file.filename)[1]}")
    
    logger.info(f"Processing file for encryption: {file.filename}")
    logger.info(f"Output filename requested: {output_filename}")
    
    # Save uploaded file
    try:
        file.save(input_filename)
        logger.info(f"File saved successfully. Size: {os.path.getsize(input_filename)} bytes")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded file'}), 500
    
    try:
        # Create secure file handler and encrypt the file
        logger.info("Starting file encryption")
        secure_handler = SecureFileHandler()
        output_path, stats = secure_handler.encrypt_file(input_filename, password, output_filename_internal)
        logger.info(f"Encryption complete. Original: {stats['original_size']}, Encrypted: {stats['encrypted_size']} bytes")
        
        # Send the encrypted file as response
        response = send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/octet-stream'
        )
        
        # Add stats as headers
        response.headers['X-Original-Size'] = str(stats['original_size'])
        response.headers['X-Encrypted-Size'] = str(stats['encrypted_size'])
        
        return response
        
    except Exception as e:
        logger.error(f"Error during file encryption: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded file
        try:
            if os.path.exists(input_filename):
                os.remove(input_filename)
                logger.info(f"Cleaned up input file: {input_filename}")
        except Exception as e:
            logger.warning(f"Failed to clean up file {input_filename}: {str(e)}")

@app.route('/api/decrypt-file', methods=['POST'])
def decrypt_file():
    """API endpoint to decrypt a file with a password"""
    
    # Check if file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if a file was selected
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400
    
    # Get password from request
    password = request.form.get('password')
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # Generate unique filenames for internal use
    unique_id = str(uuid.uuid4())
    input_filename = os.path.join(UPLOAD_FOLDER, f"{unique_id}_encrypted{os.path.splitext(file.filename)[1]}")
    
    logger.info(f"Processing file for decryption: {file.filename}")
    
    # Save uploaded file
    try:
        file.save(input_filename)
        logger.info(f"Encrypted file saved successfully. Size: {os.path.getsize(input_filename)} bytes")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded file'}), 500
    
    try:
        # Create secure file handler and decrypt the file
        logger.info("Starting file decryption")
        secure_handler = SecureFileHandler()
        
        try:
            output_path, stats = secure_handler.decrypt_file(input_filename, password)
            logger.info(f"Decryption complete. Encrypted: {stats['encrypted_size']}, Decrypted: {stats['decrypted_size']} bytes")
            
            # Send the decrypted file as response
            response = send_file(
                output_path,
                as_attachment=True,
                download_name=stats['original_filename'],
                mimetype='application/octet-stream'
            )
            
            # Add stats as headers
            response.headers['X-Encrypted-Size'] = str(stats['encrypted_size'])
            response.headers['X-Decrypted-Size'] = str(stats['decrypted_size'])
            
            return response
            
        except ValueError as ve:
            # Handle incorrect password specifically
            if "Invalid password" in str(ve):
                return jsonify({'error': 'Incorrect password or corrupted file'}), 403
            else:
                raise
        
    except Exception as e:
        logger.error(f"Error during file decryption: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded file
        try:
            if os.path.exists(input_filename):
                os.remove(input_filename)
                logger.info(f"Cleaned up input file: {input_filename}")
        except Exception as e:
            logger.warning(f"Failed to clean up file {input_filename}: {str(e)}")

@app.route('/api/secure-multiple', methods=['POST'])
def secure_multiple():
    """API endpoint to encrypt multiple files with a password"""
    
    # Check if files were included in the request
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
        
    files = request.files.getlist('files[]')
    
    # Check if any files were provided
    if len(files) == 0:
        return jsonify({'error': 'No files selected'}), 400
    
    # Get password from request
    password = request.form.get('password')
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # Get output filename if provided
    output_filename = request.form.get('output_filename', '')
    if not output_filename:
        output_filename = "secured_files.sfp"  # Default extension for secure file package
    
    # Make sure output filename is safe and has the correct extension
    output_filename = os.path.basename(output_filename)
    if not output_filename.lower().endswith('.sfp'):
        output_filename = f"{output_filename}.sfp"
    
    # Generate a unique identifier for this batch
    unique_id = str(uuid.uuid4())
    
    # Calculate the total size of all files
    total_size = 0
    for file in files:
        if hasattr(file, 'seek') and hasattr(file, 'tell'):
            file.seek(0, os.SEEK_END)
            total_size += file.tell()
            file.seek(0)
    
    # Save uploaded files
    saved_file_paths = []
    try:
        for file in files:
            if file.filename:
                file_path = os.path.join(UPLOAD_FOLDER, f"{unique_id}_{file.filename}")
                file.save(file_path)
                saved_file_paths.append(file_path)
                logger.info(f"Saved file for encryption: {file_path}, size: {os.path.getsize(file_path)}")
        
        if not saved_file_paths:
            return jsonify({'error': 'No valid files provided'}), 400
            
    except Exception as e:
        logger.error(f"Error saving files: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded files'}), 500
    
    # Path for the output secure package file
    output_path = os.path.join(SECURE_FOLDER, f"{unique_id}_{output_filename}")
    
    try:
        # Create secure file handler and encrypt the files
        logger.info(f"Starting secure package creation with {len(saved_file_paths)} files")
        secure_handler = SecureFileHandler()
        output_path, stats = secure_handler.secure_multiple_files(
            saved_file_paths,
            password, 
            output_dir=SECURE_FOLDER,
            output_filename=f"{unique_id}_{output_filename}"
        )
        
        logger.info(f"Secure package created. Original total: {stats['original_size']}, "
                  f"Secured: {stats['secured_size']} bytes, Files: {stats['file_count']}")
        
        # Send the secure package file as response
        response = send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/octet-stream'
        )
        
        # Add stats as headers
        response.headers['X-Original-Size'] = str(stats['original_size'])
        response.headers['X-Secured-Size'] = str(stats['secured_size'])
        response.headers['X-File-Count'] = str(stats['file_count'])
        
        return response
        
    except Exception as e:
        logger.error(f"Error during secure package creation: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded files
        for file_path in saved_file_paths:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Cleaned up file: {file_path}")
            except Exception as e:
                logger.warning(f"Failed to clean up file {file_path}: {str(e)}")

@app.route('/api/extract-secure', methods=['POST'])
def extract_secure():
    """API endpoint to extract files from a secure package"""
    
    # Check if file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if a file was selected
    if not file.filename:
        return jsonify({'error': 'No file selected'}), 400
    
    # Check if the file has the correct extension
    if not file.filename.lower().endswith('.sfp'):
        return jsonify({'error': 'Invalid secure file package. Must have .sfp extension.'}), 400
    
    # Get password from request
    password = request.form.get('password')
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # Generate unique identifier
    unique_id = str(uuid.uuid4())
    
    # Save uploaded secure package
    package_path = os.path.join(UPLOAD_FOLDER, f"{unique_id}_{file.filename}")
    try:
        file.save(package_path)
        logger.info(f"Saved secure package: {package_path}")
    except Exception as e:
        logger.error(f"Error saving secure package: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded secure package'}), 500
    
    # Create extract directory
    extract_dir = os.path.join(EXTRACT_FOLDER, f"{unique_id}")
    if not os.path.exists(extract_dir):
        os.makedirs(extract_dir)
    
    try:
        # Create secure file handler and extract the files
        logger.info(f"Starting secure package extraction: {package_path}")
        secure_handler = SecureFileHandler()
        
        try:
            extract_dir, stats = secure_handler.extract_secure_package(package_path, password, extract_dir)
            logger.info(f"Extraction complete. Package size: {stats['package_size']}, "
                      f"Extracted: {stats['total_extracted_size']} bytes, Files: {stats['file_count']}")
            
            # Check the number of files
            file_count = stats['file_count']
            
            if file_count == 0:
                return jsonify({'error': 'The secure package is empty'}), 400
            
            # If only one file, send it directly
            if file_count == 1:
                file_info = stats['extracted_files'][0]
                file_path = file_info['path']
                
                response = send_file(
                    file_path,
                    as_attachment=True,
                    download_name=file_info['name']
                )
                
            # If multiple files, create a zip with them
            else:
                # Create a temp zip of all extracted files
                response_zip_path = os.path.join(ZIP_FOLDER, f"{unique_id}_extracted.zip")
                
                # Create a basic zip file with the extracted contents
                with zipfile.ZipFile(response_zip_path, 'w') as zipf:
                    for file_info in stats['extracted_files']:
                        zipf.write(file_info['path'], arcname=file_info['name'])
                
                response = send_file(
                    response_zip_path,
                    as_attachment=True,
                    download_name=f"extracted_{os.path.basename(file.filename).replace('.sfp', '.zip')}",
                    mimetype='application/zip'
                )
            
            # Add stats as headers
            response.headers['X-Package-Size'] = str(stats['package_size'])
            response.headers['X-Extracted-Size'] = str(stats['total_extracted_size'])
            response.headers['X-File-Count'] = str(file_count)
            
            return response
            
        except ValueError as ve:
            # Handle incorrect password specifically
            if "Invalid password" in str(ve):
                return jsonify({'error': 'Incorrect password or corrupted file'}), 403
            else:
                raise
        
    except Exception as e:
        logger.error(f"Error during secure package extraction: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded package file
        try:
            if os.path.exists(package_path):
                os.remove(package_path)
                logger.info(f"Cleaned up package file: {package_path}")
        except Exception as e:
            logger.warning(f"Failed to clean up package file {package_path}: {str(e)}")
        
        # Clean up the extracted directory
        try:
            if os.path.exists(extract_dir):
                shutil.rmtree(extract_dir)
                logger.info(f"Cleaned up extract directory: {extract_dir}")
        except Exception as e:
            logger.warning(f"Failed to clean up extract directory {extract_dir}: {str(e)}")

@app.route('/api/protect-pdf', methods=['POST'])
def protect_pdf():
    """API endpoint to add password protection to a PDF file"""
    
    # Check if PDF file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if the file is a PDF
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are supported'}), 400
    
    # Get passwords from request
    user_password = request.form.get('user_password')
    owner_password = request.form.get('owner_password')
    
    if not user_password and not owner_password:
        return jsonify({'error': 'At least one password (user or owner) is required'}), 400
    
    # Get permission settings
    permissions = {
        'print': request.form.get('print', 'false').lower() == 'true',
        'modify': request.form.get('modify', 'false').lower() == 'true',
        'copy': request.form.get('copy', 'false').lower() == 'true',
        'annotate': request.form.get('annotate', 'false').lower() == 'true',
        'form': request.form.get('form', 'false').lower() == 'true',
        'accessibility': request.form.get('accessibility', 'true').lower() == 'true',
        'assemble': request.form.get('assemble', 'false').lower() == 'true'
    }
    
    # Get output filename if provided
    output_filename = request.form.get('output_filename', '')
    if not output_filename or not output_filename.lower().endswith('.pdf'):
        output_filename = f"protected_{file.filename}"
        
    # Make sure output filename is safe
    output_filename = os.path.basename(output_filename)
    
    # Generate unique filenames for internal use
    unique_id = str(uuid.uuid4())
    input_filename = os.path.join(UPLOAD_FOLDER, f"{unique_id}_input.pdf")
    output_filename_internal = os.path.join(PROTECTED_FOLDER, f"{unique_id}_protected.pdf")
    
    logger.info(f"Processing PDF file for password protection: {file.filename}")
    logger.info(f"Output filename requested: {output_filename}")
    
    # Save uploaded file
    try:
        file.save(input_filename)
        logger.info(f"File saved successfully. Size: {os.path.getsize(input_filename)} bytes")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded file'}), 500
    
    try:
        # Create protector and protect PDF
        logger.info("Starting PDF password protection")
        protector = PasswordProtector()
        output_path, stats = protector.password_protect_pdf(
            input_filename,
            output_filename_internal,
            user_password=user_password,
            owner_password=owner_password,
            permissions=permissions
        )
        logger.info(f"Protection complete. Original: {stats['original_size']}, Protected: {stats['protected_size']} bytes")
        
        # Send the protected file as response
        response = send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/pdf'
        )
        
        # Add stats as headers
        response.headers['X-Original-Size'] = str(stats['original_size'])
        response.headers['X-Protected-Size'] = str(stats['protected_size'])
        response.headers['X-Has-User-Password'] = str(stats['has_user_password']).lower()
        response.headers['X-Has-Owner-Password'] = str(stats['has_owner_password']).lower()
        
        return response
        
    except Exception as e:
        logger.error(f"Error during PDF protection: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded file
        try:
            if os.path.exists(input_filename):
                os.remove(input_filename)
                logger.info(f"Cleaned up input file: {input_filename}")
        except Exception as e:
            logger.warning(f"Failed to clean up file {input_filename}: {str(e)}")

@app.route('/api/unlock-pdf', methods=['POST'])
def unlock_pdf():
    """API endpoint to remove password protection from a PDF file"""
    
    # Check if PDF file was included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Check if the file is a PDF
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are supported'}), 400
    
    # Get password from request
    password = request.form.get('password', '')
    
    # Get output filename if provided
    output_filename = request.form.get('output_filename', '')
    if not output_filename or not output_filename.lower().endswith('.pdf'):
        output_filename = f"unlocked_{file.filename}"
        
    # Make sure output filename is safe
    output_filename = os.path.basename(output_filename)
    
    # Generate unique filenames for internal use
    unique_id = str(uuid.uuid4())
    input_filename = os.path.join(UPLOAD_FOLDER, f"{unique_id}_input.pdf")
    output_filename_internal = os.path.join(PROTECTED_FOLDER, f"{unique_id}_unlocked.pdf")
    
    logger.info(f"Processing PDF file for password removal: {file.filename}")
    logger.info(f"Output filename requested: {output_filename}")
    
    # Save uploaded file
    try:
        file.save(input_filename)
        logger.info(f"File saved successfully. Size: {os.path.getsize(input_filename)} bytes")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': 'Failed to save uploaded file'}), 500
    
    try:
        # Create protector and unlock PDF
        logger.info("Starting PDF password removal")
        protector = PasswordProtector()
        
        try:
            output_path, stats = protector.remove_pdf_password(input_filename, output_filename_internal, password)
            logger.info(f"Unlocking complete. Original: {stats['original_size']}, Unlocked: {stats['unprotected_size']} bytes")
            
            # Send the unlocked file as response
            response = send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/pdf'
            )
            
            # Add stats as headers
            response.headers['X-Original-Size'] = str(stats['original_size'])
            response.headers['X-Unlocked-Size'] = str(stats['unprotected_size'])
            response.headers['X-Was-Encrypted'] = str(stats['was_encrypted']).lower()
            
            return response
            
        except ValueError as ve:
            # Handle incorrect password specifically
            if "Incorrect password" in str(ve):
                return jsonify({'error': 'Incorrect password for this PDF'}), 403
            else:
                raise
        
    except Exception as e:
        logger.error(f"Error during PDF unlocking: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the uploaded file
        try:
            if os.path.exists(input_filename):
                os.remove(input_filename)
                logger.info(f"Cleaned up input file: {input_filename}")
        except Exception as e:
            logger.warning(f"Failed to clean up file {input_filename}: {str(e)}")

if __name__ == '__main__':
    try:
        # Verify PyMuPDF is installed correctly
        import fitz
        logger.info(f"PyMuPDF (fitz) version: {fitz.__version__}")
    except ImportError:
        logger.critical("PyMuPDF (fitz) is not installed. Please install it with: pip install pymupdf==1.23.6")
        exit(1)
        
    app.run(debug=True, host='0.0.0.0', port=5000) 