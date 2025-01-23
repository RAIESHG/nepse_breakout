const path = require('path');
const fs = require('fs').promises;

exports.handler = async function(event, context) {
  try {
    // Get the path from the event
    let requestPath = event.path;
    
    // Remove the function path if present
    requestPath = requestPath.replace('/.netlify/functions/server', '');
    
    // If empty path, serve index.html
    if (!requestPath || requestPath === '/') {
      requestPath = '/index.html';
    }

    // Remove leading slash if present
    requestPath = requestPath.replace(/^\/+/, '');

    console.log('Processing request for path:', requestPath);

    // Debug info
    console.log('Current directory:', process.cwd());
    console.log('__dirname:', __dirname);

    // Construct the file path relative to the public directory
    const publicPath = path.join(__dirname, '../../public');
    const filePath = path.join(publicPath, requestPath);
    
    console.log('Public directory:', publicPath);
    console.log('Full file path:', filePath);

    // List files in public directory
    try {
      const files = await fs.readdir(publicPath);
      console.log('Files in public directory:', files);
    } catch (e) {
      console.error('Error reading public directory:', e);
    }

    // Read the file
    const data = await fs.readFile(filePath);
    
    // Set content type based on file extension
    const ext = path.extname(requestPath).toLowerCase();
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.csv': 'text/csv',
      '.json': 'application/json'
    }[ext] || 'text/plain';

    return {
      statusCode: 200,
      body: data.toString(),
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    console.error('Error serving file:', {
      error: error.message,
      path: event.path,
      cwd: process.cwd(),
      dirname: __dirname
    });

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'File not found',
        path: event.path,
        message: error.message,
        cwd: process.cwd(),
        dirname: __dirname
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    };
  }
}; 