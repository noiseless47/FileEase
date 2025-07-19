"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconUpload, IconFile, IconX } from '@tabler/icons-react';

interface DropzoneProps {
  onFileAccepted: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: Record<string, string[]>;
}

// Helper function for formatting file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

export default function Dropzone({ 
  onFileAccepted, 
  maxFiles = 5, 
  maxSize = 10485760,
  acceptedFileTypes 
}: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Check if there are any rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(rf => {
        if (rf.errors[0].code === 'file-too-large') {
          return `${rf.file.name} is too large (max ${maxSize / 1048576}MB)`;
        }
        if (rf.errors[0].code === 'file-invalid-type') {
          return `${rf.file.name} has an invalid file type`;
        }
        return rf.errors[0].message;
      });
      setError(errors.join(', '));
      return;
    }

    setError(null);
    setFiles(prev => [...prev, ...acceptedFiles]);
    onFileAccepted(acceptedFiles);
  }, [maxSize, onFileAccepted]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    // Also notify parent component
    onFileAccepted(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedFileTypes
  });

  // Get dropzone style based on state
  const getDropzoneStyle = () => {
    if (isDragAccept) {
      return 'border-pink-500 bg-pink-500/5 dark:bg-pink-500/10';
    }
    if (isDragReject) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/10';
    }
    if (isDragActive) {
      return 'border-pink-600 bg-pink-500/5 dark:bg-pink-500/10';
    }
    return 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600';
  };

  // Generate file type description
  const getFileTypeDescription = () => {
    if (!acceptedFileTypes) return '';
    
    const types = Object.entries(acceptedFileTypes).flatMap(([mime, exts]) => 
      exts.map(ext => ext.replace('.', '').toUpperCase())
    );
    
    if (types.length === 0) return '';
    if (types.length === 1) return `${types[0]} files only`;
    
    return `Accepted formats: ${types.join(', ')}`;
  };

  return (
    <div className="w-full mb-4 space-y-4">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${getDropzoneStyle()}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
            isDragActive 
              ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
          }`}>
            <IconUpload 
              className={`w-8 h-8 transition-transform ${isDragActive ? 'scale-110' : ''}`}
              stroke={1.5}
            />
          </div>
          {isDragActive ? (
            <p className="text-lg font-medium text-pink-600 dark:text-pink-400">Drop files here...</p>
          ) : (
            <div>
              <p className="text-xl font-medium mb-1">Drag & drop files here</p>
              <p className="text-base text-gray-500 dark:text-gray-400 mb-2">
                or click to select files
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Max {maxFiles} {maxFiles === 1 ? 'file' : 'files'}, up to {maxSize / 1048576}MB each
                {acceptedFileTypes && getFileTypeDescription() && (
                  <><br />{getFileTypeDescription()}</>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-base font-medium mb-3">Files ready for processing:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li 
                key={index} 
                className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center overflow-hidden">
                  <IconFile 
                    className="w-5 h-5 mr-3 text-pink-500 flex-shrink-0" 
                    stroke={1.5}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove file"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 