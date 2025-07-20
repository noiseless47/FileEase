import os
import logging
import fitz  # PyMuPDF
import uuid
from typing import Dict, Tuple, Any

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PasswordProtector:
    """Class to handle password protection for PDF files"""
    
    def __init__(self):
        """Initialize with default values"""
        self.permissions = {
            'print': False,
            'modify': False,
            'copy': False,
            'annotate': False,
            'form': False,
            'accessibility': True,
            'assemble': False,
        }
    
    def password_protect_pdf(self, 
                             input_path: str, 
                             output_path: str = None, 
                             user_password: str = None, 
                             owner_password: str = None, 
                             permissions: Dict[str, bool] = None) -> Tuple[str, Dict[str, Any]]:
        """
        Add password protection to a PDF file
        
        Args:
            input_path: Path to the PDF file to protect
            output_path: Path for the protected output file
            user_password: Password required to open the document (can be None)
            owner_password: Password required for full access (defaults to user_password if None)
            permissions: Dictionary of permission settings
            
        Returns:
            tuple: (output_path, stats)
        """
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")
            
        # Generate output path if not provided
        if not output_path:
            file_dir = os.path.dirname(input_path)
            file_name = os.path.basename(input_path)
            name, ext = os.path.splitext(file_name)
            output_path = os.path.join(file_dir, f"{name}_protected{ext}")
        
        # Use provided permissions or defaults
        pdf_permissions = permissions or self.permissions
        
        # If owner_password not provided but user_password is, use the same for both
        if owner_password is None and user_password is not None:
            owner_password = user_password
        
        # Calculate permission code
        permission_bits = 0
        if pdf_permissions.get('print', False):
            permission_bits |= fitz.PDF_PERM_PRINT
        if pdf_permissions.get('modify', False):
            permission_bits |= fitz.PDF_PERM_MODIFY
        if pdf_permissions.get('copy', False):
            permission_bits |= fitz.PDF_PERM_COPY
        if pdf_permissions.get('annotate', False):
            permission_bits |= fitz.PDF_PERM_ANNOTATE
        if pdf_permissions.get('form', False):
            permission_bits |= fitz.PDF_PERM_FORM
        if pdf_permissions.get('accessibility', True):
            permission_bits |= fitz.PDF_PERM_ACCESSIBILITY
        if pdf_permissions.get('assemble', False):
            permission_bits |= fitz.PDF_PERM_ASSEMBLE
        
        try:
            # Open the original PDF
            doc = fitz.open(input_path)
            original_size = os.path.getsize(input_path)
            logger.info(f"Original PDF size: {original_size} bytes")
            
            # Set document permissions and passwords
            encryption_method = fitz.PDF_ENCRYPT_AES_256
            
            doc.save(
                output_path,
                encryption=encryption_method,
                user_pw=user_password,
                owner_pw=owner_password,
                permissions=permission_bits
            )
            
            doc.close()
            
            protected_size = os.path.getsize(output_path)
            logger.info(f"Protected PDF size: {protected_size} bytes")
            
            # Return statistics
            stats = {
                "original_size": original_size,
                "protected_size": protected_size,
                "original_filename": os.path.basename(input_path),
                "has_user_password": user_password is not None,
                "has_owner_password": owner_password is not None,
                "permissions": pdf_permissions
            }
            
            return output_path, stats
            
        except Exception as e:
            logger.error(f"Error protecting PDF: {str(e)}")
            raise

    def remove_pdf_password(self, input_path: str, output_path: str = None, password: str = None) -> Tuple[str, Dict[str, Any]]:
        """
        Remove password protection from a PDF file
        
        Args:
            input_path: Path to the password protected PDF file
            output_path: Path for the unprotected output file
            password: Password to open the document
            
        Returns:
            tuple: (output_path, stats)
        """
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")
            
        # Generate output path if not provided
        if not output_path:
            file_dir = os.path.dirname(input_path)
            file_name = os.path.basename(input_path)
            name, ext = os.path.splitext(file_name)
            output_path = os.path.join(file_dir, f"{name}_unprotected{ext}")
        
        try:
            # Open the password protected PDF
            doc = fitz.open(input_path)
            
            # Check if the document is actually encrypted
            if not doc.is_encrypted:
                logger.warning("PDF is not encrypted, no password to remove")
                doc.save(output_path)
                doc.close()
                
                stats = {
                    "original_size": os.path.getsize(input_path),
                    "unprotected_size": os.path.getsize(output_path),
                    "original_filename": os.path.basename(input_path),
                    "was_encrypted": False
                }
                return output_path, stats
            
            # Try to authenticate with the password
            if password:
                authenticated = doc.authenticate(password)
                if not authenticated:
                    raise ValueError("Incorrect password")
            
            # Save without encryption
            doc.save(output_path, encryption=fitz.PDF_ENCRYPT_NONE)
            doc.close()
            
            original_size = os.path.getsize(input_path)
            unprotected_size = os.path.getsize(output_path)
            
            # Return statistics
            stats = {
                "original_size": original_size,
                "unprotected_size": unprotected_size,
                "original_filename": os.path.basename(input_path),
                "was_encrypted": True
            }
            
            return output_path, stats
            
        except Exception as e:
            logger.error(f"Error removing PDF password: {str(e)}")
            raise 