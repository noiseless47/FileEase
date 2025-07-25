"use client";

import { useState, useEffect, useRef } from 'react';
import Dropzone from './Dropzone';
import Button from './Button';
import { formatFileSize } from '@/utils/fileCompression';
import { IconCheck, IconSettings, IconChevronDown, IconZoomExclamation, IconZoomIn, IconZoomOut, IconRocket, IconAlertCircle, IconFileText, IconPhoto } from '@tabler/icons-react';

export default function CompressImages() {
  const [files, setFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [outputFilename, setOutputFilename] = useState('');
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [result, setResult] = useState<{
    size: number;
    originalSize: number;
    compressionRatio: number;
    completed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      const extension = originalName.split('.').pop();
      const nameWithoutExtension = originalName.replace(`.${extension}`, '');
      setOutputFilename(`${nameWithoutExtension}_compressed.${extension}`);
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(fileUrl);
      
      // Clean up URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(fileUrl);
      };
    } else {
      setOutputFilename('');
      setPreviewUrl(null);
    }
  }, [files]);

  const handleFileAccepted = (acceptedFiles: File[]) => {
    // Filter to only accept image files
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || 
      /\.(jpg|jpeg|png|webp)$/i.test(file.name)
    );
    
    if (imageFiles.length < acceptedFiles.length) {
      alert('Only image files (JPG, JPEG, PNG, WebP) are supported for compression');
    }
    
    // Replace existing files instead of adding to them
    setFiles(imageFiles.slice(0, 1)); // Only take the first image
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

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setIsCompressing(true);
    setResult(null);
    setError(null);
    setProgress(0);
    
    // Start progress simulation
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        // Increase progressively, but not to 100% until compression is complete
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
        throw new Error('Compression server is not running. Please start the Python backend server.');
      }
      
      // For each image file, send it to our compression API
      const formData = new FormData();
      formData.append('file', files[0]); // Currently only handling one image at a time
      formData.append('compression_level', compressionLevel);
      formData.append('output_filename', outputFilename || `compressed_${files[0].name}`);
      
      // Call the API to compress the image
      const response = await fetch('http://localhost:5000/api/compress-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status} ${response.statusText}` }));
        throw new Error(errorData.error || `Server error: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob of the compressed file
      const blob = await response.blob();
      
      // Get headers to extract stats or calculate from file sizes
      const originalSize = parseInt(response.headers.get('X-Original-Size') || '0') || files[0].size;
      const compressedSize = blob.size;
      
      // Calculate compression ratio properly:
      // Positive number = reduction percentage (smaller file)
      // Negative number = increase percentage (larger file)
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
      
      // Complete the progress bar
      setProgress(100);
      
      setResult({
        originalSize: originalSize,
        size: compressedSize,
        compressionRatio: compressionRatio,
        completed: true,
      });
      
      // Create a download link for the compressed file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = outputFilename || `compressed_${files[0].name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Compression failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to compress the image');
      // Reset progress on error
      setProgress(0);
    } finally {
      // Clear the progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsCompressing(false);
    }
  };

  const handleClearFiles = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setOutputFilename('');
    setPreviewUrl(null);
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  
  // Compression level details
  const compressionOptions = [
    { 
      id: 'low', 
      name: 'Low', 
      description: 'Fast compression, maintains high image quality',
      icon: <IconRocket size={18} />,
      speedIndicator: 3,
      qualityIndicator: 3,
      compressionIndicator: 1,
    },
    { 
      id: 'medium', 
      name: 'Medium', 
      description: 'Balanced compression and image quality',
      icon: <IconZoomOut size={18} />,
      speedIndicator: 2,
      qualityIndicator: 2,
      compressionIndicator: 2,
    },
    { 
      id: 'high', 
      name: 'High', 
      description: 'Better compression, reduced image quality',
      icon: <IconZoomIn size={18} />,
      speedIndicator: 1,
      qualityIndicator: 2,
      compressionIndicator: 3,
    },
    { 
      id: 'extreme', 
      name: 'Extreme', 
      description: 'Maximum compression, lowest image quality',
      icon: <IconZoomExclamation size={18} />,
      speedIndicator: 1,
      qualityIndicator: 1,
      compressionIndicator: 4,
    },
  ];

  const selectedOption = compressionOptions.find(option => option.id === compressionLevel);

  // Helper function to render indicator bars
  const renderIndicator = (level: number, maxLevel: number = 4, type: 'speed' | 'quality' | 'compression') => {
    const colors = {
      speed: 'bg-blue-500',
      quality: 'bg-green-500', 
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
        <h2 className="text-xl font-bold mb-2">Image Compression Tool</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Reduce your image file size while maintaining good visual quality. Perfect for websites, email attachments, and social media.
        </p>
      </div>
      
      <Dropzone 
        onFileAccepted={handleFileAccepted} 
        acceptedFileTypes={{
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
          'image/webp': ['.webp']
        }}
        maxFiles={1}
      />

      {previewUrl && (
        <div className="mt-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Image Preview</h4>
          <div className="flex justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-[200px] rounded shadow-sm"
              style={{ maxWidth: '100%' }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {files.length > 0 && `${files[0].name} • ${formatFileSize(files[0].size)}`}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Output Filename</label>
            <div className="flex items-center">
              <IconPhoto className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                placeholder="compressed_image.jpg"
                className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Name for the compressed file. Default will be added if left empty.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Compression Level</label>
            
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <div className="flex items-center gap-2">
                  {selectedOption?.icon}
                  <span>{selectedOption?.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-4 pr-2 border-r border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Speed</span>
                      {renderIndicator(selectedOption?.speedIndicator || 0, 3, 'speed')}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Quality</span>
                      {renderIndicator(selectedOption?.qualityIndicator || 0, 3, 'quality')}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Compression</span>
                      {renderIndicator(selectedOption?.compressionIndicator || 0, 4, 'compression')}
                    </div>
                  </div>
                  <IconChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <ul className="py-1">
                    {compressionOptions.map(option => (
                      <li key={option.id}>
                        <button
                          type="button"
                          className={`flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${compressionLevel === option.id ? 'bg-pink-50 dark:bg-pink-900/10' : ''}`}
                          onClick={() => {
                            setCompressionLevel(option.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-pink-500">
                              {option.icon}
                            </div>
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                            </div>
                          </div>
                          {compressionLevel === option.id && (
                            <div className="text-pink-500">
                              <IconCheck size={18} />
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCompress}
              disabled={isCompressing || files.length === 0}
              variant="primary"
              size="md"
            >
              {isCompressing ? 'Compressing...' : 'Compress Image'}
            </Button>
            
            <Button
              onClick={handleClearFiles}
              disabled={isCompressing || files.length === 0}
              variant="outline"
              size="md"
            >
              Clear File
            </Button>
          </div>

          {/* Progress Bar */}
          {isCompressing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compressing image...</span>
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
                  ? "Please wait while we optimize your image..." 
                  : "Compression complete! Downloading your file..."
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
                    Compression Failed
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
                Compression Complete!
              </h4>
              <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                <p>Original size: {formatFileSize(result.originalSize)}</p>
                <p>Compressed size: {formatFileSize(result.size)}</p>
                <p>
                  {result.compressionRatio > 0 ? (
                    <>Reduced by {Math.abs(result.compressionRatio).toFixed(1)}%</>
                  ) : (
                    <>Increased by {Math.abs(result.compressionRatio).toFixed(1)}%</>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 