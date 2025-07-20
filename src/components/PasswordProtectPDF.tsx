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
  IconFileText,
  IconSettings
} from '@tabler/icons-react';

type ProtectMode = 'protect' | 'unlock';

interface PasswordProtectPDFProps {
  initialMode?: ProtectMode;
}

export default function PasswordProtectPDF({ initialMode = 'protect' }: PasswordProtectPDFProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<ProtectMode>(initialMode);
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [password, setPassword] = useState(''); // For unlocking
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState({
    print: false,
    modify: false,
    copy: false,
    annotate: false,
    form: false,
    accessibility: true,
    assemble: false
  });
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
    if (file) {
      const originalName = file.name;
      if (mode === 'protect') {
        // For protection, add "_protected" to the filename
        const extension = originalName.split('.').pop();
        const nameWithoutExtension = originalName.replace(`.${extension}`, '');
        setOutputFilename(`${nameWithoutExtension}_protected.${extension}`);
      } else {
        // For unlocking, remove "_protected" from the filename if present
        if (originalName.includes('_protected')) {
          setOutputFilename(originalName.replace('_protected', ''));
        } else {
          setOutputFilename(`unlocked_${originalName}`);
        }
      }
    } else {
      setOutputFilename('');
    }
  }, [file, mode]);

  const handleFileAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Reset errors and results
    setError(null);
    setResult(null);
    setPasswordError(null);
    
    // We only handle one PDF at a time for password protection
    setFile(acceptedFiles[0]);
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
    if (mode === 'protect') {
      if (!userPassword && !ownerPassword) {
        setPasswordError('At least one password (User or Owner) is required');
        return false;
      }
    } else { // unlock mode
      if (!password) {
        setPasswordError('Password is required to unlock the PDF');
        return false;
      }
    }
    
    setPasswordError(null);
    return true;
  };

  const handleProcess = async () => {
    if (!file) return;
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
      
      const endpoint = mode === 'protect' ? '/api/protect-pdf' : '/api/unlock-pdf';
      const formData = new FormData();
      
      // Prepare form data based on mode
      formData.append('file', file);
      
      if (mode === 'protect') {
        if (userPassword) formData.append('user_password', userPassword);
        if (ownerPassword) formData.append('owner_password', ownerPassword);
        
        // Add permissions
        Object.entries(permissions).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
      } else {
        formData.append('password', password);
      }
      
      if (outputFilename) {
        formData.append('output_filename', outputFilename);
      }
      
      // Call the API
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        // Check for specific error status codes
        if (response.status === 403) {
          throw new Error('Incorrect password for this PDF.');
        }
        
        const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status} ${response.statusText}` }));
        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob of the processed file
      const blob = await response.blob();
      
      // Get headers to extract stats
      let originalSize, processedSize;
      
      if (mode === 'protect') {
        originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
        processedSize = parseInt(response.headers.get('X-Protected-Size') || '0');
      } else {
        originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
        processedSize = parseInt(response.headers.get('X-Unlocked-Size') || '0');
      }
      
      // Complete the progress bar
      setProgress(100);
      
      // Determine the output filename from Content-Disposition header if available
      let downloadName = outputFilename || (mode === 'protect' ? `protected_${file.name}` : `unlocked_${file.name}`);
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (filenameMatch && filenameMatch[1]) {
          downloadName = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      setResult({
        originalSize: originalSize || file.size,
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

  const handleClearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setOutputFilename('');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleAdvancedSettings = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
  };

  const updatePermission = (key: keyof typeof permissions, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">
          {mode === 'protect' ? 'Password Protect PDF' : 'Remove PDF Password'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {mode === 'protect' 
            ? 'Add password protection to your PDF files with customizable permissions.' 
            : 'Remove password protection from your PDF files.'}
        </p>
      </div>
      
      <Dropzone 
        onFileAccepted={handleFileAccepted}
        maxFiles={1}
        acceptedFileTypes={{
          'application/pdf': ['.pdf']
        }}
      />

      {file && (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-2">Selected File</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IconFileText className="text-gray-400 w-5 h-5 mr-2" />
                <span className="truncate max-w-[200px]">{file.name}</span>
              </div>
              <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
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
                placeholder={mode === 'protect' ? "protected_document.pdf" : "unlocked_document.pdf"}
                className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Name for the {mode === 'protect' ? 'protected' : 'unlocked'} PDF file. Default will be used if left empty.
            </p>
          </div>

          {mode === 'protect' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">User Password (to open document)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="Password required to open PDF"
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
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Password required to open and view the document.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Owner Password (full access)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="Password for full access rights"
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
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Password that grants full access rights to the document.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={toggleAdvancedSettings}
                  className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  <IconSettings className="w-4 h-4 mr-1" />
                  {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                </button>
                
                {showAdvancedSettings && (
                  <div className="mt-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-2">Permission Settings</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      Control what users can do with your PDF
                    </p>
                    
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.print}
                          onChange={(e) => updatePermission('print', e.target.checked)}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">Allow printing</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.copy}
                          onChange={(e) => updatePermission('copy', e.target.checked)}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">Allow copying text & images</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.modify}
                          onChange={(e) => updatePermission('modify', e.target.checked)}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">Allow modification</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.annotate}
                          onChange={(e) => updatePermission('annotate', e.target.checked)}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">Allow annotations</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.form}
                          onChange={(e) => updatePermission('form', e.target.checked)}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">Allow form filling</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.accessibility}
                          onChange={(e) => updatePermission('accessibility', e.target.checked)}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">Allow accessibility (screen readers)</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={permissions.assemble}
                          onChange={(e) => updatePermission('assemble', e.target.checked)}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">Allow document assembly</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the PDF password"
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
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter the password required to unlock this PDF.
              </p>
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
              disabled={isProcessing || !file || (mode === 'protect' && !userPassword && !ownerPassword) || (mode === 'unlock' && !password)}
              variant="primary"
              size="md"
            >
              {isProcessing ? 'Processing...' : mode === 'protect' ? 'Protect PDF' : 'Unlock PDF'}
            </Button>
            
            <Button
              onClick={handleClearFile}
              disabled={isProcessing || !file}
              variant="outline"
              size="md"
            >
              Clear File
            </Button>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {mode === 'protect' ? 'Adding protection...' : 'Removing protection...'}
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
                  ? `Please wait while we ${mode === 'protect' ? 'add protection to' : 'unlock'} your PDF...` 
                  : `${mode === 'protect' ? 'Protection' : 'Unlocking'} complete! Downloading your file...`
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
                    {mode === 'protect' ? 'Protection' : 'Unlocking'} Failed
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
                {mode === 'protect' ? 'PDF Protected Successfully!' : 'PDF Unlocked Successfully!'}
              </h4>
              <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                <p>Original size: {formatFileSize(result.originalSize)}</p>
                <p>{mode === 'protect' ? 'Protected' : 'Unlocked'} size: {formatFileSize(result.size)}</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-2">About PDF Password Protection</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {mode === 'protect' 
            ? 'Password protection adds a layer of security to your PDF files. You can set different permissions to control what users can do with your document.' 
            : 'PDF password removal helps you unlock protected documents when you have the correct password.'}
        </p>
      </div>
    </div>
  );
} 