from flask import Flask, request, jsonify, send_file
import os
import tempfile
from pdf_compressor import PDFCompressor, format_size
import uuid
import traceback
import logging
from flask_cors import CORS  # Add CORS support

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   handlers=[logging.StreamHandler()])
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max upload size

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
COMPRESSED_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'compressed')

for folder in [UPLOAD_FOLDER, COMPRESSED_FOLDER]:
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

if __name__ == '__main__':
    try:
        # Verify PyMuPDF is installed correctly
        import fitz
        logger.info(f"PyMuPDF (fitz) version: {fitz.__version__}")
    except ImportError:
        logger.critical("PyMuPDF (fitz) is not installed. Please install it with: pip install pymupdf==1.23.6")
        exit(1)
        
    app.run(debug=True, host='0.0.0.0', port=5000) 