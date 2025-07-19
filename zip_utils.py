import os
import zipfile
import uuid
import logging
from typing import Dict, Any, Tuple, List

logger = logging.getLogger(__name__)

class ZipHandler:
    """Utility class for zipping and unzipping files"""
    
    def __init__(self, compression_level: int = 6):
        """
        Initialize the ZipHandler with compression level
        
        Args:
            compression_level: Integer from 0-9, where 9 is maximum compression
        """
        self.compression_level = min(9, max(0, compression_level))  # Ensure it's between 0-9
    
    def zip_files(self, file_paths: List[str], output_path: str = None) -> Tuple[str, Dict[str, Any]]:
        """
        Create a zip file from multiple files
        
        Args:
            file_paths: List of paths to files to include in the zip
            output_path: Path to save the zip file. If None, will create a filename
            
        Returns:
            Tuple of (output_path, stats)
        """
        if output_path is None:
            output_path = f"archive_{uuid.uuid4()}.zip"
        
        # Get total size of all input files
        total_input_size = 0
        valid_file_count = 0
        for file_path in file_paths:
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
                total_input_size += file_size
                if file_size > 0:
                    valid_file_count += 1
        
        # Ensure we have at least one valid file to compress
        if valid_file_count == 0:
            logger.warning("No valid files to compress")
            # Create an empty zip file anyway
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=self.compression_level):
                pass
            
            # Return minimal stats
            return output_path, {
                "original_size": 0,
                "compressed_size": os.path.getsize(output_path),
                "saved_bytes": 0,
                "saved_percent": 0,
                "compression_level": self.compression_level,
                "file_count": 0
            }
        
        # Create the zip file
        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=self.compression_level) as zipf:
            for file_path in file_paths:
                if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
                    # Get the original filename without the UUID prefix
                    basename = os.path.basename(file_path)
                    # Check if the filename has a UUID prefix (from our upload handling)
                    # Format is typically: "uuid_originalfilename.ext"
                    parts = basename.split('_', 1)
                    if len(parts) > 1 and len(parts[0]) == 36:  # Standard UUID length
                        try:
                            # Validate it's a UUID
                            uuid_obj = uuid.UUID(parts[0])
                            # If valid, use only the original part
                            original_name = parts[1]
                        except ValueError:
                            # If not a valid UUID, use the full basename
                            original_name = basename
                    else:
                        original_name = basename
                    
                    # Add the file to the zip with the original filename
                    zipf.write(file_path, arcname=original_name)
        
        # Get the output zip size
        zip_size = os.path.getsize(output_path)
        
        # Calculate compression stats with safety checks
        if total_input_size > 0:
            saved_bytes = total_input_size - zip_size
            saved_percent = (saved_bytes / total_input_size) * 100
            
            # Limit to reasonable values
            if saved_percent < -1000:
                saved_percent = -1000
            elif saved_percent > 99.9:
                saved_percent = 99.9
        else:
            saved_bytes = 0
            saved_percent = 0
            
        stats = {
            "original_size": total_input_size,
            "compressed_size": zip_size,
            "saved_bytes": saved_bytes,
            "saved_percent": saved_percent,
            "compression_level": self.compression_level,
            "file_count": valid_file_count
        }
        
        return output_path, stats
    
    def unzip_file(self, zip_path: str, extract_dir: str = None) -> Tuple[str, Dict[str, Any]]:
        """
        Extract a zip file
        
        Args:
            zip_path: Path to the zip file to extract
            extract_dir: Directory to extract files to. If None, will create a directory
            
        Returns:
            Tuple of (extract_dir, stats)
        """
        # Check if the file exists and is a zip file
        if not os.path.exists(zip_path):
            raise FileNotFoundError(f"Zip file not found: {zip_path}")
        
        # Create extract directory if needed
        if extract_dir is None:
            zip_name = os.path.splitext(os.path.basename(zip_path))[0]
            extract_dir = f"{zip_name}_extracted_{uuid.uuid4()}"
        
        if not os.path.exists(extract_dir):
            os.makedirs(extract_dir)
        
        # Get the size of the zip file (ensure non-zero)
        zip_size = max(1, os.path.getsize(zip_path))
        
        # Extract the zip file
        extracted_files = []
        try:
            with zipfile.ZipFile(zip_path, 'r') as zipf:
                # Get list of files in the zip
                file_list = zipf.namelist()
                
                # Extract all files
                zipf.extractall(path=extract_dir)
                
                # Get info for each file
                for file_name in file_list:
                    try:
                        file_info = zipf.getinfo(file_name)
                        extracted_files.append({
                            "name": file_name,
                            "size": file_info.file_size,
                            "compressed_size": file_info.compress_size,
                            "path": os.path.join(extract_dir, file_name)
                        })
                    except Exception as e:
                        logger.warning(f"Error getting info for file {file_name}: {e}")
        except zipfile.BadZipFile:
            logger.error(f"Bad zip file: {zip_path}")
            raise ValueError(f"Invalid ZIP file: {zip_path}")
        
        # Calculate total extracted size
        total_extracted_size = sum(file["size"] for file in extracted_files)
        
        # Calculate expansion ratio with safety checks
        if zip_size > 0 and total_extracted_size > 0:
            expansion_ratio = (total_extracted_size / zip_size)
            # Limit to reasonable values to avoid extreme percentages
            if expansion_ratio > 100:
                expansion_ratio = 100
        else:
            expansion_ratio = 1
        
        stats = {
            "zip_size": zip_size,
            "total_extracted_size": total_extracted_size,
            "expansion_ratio": expansion_ratio,
            "file_count": len(extracted_files),
            "extracted_files": extracted_files
        }
        
        return extract_dir, stats

def format_size(size_bytes):
    """Format size in human-readable format"""
    if size_bytes == 0:
        return "0 B"
        
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024 or unit == 'GB':
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024 