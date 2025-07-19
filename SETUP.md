# PDF Compression Tool Setup Guide

This guide will help you set up and run the PDF Compression Tool.

## Prerequisites

1. Node.js (v18+ recommended)
2. Python 3.8+ with pip
3. Git (optional, for cloning the repository)

## Setup Instructions

### Step 1: Clone the Repository (if applicable)

```bash
git clone <repository-url>
cd pdf-compression-tool
```

### Step 2: Set Up the Python Backend

1. Install the required Python packages:

```bash
pip install -r requirements.txt
```

If you encounter any errors while installing PyMuPDF (fitz), try:

```bash
pip install --upgrade pip
pip install pymupdf==1.23.6
```

2. Run the backend server:

```bash
python app.py
```

You should see output similar to:
```
* Serving Flask app 'app'
* Debug mode: on
* Running on http://127.0.0.1:5000
```

3. Verify the server is running by visiting http://127.0.0.1:5000/api/health in your browser. You should see a JSON response with status "ok".

### Step 3: Set Up the Next.js Frontend

1. Open a new terminal window (keep the Python server running)

2. Install the required npm packages:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Visit http://localhost:3000 in your browser to use the application.

## Troubleshooting

### Backend Issues

1. **500 Internal Server Error**:
   - Check the terminal where you're running the Python server for error messages
   - Ensure PyMuPDF is installed correctly
   - Make sure you have proper permissions to read/write files in the uploads and compressed directories

2. **"ModuleNotFoundError"**:
   - Ensure you've installed all dependencies with `pip install -r requirements.txt`
   - Try installing the specific missing package, e.g., `pip install flask-cors`

3. **"Address already in use"**:
   - Another process is using port 5000
   - Find and stop the process, or change the port in app.py

### Frontend Issues

1. **CORS errors in browser console**:
   - Make sure the Flask backend has CORS enabled
   - Ensure the backend server is running

2. **Failed to fetch errors**:
   - Verify the backend URL in the CompressFiles component
   - Make sure the backend server is running
   - Check if there are any network issues

## How to Use

1. Upload a PDF file using the drag & drop area or file selector
2. Choose a compression level based on your needs
3. Click "Compress PDF"
4. The compressed PDF will download automatically when ready

## Next Steps

For production deployment:
1. Set up a proper WSGI server (like Gunicorn) for the backend
2. Build the Next.js app with `npm run build`
3. Set up proper HTTPS for both frontend and backend 