import JSZip from 'jszip';

interface CompressedFileResult {
  blob: Blob;
  size: number;
  compressionRatio: number;
}

/**
 * Compresses files using JSZip
 * @param files - Array of File objects to compress
 * @param compressionLevel - Compression level (1-9, where 9 is maximum compression)
 * @returns Promise with compressed file blob and stats
 */
export async function compressFiles(
  files: File[],
  compressionLevel: number = 7
): Promise<CompressedFileResult> {
  const zip = new JSZip();
  
  // Add all files to the zip
  files.forEach((file) => {
    zip.file(file.name, file);
  });
  
  // Calculate total original size
  const originalSize = files.reduce((sum, file) => sum + file.size, 0);
  
  // Generate the zip file
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: compressionLevel
    }
  });
  
  // Calculate compression ratio
  const compressedSize = blob.size;
  const compressionRatio = originalSize > 0 ? (1 - compressedSize / originalSize) * 100 : 0;
  
  return {
    blob,
    size: compressedSize,
    compressionRatio
  };
}

/**
 * Generates a download link for a blob
 * @param blob - The blob to generate a download for
 * @param filename - The filename to use for the download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Format file size in human-readable format
 * @param bytes - The size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
} 