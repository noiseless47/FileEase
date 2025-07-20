import os
import logging
import uuid
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def format_size(size, decimal_places=2):
    """Format file size in bytes to human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024.0 or unit == 'TB':
            break
        size /= 1024.0
    return f"{size:.{decimal_places}f} {unit}"

class ImageCompressor:
    """Class to handle image compression with different quality levels"""
    
    def __init__(self, compression_level='medium'):
        """Initialize with compression level"""
        self.compression_level = compression_level
        
        # Define quality levels for different compression levels
        self.quality_levels = {
            'low': 85,        # High quality, minimal compression
            'medium': 70,     # Good balance between quality and compression
            'high': 50,       # Higher compression, lower quality
            'extreme': 25     # Maximum compression, lowest quality
        }
        
        # Define formats and their specific settings
        self.format_settings = {
            'JPEG': {
                'quality': self.quality_levels.get(compression_level, 70),
                'optimize': True,
                'progressive': True
            },
            'PNG': {
                'optimize': True,
                'compress_level': min(9, int(self.quality_levels.get(compression_level, 70) / 10))
            },
            'WebP': {
                'quality': self.quality_levels.get(compression_level, 70),
                'method': 6  # Higher quality method (0-6), slower but better results
            }
        }
    
    def compress_image(self, input_path, output_path=None):
        """
        Compress an image file
        
        Args:
            input_path (str): Path to the input image
            output_path (str, optional): Path to save the compressed image
            
        Returns:
            tuple: (output_path, stats_dict)
        """
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")
            
        # Generate output path if not provided
        if not output_path:
            filename = os.path.basename(input_path)
            dirname = os.path.dirname(input_path)
            output_path = os.path.join(dirname, f"compressed_{filename}")
        
        # Get original size
        original_size = os.path.getsize(input_path)
        logger.info(f"Original size: {original_size} bytes ({format_size(original_size)})")
        
        try:
            # Open the image
            with Image.open(input_path) as img:
                # Determine the output format
                input_format = img.format
                # Convert if needed and compress
                if input_format == 'JPEG' or input_format == 'JPG':
                    if input_path.lower().endswith('.jpg'):
                        output_format = 'JPEG'
                    else:
                        output_format = input_format
                    img.save(output_path, format=output_format, **self.format_settings['JPEG'])
                elif input_format == 'PNG':
                    img.save(output_path, format=input_format, **self.format_settings['PNG'])
                elif input_format == 'WebP':
                    img.save(output_path, format=input_format, **self.format_settings['WebP'])
                else:
                    # Default to JPEG for unsupported formats
                    logger.warning(f"Converting unsupported format {input_format} to JPEG")
                    # If it has alpha channel, convert to PNG
                    if img.mode == 'RGBA':
                        img.save(output_path, format='PNG', **self.format_settings['PNG'])
                    else:
                        img.save(output_path, format='JPEG', **self.format_settings['JPEG'])
                
                # Get compressed size
                compressed_size = os.path.getsize(output_path)
                logger.info(f"Compressed size: {compressed_size} bytes ({format_size(compressed_size)})")
                
                # Calculate stats
                saved_bytes = original_size - compressed_size
                saved_percent = (saved_bytes / original_size) * 100 if original_size > 0 else 0
                
                stats = {
                    'original_size': original_size,
                    'compressed_size': compressed_size,
                    'saved_bytes': saved_bytes,
                    'saved_percent': saved_percent,
                    'compression_level': self.compression_level,
                    'format': input_format
                }
                
                return output_path, stats
                
        except Exception as e:
            logger.error(f"Error compressing image: {str(e)}")
            raise
    
    def batch_compress_images(self, input_paths, output_dir=None):
        """
        Compress multiple images
        
        Args:
            input_paths (list): List of paths to input images
            output_dir (str, optional): Directory to save compressed images
            
        Returns:
            tuple: (output_paths, stats_dict)
        """
        if not input_paths:
            raise ValueError("No input paths provided")
        
        # Generate output directory if not provided
        if not output_dir:
            output_dir = os.path.dirname(input_paths[0])
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        output_paths = []
        total_original_size = 0
        total_compressed_size = 0
        results = []
        
        for input_path in input_paths:
            try:
                # Generate unique filename for the output
                filename = os.path.basename(input_path)
                name, ext = os.path.splitext(filename)
                unique_id = str(uuid.uuid4())[:8]  # Use first 8 chars of UUID
                output_filename = f"{name}_compressed_{unique_id}{ext}"
                output_path = os.path.join(output_dir, output_filename)
                
                # Compress the image
                compressed_path, stats = self.compress_image(input_path, output_path)
                
                # Update totals
                total_original_size += stats['original_size']
                total_compressed_size += stats['compressed_size']
                
                # Add to results
                output_paths.append(compressed_path)
                results.append({
                    'input_path': input_path,
                    'output_path': compressed_path,
                    'original_size': stats['original_size'],
                    'compressed_size': stats['compressed_size'],
                    'saved_bytes': stats['saved_bytes'],
                    'saved_percent': stats['saved_percent'],
                    'format': stats['format']
                })
                
            except Exception as e:
                logger.error(f"Error processing {input_path}: {str(e)}")
                # Continue processing other images even if one fails
                continue
        
        # Calculate overall stats
        total_saved_bytes = total_original_size - total_compressed_size
        total_saved_percent = (total_saved_bytes / total_original_size) * 100 if total_original_size > 0 else 0
        
        stats = {
            'original_size': total_original_size,
            'compressed_size': total_compressed_size,
            'saved_bytes': total_saved_bytes,
            'saved_percent': total_saved_percent,
            'compression_level': self.compression_level,
            'file_count': len(output_paths),
            'details': results
        }
        
        return output_paths, stats 