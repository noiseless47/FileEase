"use client";

import { useState, useEffect } from 'react';
import Dropzone from './Dropzone';
import Button from './Button';
import { formatFileSize } from '@/utils/fileCompression';
import { IconZip, IconSettings, IconChevronDown, IconFileZip, IconFileText, IconCheckbox, IconArchive } from '@tabler/icons-react';

type Mode = 'zip' | 'unzip';

interface ZipUnzipProps {
  initialMode?: Mode;
}

export default function ZipUnzip({ initialMode = 'zip' }: ZipUnzipProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(6); // 0-9 range for zip
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const [mode, setMode] = useState<Mode>(initialMode);
  const [result, setResult] = useState<{
    size: number;
    originalSize: number;
    compressionRatio: number;
    completed: boolean;
    fileCount?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
    // Reset state when mode changes
    setFiles([]);
    setResult(null);
    setError(null);
    setOutputFilename('');
  }, [initialMode]);

  // Set default output filename when files are selected
  useEffect(() => {
    if (files.length > 0) {
      if (mode === 'zip') {
        // For zip, use a default archive name
        setOutputFilename('archive.zip');
      } else {
        // For unzip, keep the original filename minus .zip extension if it exists
        const originalName = files[0].name;
        if (originalName.toLowerCase().endsWith('.zip')) {
          const nameWithoutExtension = originalName.slice(0, -4);
          setOutputFilename(nameWithoutExtension);
        } else {
          setOutputFilename('extracted_files');
        }
      }
    } else {
      setOutputFilename('');
    }
  }, [files, mode]);

  const handleFileAccepted = (acceptedFiles: File[]) => {
    if (mode === 'unzip') {
      // For unzip mode, only accept ZIP files
      const zipFiles = acceptedFiles.filter(file => 
        file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')
      );
      
      if (zipFiles.length < acceptedFiles.length) {
        setError('Only ZIP files are supported for extraction');
      }
      
      // Take only the first ZIP file
      setFiles(zipFiles.slice(0, 1));
    } else {
      // For zip mode, accept any files
      setFiles(acceptedFiles);
    }
    
    // Reset result and error when new files are added
    setResult(null);
    setError(null);
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

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setResult(null);
    setError(null);
    
    try {
      // Check if server is running
      const serverRunning = await checkServerStatus();
      if (!serverRunning) {
        throw new Error('Server is not running. Please start the Python backend server.');
      }
      
      if (mode === 'zip') {
        // Create FormData with all files
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files[]', file);
        });
        
        formData.append('compression_level', compressionLevel.toString());
        formData.append('output_filename', outputFilename || 'archive.zip');
        
        // Call the API to zip the files
        const response = await fetch('http://localhost:5000/api/zip-files', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status} ${response.statusText}` }));
          throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
        }
        
        // Get the blob of the zipped file
        const blob = await response.blob();
        
        // Calculate the proper file size from our local files
        // This ensures we have accurate original size data
        const actualTotalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        // Get headers to extract stats, but prefer our local data
        const originalSize = actualTotalSize || Math.max(1, parseInt(response.headers.get('X-Original-Size') || '1'));
        const compressedSize = Math.max(1, blob.size);
        const fileCount = files.length || parseInt(response.headers.get('X-File-Count') || '0');
        
        // Calculate compression ratio with bounds checking
        let compressionRatio = 0;
        if (originalSize > 0 && compressedSize > 0) {
          compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
          // Limit to reasonable range (-1000% to 99.9%)
          compressionRatio = Math.max(-1000, Math.min(99.9, compressionRatio));
        }
        
        setResult({
          originalSize: originalSize,
          size: compressedSize,
          compressionRatio: compressionRatio,
          completed: true,
          fileCount: fileCount
        });
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = outputFilename || 'archive.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Unzip mode
        const formData = new FormData();
        formData.append('file', files[0]);
        
        // Call the API to unzip the file
        const response = await fetch('http://localhost:5000/api/unzip-file', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status} ${response.statusText}` }));
          throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
        }
        
        // Get the blob of the extracted files
        const blob = await response.blob();
        
        // Get headers to extract stats
        const zipSize = Math.max(1, parseInt(response.headers.get('X-Zip-Size') || '1'));
        const extractedSize = Math.max(1, parseInt(response.headers.get('X-Extracted-Size') || '1'));
        const fileCount = parseInt(response.headers.get('X-File-Count') || '0');
        
        // Calculate expansion ratio with bounds checking
        let expansionRatio = 0;
        if (zipSize > 0 && extractedSize > 0) {
          expansionRatio = ((extractedSize - zipSize) / zipSize) * 100;
          // Limit to reasonable range (-99.9% to 10000%)
          expansionRatio = Math.max(-99.9, Math.min(10000, expansionRatio));
        }
        
        setResult({
          originalSize: zipSize,
          size: extractedSize,
          compressionRatio: -expansionRatio, // Negative to indicate expansion
          completed: true,
          fileCount: fileCount
        });
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // For single files, use the original name, for multiple, use zip name
        const contentType = response.headers.get('Content-Type');
        const filename = (contentType === 'application/zip' || fileCount > 1) ? 
          `${outputFilename || 'extracted'}.zip` : 
          response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'extracted_file';
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Processing failed:', error);
      setError(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearFiles = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setOutputFilename('');
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setFiles([]);
    setResult(null);
    setError(null);
    setOutputFilename('');
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  
  // Compression level details
  const compressionOptions = [
    { 
      id: 1, 
      name: 'Fastest', 
      description: 'Minimal compression, fastest speed',
      speedIndicator: 4,
      compressionIndicator: 1,
    },
    { 
      id: 3, 
      name: 'Fast', 
      description: 'Less compression, good speed',
      speedIndicator: 3,
      compressionIndicator: 2,
    },
    { 
      id: 6, 
      name: 'Balanced', 
      description: 'Default - good compression and speed',
      speedIndicator: 2,
      compressionIndicator: 3,
    },
    { 
      id: 9, 
      name: 'Maximum', 
      description: 'Best compression, slower speed',
      speedIndicator: 1,
      compressionIndicator: 4,
    },
  ];

  const selectedOption = compressionOptions.find(option => option.id === compressionLevel) || compressionOptions[2];

  // Helper function to render indicator bars
  const renderIndicator = (level: number, maxLevel: number = 4, type: 'speed' | 'compression') => {
    const colors = {
      speed: 'bg-blue-500',
      compression: 'bg-pink-500'
    };
    
    return (
      <div className="flex gap-0.5">
        {Array(maxLevel).fill(0).map((_, i) => (
          <div 
            key={i}
            className={`w-2 h-2 rounded-full ${i < level ? colors[type] : 'bg-gray-200 dark:bg-gray-700'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">
          {mode === 'zip' ? 'Compress Files into ZIP' : 'Extract Files from ZIP'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {mode === 'zip' 
            ? 'Compress multiple files into a single ZIP archive for easier sharing and storage.' 
            : 'Extract files from a ZIP archive.'}
        </p>
      </div>
      
      <Dropzone 
        onFileAccepted={handleFileAccepted} 
        acceptedFileTypes={
          mode === 'unzip' 
            ? { 'application/zip': ['.zip'] } 
            : undefined  // Accept all file types for zip
        }
        maxFiles={mode === 'unzip' ? 1 : undefined} // Only 1 zip file for unzip, multiple for zip
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {mode === 'zip' ? 'Output ZIP Filename' : 'Output Folder Name'}
            </label>
            <div className="flex items-center">
              {mode === 'zip' 
                ? <IconFileZip className="text-gray-400 w-5 h-5 mr-2" /> 
                : <IconFileText className="text-gray-400 w-5 h-5 mr-2" />
              }
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                placeholder={mode === 'zip' ? 'archive.zip' : 'extracted_files'}
                className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              {mode === 'zip' && !outputFilename.toLowerCase().endsWith('.zip') && (
                <span className="ml-2">.zip</span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {mode === 'zip' 
                ? 'Name for the ZIP file. Default will be used if left empty.' 
                : 'Name for the extracted files.'}
            </p>
          </div>

          {mode === 'zip' && (
            <div>
              <label className="block text-sm font-medium mb-2">Compression Level</label>
              
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <div className="flex items-center">
                    <IconSettings className="mr-2 text-gray-500 dark:text-gray-400" size={18} />
                    <span>{selectedOption.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{selectedOption.description}</span>
                    <IconChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                    {compressionOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`flex flex-col w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 
                                   ${option.id === compressionLevel ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                        onClick={() => {
                          setCompressionLevel(option.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.name}</span>
                          {option.id === compressionLevel && (
                            <IconCheckbox size={18} className="text-pink-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{option.description}</span>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Speed:</span>
                            {renderIndicator(option.speedIndicator, 4, 'speed')}
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Compression:</span>
                            {renderIndicator(option.compressionIndicator, 4, 'compression')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">
                {files.length} {files.length === 1 ? 'file' : 'files'} selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total size: {formatFileSize(totalSize)}
              </p>
            </div>
            <div className="flex space-x-2 justify-end">
              <Button 
                onClick={handleClearFiles} 
                variant="outline"
                className="whitespace-nowrap"
              >
                Clear
              </Button>
              <Button 
                onClick={handleProcess} 
                variant="primary" 
                disabled={isProcessing || files.length === 0}
                loading={isProcessing}
                className="whitespace-nowrap"
              >
                {mode === 'zip' ? 'Create ZIP' : 'Extract Files'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Results section */}
      {result && result.completed && (
        <div className="mt-8 p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/30 rounded-md">
          <h3 className="text-lg font-medium mb-3 text-green-800 dark:text-green-300">
            {mode === 'zip' ? 'ZIP Created Successfully!' : 'Files Extracted Successfully!'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                {mode === 'zip' ? 'Original Size:' : 'ZIP Size:'}
              </p>
              <p className="font-medium">{formatFileSize(result.originalSize || 0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                {mode === 'zip' ? 'Compressed Size:' : 'Extracted Size:'}
              </p>
              <p className="font-medium">{formatFileSize(result.size || 0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                {mode === 'zip' 
                  ? 'Space Saved:' 
                  : 'Size Difference:'
                }
              </p>
              <p className="font-medium">
                {!isNaN(result.compressionRatio) && 
                 result.compressionRatio !== Infinity && 
                 result.compressionRatio !== -Infinity && 
                 Math.abs(result.compressionRatio) < 1000 ? (
                  result.compressionRatio > 0 
                    ? `${parseFloat(result.compressionRatio.toFixed(1))}% smaller` 
                    : `${parseFloat(Math.abs(result.compressionRatio).toFixed(1))}% larger`
                ) : (
                  'Size unchanged'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Files:</p>
              <p className="font-medium">{result.fileCount || files.length || 1}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/30 rounded-md">
          <h3 className="text-lg font-medium mb-2 text-red-800 dark:text-red-300">Error</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
} 