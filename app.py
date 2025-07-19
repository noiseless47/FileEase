from flask import Flask, request, jsonify, send_file
import os
import tempfile
from pdf_compressor import PDFCompressor, format_size
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

for folder in [UPLOAD_FOLDER, COMPRESSED_FOLDER, ZIP_FOLDER, EXTRACT_FOLDER]:
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

if __name__ == '__main__':
    try:
        # Verify PyMuPDF is installed correctly
        import fitz
        logger.info(f"PyMuPDF (fitz) version: {fitz.__version__}")
    except ImportError:
        logger.critical("PyMuPDF (fitz) is not installed. Please install it with: pip install pymupdf==1.23.6")
        exit(1)
        
    app.run(debug=True, host='0.0.0.0', port=5000) 