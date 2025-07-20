import os
import uuid
import hashlib
import logging
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import zipfile
import json
from io import BytesIO

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SecureFileHandler:
    """Class to handle secure file operations with password protection"""
    
    def __init__(self):
        """Initialize with default values"""
        self.salt_size = 16
        self.iterations = 100000
        
    def _generate_key_from_password(self, password, salt=None):
        """
        Generate an encryption key from a password using PBKDF2
        
        Args:
            password (str): User-provided password
            salt (bytes, optional): Salt for key derivation, generated if not provided
            
        Returns:
            tuple: (key, salt)
        """
        if salt is None:
            salt = os.urandom(self.salt_size)
            
        password_bytes = password.encode('utf-8')
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=self.iterations,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
        return key, salt
    
    def encrypt_file(self, file_path, password, output_path=None):
        """
        Encrypt a file with a password
        
        Args:
            file_path (str): Path to the file to encrypt
            password (str): Password for encryption
            output_path (str, optional): Path to save the encrypted file
            
        Returns:
            tuple: (output_path, stats)
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Input file not found: {file_path}")
            
        # Generate output path if not provided
        if not output_path:
            file_dir = os.path.dirname(file_path)
            file_name = os.path.basename(file_path)
            name, ext = os.path.splitext(file_name)
            output_path = os.path.join(file_dir, f"{name}_secured{ext}")
        
        try:
            # Read the original file
            with open(file_path, 'rb') as f:
                file_data = f.read()
                
            original_size = len(file_data)
            logger.info(f"Original file size: {original_size} bytes")
            
            # Generate key from password with a new salt
            salt = os.urandom(self.salt_size)
            key, _ = self._generate_key_from_password(password, salt)
            
            # Create a Fernet cipher with the key
            cipher = Fernet(key)
            
            # Encrypt the file data
            encrypted_data = cipher.encrypt(file_data)
            
            # Create a metadata structure (including salt)
            metadata = {
                "salt": base64.b64encode(salt).decode('utf-8'),
                "iterations": self.iterations,
                "filename": os.path.basename(file_path)
            }
            
            metadata_json = json.dumps(metadata).encode('utf-8')
            metadata_length = len(metadata_json).to_bytes(4, byteorder='big')
            
            # Write the encrypted file with metadata
            with open(output_path, 'wb') as f:
                # Write format identifier
                f.write(b'SECFILE')
                # Write metadata length (4 bytes)
                f.write(metadata_length)
                # Write metadata JSON
                f.write(metadata_json)
                # Write encrypted data
                f.write(encrypted_data)
                
            encrypted_size = os.path.getsize(output_path)
            logger.info(f"Encrypted file size: {encrypted_size} bytes")
            
            # Return statistics
            stats = {
                "original_size": original_size,
                "encrypted_size": encrypted_size,
                "original_filename": os.path.basename(file_path)
            }
            
            return output_path, stats
            
        except Exception as e:
            logger.error(f"Error encrypting file: {str(e)}")
            raise
    
    def decrypt_file(self, encrypted_file_path, password, output_path=None):
        """
        Decrypt a file with a password
        
        Args:
            encrypted_file_path (str): Path to the encrypted file
            password (str): Password for decryption
            output_path (str, optional): Path to save the decrypted file
            
        Returns:
            tuple: (output_path, stats)
        """
        if not os.path.exists(encrypted_file_path):
            raise FileNotFoundError(f"Encrypted file not found: {encrypted_file_path}")
        
        try:
            # Read the encrypted file
            with open(encrypted_file_path, 'rb') as f:
                # Check format identifier
                identifier = f.read(7)
                if identifier != b'SECFILE':
                    raise ValueError("Not a valid secured file format")
                
                # Read metadata length
                metadata_length_bytes = f.read(4)
                metadata_length = int.from_bytes(metadata_length_bytes, byteorder='big')
                
                # Read metadata
                metadata_json = f.read(metadata_length)
                metadata = json.loads(metadata_json.decode('utf-8'))
                
                # Get salt and iterations from metadata
                salt = base64.b64decode(metadata['salt'])
                iterations = metadata.get('iterations', self.iterations)
                original_filename = metadata.get('filename', 'decrypted_file')
                
                # Read encrypted data
                encrypted_data = f.read()
            
            # Generate key from password and salt
            key, _ = self._generate_key_from_password(password, salt)
            
            # Create a Fernet cipher with the key
            cipher = Fernet(key)
            
            # Try to decrypt the data
            try:
                decrypted_data = cipher.decrypt(encrypted_data)
            except Exception as e:
                logger.error(f"Decryption failed: {str(e)}")
                raise ValueError("Invalid password or corrupted file")
            
            # Generate output path if not provided
            if not output_path:
                file_dir = os.path.dirname(encrypted_file_path)
                output_path = os.path.join(file_dir, f"decrypted_{original_filename}")
            
            # Write the decrypted file
            with open(output_path, 'wb') as f:
                f.write(decrypted_data)
                
            encrypted_size = os.path.getsize(encrypted_file_path)
            decrypted_size = os.path.getsize(output_path)
            
            # Return statistics
            stats = {
                "encrypted_size": encrypted_size,
                "decrypted_size": decrypted_size,
                "original_filename": original_filename
            }
            
            return output_path, stats
            
        except Exception as e:
            logger.error(f"Error decrypting file: {str(e)}")
            raise
    
    def secure_multiple_files(self, file_paths, password, output_dir=None, output_filename=None):
        """
        Encrypt and package multiple files with password protection
        
        Args:
            file_paths (list): Paths to the files to secure
            password (str): Password for encryption
            output_dir (str, optional): Directory to save the secured package
            output_filename (str, optional): Name for the output file
            
        Returns:
            tuple: (output_path, stats)
        """
        if not file_paths:
            raise ValueError("No files provided")
            
        # Generate output details if not provided
        if not output_dir:
            output_dir = os.path.dirname(file_paths[0])
        
        if not output_filename:
            output_filename = f"secured_files_{uuid.uuid4().hex[:8]}.sfp"  # Secure File Package
            
        output_path = os.path.join(output_dir, output_filename)
        
        # Create a zip file in memory
        zip_buffer = BytesIO()
        total_original_size = 0
        file_count = 0
        
        try:
            # Generate key from password with a new salt
            salt = os.urandom(self.salt_size)
            key, _ = self._generate_key_from_password(password, salt)
            
            # Create a Fernet cipher with the key
            cipher = Fernet(key)
            
            # Create a temporary zip file
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_path in file_paths:
                    if not os.path.exists(file_path):
                        logger.warning(f"File not found, skipping: {file_path}")
                        continue
                        
                    # Read file data
                    with open(file_path, 'rb') as f:
                        file_data = f.read()
                    
                    file_size = len(file_data)
                    total_original_size += file_size
                    
                    # Encrypt the file data
                    encrypted_data = cipher.encrypt(file_data)
                    
                    # Add to zip with original filename
                    filename = os.path.basename(file_path)
                    zipf.writestr(filename, encrypted_data)
                    file_count += 1
            
            # Get the zip data
            zip_data = zip_buffer.getvalue()
            
            # Create metadata
            metadata = {
                "salt": base64.b64encode(salt).decode('utf-8'),
                "iterations": self.iterations,
                "file_count": file_count,
                "version": "1.0"
            }
            
            metadata_json = json.dumps(metadata).encode('utf-8')
            metadata_length = len(metadata_json).to_bytes(4, byteorder='big')
            
            # Write the final secured package file
            with open(output_path, 'wb') as f:
                # Write format identifier
                f.write(b'SECPACK')
                # Write metadata length (4 bytes)
                f.write(metadata_length)
                # Write metadata JSON
                f.write(metadata_json)
                # Write encrypted zip data
                f.write(zip_data)
            
            # Get final file size
            secured_size = os.path.getsize(output_path)
            
            # Return statistics
            stats = {
                "original_size": total_original_size,
                "secured_size": secured_size,
                "file_count": file_count
            }
            
            return output_path, stats
            
        except Exception as e:
            logger.error(f"Error creating secure file package: {str(e)}")
            raise
        finally:
            zip_buffer.close()
    
    def extract_secure_package(self, package_path, password, output_dir=None):
        """
        Extract files from a secured package
        
        Args:
            package_path (str): Path to the secured package file
            password (str): Password for decryption
            output_dir (str, optional): Directory to extract files to
            
        Returns:
            tuple: (output_dir, stats)
        """
        if not os.path.exists(package_path):
            raise FileNotFoundError(f"Secure package not found: {package_path}")
        
        # Generate output directory if not provided
        if not output_dir:
            dir_name = os.path.dirname(package_path)
            base_name = os.path.basename(package_path).split('.')[0]
            output_dir = os.path.join(dir_name, f"{base_name}_extracted")
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        try:
            # Read the secure package
            with open(package_path, 'rb') as f:
                # Check format identifier
                identifier = f.read(7)
                if identifier != b'SECPACK':
                    raise ValueError("Not a valid secure package format")
                
                # Read metadata length
                metadata_length_bytes = f.read(4)
                metadata_length = int.from_bytes(metadata_length_bytes, byteorder='big')
                
                # Read metadata
                metadata_json = f.read(metadata_length)
                metadata = json.loads(metadata_json.decode('utf-8'))
                
                # Get salt and iterations from metadata
                salt = base64.b64decode(metadata['salt'])
                iterations = metadata.get('iterations', self.iterations)
                file_count = metadata.get('file_count', 0)
                
                # Read the encrypted zip data
                encrypted_zip_data = f.read()
            
            # Generate key from password and salt
            key, _ = self._generate_key_from_password(password, salt)
            
            # Create a Fernet cipher with the key
            cipher = Fernet(key)
            
            # Extract files from the encrypted zip
            total_extracted_size = 0
            extracted_files = []
            
            try:
                # Load the zip data from memory
                zip_buffer = BytesIO(encrypted_zip_data)
                
                with zipfile.ZipFile(zip_buffer, 'r') as zipf:
                    for file_info in zipf.infolist():
                        # Get the encrypted data
                        encrypted_data = zipf.read(file_info.filename)
                        
                        # Decrypt the data
                        try:
                            decrypted_data = cipher.decrypt(encrypted_data)
                        except Exception as e:
                            logger.error(f"Failed to decrypt file {file_info.filename}: {str(e)}")
                            raise ValueError("Invalid password or corrupted file")
                        
                        # Save the decrypted file
                        output_file_path = os.path.join(output_dir, file_info.filename)
                        with open(output_file_path, 'wb') as f:
                            f.write(decrypted_data)
                        
                        file_size = len(decrypted_data)
                        total_extracted_size += file_size
                        
                        extracted_files.append({
                            'path': output_file_path,
                            'name': file_info.filename,
                            'size': file_size
                        })
                
            finally:
                zip_buffer.close()
            
            # Return statistics
            stats = {
                "package_size": os.path.getsize(package_path),
                "total_extracted_size": total_extracted_size,
                "file_count": len(extracted_files),
                "extracted_files": extracted_files
            }
            
            return output_dir, stats
            
        except Exception as e:
            logger.error(f"Error extracting secure package: {str(e)}")
            raise 