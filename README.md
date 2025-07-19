# PDF Compression Tool

A modern web application for compressing PDF files while maintaining quality.

## Features

- PDF-specific compression (not just ZIP archiving)
- Multiple compression levels: Low, Medium, High, Extreme
- Intelligent image downsampling and recompression
- Clean, responsive UI
- Cross-platform (works in browser)

## Technology Stack

### Frontend
- Next.js 15
- React 19
- TailwindCSS
- React Dropzone for file handling

### Backend
- Python Flask API
- PyMuPDF (Fitz) for PDF manipulation
- Gunicorn for production serving

## How It Works

This application uses advanced PDF optimization techniques:

1. **Image Processing**:
   - Downsamples images to appropriate resolution based on compression level
   - Applies JPEG compression with configurable quality
   - Converts CMYK to RGB when appropriate

2. **PDF Structure Optimization**:
   - Garbage collection of unused objects
   - Stream compression with DEFLATE
   - Linearization for web optimization

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pdf-compression-tool
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
pip install -r requirements.txt
```

### Development

1. Start the backend API
```bash
python app.py
```

2. In a separate terminal, start the Next.js development server
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Compression Settings

- **Low**: 150 DPI, 85% quality - Fastest with minimal compression
- **Medium**: 120 DPI, 75% quality - Good balance between size and quality
- **High**: 96 DPI, 65% quality - Stronger compression, still good quality
- **Extreme**: 72 DPI, 50% quality - Maximum compression, may affect readability

## Implementation Notes

The PDF compression is primarily achieved through:

1. Reducing image resolution (DPI)
2. Applying JPEG compression to images
3. Optimizing PDF structure (garbage collection, stream compression)
4. PDF linearization for web optimization

## Future Enhancements

- Support for other file types (images, documents)
- Batch processing multiple files
- OCR optimization for scanned documents
- Custom advanced settings
- Text compression options
