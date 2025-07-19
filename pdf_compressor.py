import fitz  # PyMuPDF
import os
import argparse
from typing import Dict, Any, Tuple


class PDFCompressor:
    """PDF compression utility using PyMuPDF (fitz)"""
    
    def __init__(self, compression_level: str = "medium"):
        """
        Initialize the compressor with the desired compression level
        
        Args:
            compression_level: low, medium, high, or extreme
        """
        self.compression_levels = {
            "low": {"dpi": 150, "quality": 85},
            "medium": {"dpi": 120, "quality": 75},
            "high": {"dpi": 96, "quality": 65},
            "extreme": {"dpi": 72, "quality": 50}
        }
        self.compression_level = compression_level
        
    def compress_pdf(self, input_path: str, output_path: str = None) -> Tuple[str, Dict[str, Any]]:
        """
        Compress a PDF file
        
        Args:
            input_path: Path to the input PDF file
            output_path: Path to save the compressed PDF file. If None, will use input_path with _compressed suffix
            
        Returns:
            Tuple of (output_path, stats)
        """
        if output_path is None:
            filename, ext = os.path.splitext(input_path)
            output_path = f"{filename}_compressed{ext}"
            
        # Get original file size
        original_size = os.path.getsize(input_path)
        
        # Get settings from compression level
        settings = self.compression_levels[self.compression_level]
            
        # Open the PDF
        doc = fitz.open(input_path)
        
        # Process each page
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Get the images on the page
            image_list = page.get_images(full=True)
            
            # Process each image
            for img_index, img in enumerate(image_list):
                # Get the image data
                xref = img[0]
                
                try:
                    # Get the image pixmap
                    pix = fitz.Pixmap(doc, xref)
                    
                    # Only process images that need compression
                    if pix.n >= 3:  # RGB or CMYK
                        # Downsample the image if it's large
                        if pix.w > settings["dpi"] * 10 or pix.h > settings["dpi"] * 10:
                            factor = max(1, min(pix.w, pix.h) // (settings["dpi"] * 5))
                            pix = fitz.Pixmap(pix, factor)

                        # Handle alpha channel (transparency)
                        # JPEG doesn't support alpha, so we need to remove it or use PNG
                        has_alpha = pix.alpha
                        if has_alpha:
                            # For images with alpha, use PNG with reduced colors
                            if pix.n == 4:  # RGBA
                                # Remove alpha for JPEG compression
                                bg = fitz.Pixmap(fitz.csRGB, pix.w, pix.h, 0)
                                bg.set_rect(bg.irect, (255, 255, 255))  # white background
                                pix = fitz.Pixmap(bg, pix)  # overlay pixmap on background
                            
                            # Set DPI for the image
                            pix.set_dpi(settings["dpi"], settings["dpi"])
                            imgdata = pix.tobytes("png")  # Use PNG for alpha images
                        else:
                            # Convert CMYK to RGB if needed
                            if pix.n > 4:  # CMYK
                                pix = fitz.Pixmap(fitz.csRGB, pix)
                            
                            # Set DPI for the image
                            pix.set_dpi(settings["dpi"], settings["dpi"])
                            imgdata = pix.tobytes("jpeg", settings["quality"])
                        
                        # Replace the old image with the compressed one
                        doc.delete_object(xref)
                        doc.update_object(xref, imgdata)
                    
                    pix = None  # Free the memory
                except Exception as e:
                    print(f"Error processing image {img_index} on page {page_num}: {e}")
                    # Continue with the next image
            
        # Save the compressed PDF
        doc.save(output_path, 
                 garbage=4,  # Maximum garbage collection
                 clean=True,  # Clean unused entries
                 deflate=True,  # Compress streams
                 linear=True)  # Optimize for web
        doc.close()
        
        # Calculate compression stats
        compressed_size = os.path.getsize(output_path)
        saved_bytes = original_size - compressed_size
        saved_percent = (saved_bytes / original_size) * 100 if original_size > 0 else 0
        
        stats = {
            "original_size": original_size,
            "compressed_size": compressed_size,
            "saved_bytes": saved_bytes,
            "saved_percent": saved_percent,
            "compression_level": self.compression_level
        }
        
        return output_path, stats
    
    
def format_size(size_bytes):
    """Format size in human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024 or unit == 'GB':
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compress PDF files")
    parser.add_argument("input", help="Input PDF file path")
    parser.add_argument("-o", "--output", help="Output PDF file path")
    parser.add_argument("-l", "--level", choices=["low", "medium", "high", "extreme"],
                        default="medium", help="Compression level")
    
    args = parser.parse_args()
    
    compressor = PDFCompressor(compression_level=args.level)
    output_path, stats = compressor.compress_pdf(args.input, args.output)
    
    print(f"PDF compressed successfully!")
    print(f"Original size: {format_size(stats['original_size'])}")
    print(f"Compressed size: {format_size(stats['compressed_size'])}")
    print(f"Saved: {format_size(stats['saved_bytes'])} ({stats['saved_percent']:.2f}%)")
    print(f"Saved to: {output_path}") 