"use client";

import { useState, useEffect, useRef } from 'react';
import Dropzone from './Dropzone';
import Button from './Button';
import { formatFileSize } from '@/utils/fileCompression';
import { 
  IconCheck, 
  IconLock, 
  IconLockOpen, 
  IconAlertCircle,
  IconEye, 
  IconEyeOff, 
  IconChevronDown,
  IconFileText
} from '@tabler/icons-react';

type SecureMode = 'encrypt' | 'decrypt';

interface SecureFilesProps {
  initialMode?: SecureMode;
}

export default function SecureFiles({ initialMode = 'encrypt' }: SecureFilesProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<SecureMode>(initialMode);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [result, setResult] = useState<{
    size: number;
    originalSize: number;
    completed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Set default output filename when a file is selected
  useEffect(() => {
    if (files.length > 0) {
      const originalName = files[0].name;
      if (mode === 'encrypt') {
        // For encryption, add "_secured" to the filename
        if (files.length === 1) {
          // For single file
          const extension = originalName.split('.').pop();
          const nameWithoutExtension = originalName.replace(`.${extension}`, '');
          setOutputFilename(`${nameWithoutExtension}_secured.${extension}`);
        } else {
          // For multiple files
          setOutputFilename('secured_files.sfp');
        }
      } else {
        // For decryption, remove "_secured" from the filename if present
        if (originalName.includes('_secured')) {
          setOutputFilename(originalName.replace('_secured', ''));
        } else if (originalName.endsWith('.sfp')) {
          setOutputFilename(originalName.replace('.sfp', ''));
        } else {
          setOutputFilename(`decrypted_${originalName}`);
        }
      }
    } else {
      setOutputFilename('');
    }
  }, [files, mode]);

  const handleFileAccepted = (acceptedFiles: File[]) => {
    // Reset errors and results
    setError(null);
    setResult(null);
    setPasswordError(null);
    
    // In decrypt mode, only accept one file
    if (mode === 'decrypt' && acceptedFiles.length > 1) {
      setFiles([acceptedFiles[0]]);
      // Check if it's an .sfp file
      if (!acceptedFiles[0].name.toLowerCase().endsWith('.sfp')) {
        setError('For decryption, please select a secure file (.sfp) or an encrypted file.');
      }
    } else {
      setFiles(acceptedFiles);
    }
  };

  // Check if the server is running
  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  };

  const validatePasswords = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    
    if (mode === 'encrypt' && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    setPasswordError(null);
    return true;
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    if (!validatePasswords()) return;
    
    setIsProcessing(true);
    setResult(null);
    setError(null);
    setProgress(0);
    
    // Start progress simulation
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        // Increase progressively, but not to 100% until process is complete
        if (prev < 90) {
          return prev + Math.random() * 5;
        }
        return prev;
      });
    }, 200);
    
    try {
      // Check if server is running
      const serverRunning = await checkServerStatus();
      if (!serverRunning) {
        throw new Error('Server is not running. Please start the Python backend server.');
      }
      
      let endpoint = '';
      let formData = new FormData();
      
      // Prepare form data based on mode
      if (mode === 'encrypt') {
        if (files.length === 1) {
          // Single file encryption
          endpoint = '/api/secure-file';
          formData.append('file', files[0]);
          formData.append('password', password);
          formData.append('output_filename', outputFilename || `secured_${files[0].name}`);
        } else {
          // Multiple files encryption
          endpoint = '/api/secure-multiple';
          files.forEach(file => {
            formData.append('files[]', file);
          });
          formData.append('password', password);
          formData.append('output_filename', outputFilename || 'secured_files.sfp');
        }
      } else {
        // Decryption (always single file)
        endpoint = '/api/decrypt-file';
        formData.append('file', files[0]);
        formData.append('password', password);
      }
      
      // Call the API
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        // Check for specific error status codes
        if (response.status === 403) {
          throw new Error('Incorrect password or corrupted file.');
        }
        
        const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status} ${response.statusText}` }));
        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob of the processed file
      const blob = await response.blob();
      
      // Get headers to extract stats
      let originalSize, processedSize;
      
      if (mode === 'encrypt') {
        originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
        processedSize = parseInt(response.headers.get('X-Encrypted-Size') || response.headers.get('X-Secured-Size') || '0');
      } else {
        originalSize = parseInt(response.headers.get('X-Encrypted-Size') || '0');
        processedSize = parseInt(response.headers.get('X-Decrypted-Size') || '0');
      }
      
      // Complete the progress bar
      setProgress(100);
      
      // Determine the output filename from Content-Disposition header if available
      let downloadName = '';
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (filenameMatch && filenameMatch[1]) {
          downloadName = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      if (!downloadName) {
        downloadName = outputFilename || (mode === 'encrypt' ? 
          (files.length === 1 ? `secured_${files[0].name}` : 'secured_files.sfp') : 
          `decrypted_${files[0].name}`);
      }
      
      setResult({
        originalSize: originalSize || (files.length === 1 ? files[0].size : files.reduce((total, file) => total + file.size, 0)),
        size: processedSize || blob.size,
        completed: true,
      });
      
      // Create a download link for the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Processing failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to process the file');
      setProgress(0);
    } finally {
      // Clear the progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsProcessing(false);
    }
  };

  const handleClearFiles = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setOutputFilename('');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">
          {mode === 'encrypt' ? 'Secure Your Files' : 'Access Secure Files'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {mode === 'encrypt' 
            ? 'Protect your sensitive files with strong password encryption. Perfect for secure sharing and storage.' 
            : 'Decrypt and access your secure files with your password.'}
        </p>
      </div>
      
      <Dropzone 
        onFileAccepted={handleFileAccepted}
        maxFiles={mode === 'decrypt' ? 1 : undefined}
        acceptedFileTypes={mode === 'decrypt' ? {
          'application/octet-stream': ['.sfp', '.enc', '.*']
        } : undefined}
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Selected Files ({files.length})</h4>
            {files.length === 1 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconFileText className="text-gray-400 w-5 h-5 mr-2" />
                  <span className="truncate max-w-[200px]">{files[0].name}</span>
                </div>
                <span className="text-sm text-gray-500">{formatFileSize(files[0].size)}</span>
              </div>
            ) : (
              <div className="space-y-1 max-h-[120px] overflow-y-auto pr-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <IconFileText className="text-gray-400 w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <span className="text-gray-500 ml-2">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-2">
              Total size: {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Output Filename</label>
            <div className="flex items-center">
              <IconFileText className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                placeholder={mode === 'encrypt' ? "secured_file.sfp" : "decrypted_file"}
                className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Name for the {mode === 'encrypt' ? 'secured' : 'decrypted'} file. Default will be used if left empty.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-2 pr-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center"
              >
                {showPassword ? (
                  <IconEyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <IconEye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {mode === 'encrypt' && (
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPassword ? (
                    <IconEyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <IconEye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {passwordError && (
            <div className="text-sm text-red-500">
              {passwordError}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || files.length === 0 || !password || (mode === 'encrypt' && !confirmPassword)}
              variant="primary"
              size="md"
            >
              {isProcessing ? 'Processing...' : mode === 'encrypt' ? 'Encrypt Files' : 'Decrypt File'}
            </Button>
            
            <Button
              onClick={handleClearFiles}
              disabled={isProcessing || files.length === 0}
              variant="outline"
              size="md"
            >
              Clear Files
            </Button>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'encrypt' ? 'Encrypting...' : 'Decrypting...'}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progress < 100 
                  ? `Please wait while we ${mode === 'encrypt' ? 'encrypt' : 'decrypt'} your file${files.length > 1 ? 's' : ''}...` 
                  : `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} complete! Downloading your file...`
                }
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg">
              <div className="flex items-start">
                <IconAlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    {mode === 'encrypt' ? 'Encryption' : 'Decryption'} Failed
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                  {error.includes('server is not running') && (
                    <div className="mt-2 text-xs text-red-700 dark:text-red-400">
                      <p>Make sure you have:</p>
                      <ol className="list-decimal ml-5 mt-1 space-y-1">
                        <li>Installed all Python dependencies with <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">pip install -r requirements.txt</code></li>
                        <li>Started the Python server with <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">python app.py</code></li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {result && result.completed && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
                {mode === 'encrypt' ? 'Encryption' : 'Decryption'} Complete!
              </h4>
              <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                <p>
                  {mode === 'encrypt' 
                    ? `Original size: ${formatFileSize(result.originalSize)}` 
                    : `Encrypted size: ${formatFileSize(result.originalSize)}`}
                </p>
                <p>
                  {mode === 'encrypt' 
                    ? `Encrypted size: ${formatFileSize(result.size)}` 
                    : `Decrypted size: ${formatFileSize(result.size)}`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-2">Security Information</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Files are {mode === 'encrypt' ? 'encrypted' : 'decrypted'} using AES-256 encryption with a unique salt for each file.
          {mode === 'encrypt' ? (
            ' Make sure to remember your password as there is no way to recover your files without it.'
          ) : (
            ' You must provide the correct password that was used to encrypt the file.'
          )}
        </p>
      </div>
    </div>
  );
} 