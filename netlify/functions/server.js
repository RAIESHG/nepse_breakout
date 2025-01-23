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

    // Health check endpoint
    if (requestPath === 'health') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'ok',
          time: new Date().toISOString(),
          cwd: process.cwd(),
          files: await fs.readdir(path.join(__dirname, '../../public'))
        })
      };
    }

    // Construct the file path relative to the public directory
    const filePath = path.join(__dirname, '../../public', requestPath);
    console.log('Attempting to read:', filePath);

    // List directory contents for debugging
    const dirPath = path.dirname(filePath);
    try {
      const files = await fs.readdir(dirPath);
      console.log('Files in directory:', dirPath, files);
    } catch (e) {
      console.error('Error listing directory:', e);
    }

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
      requestPath: requestPath,
      cwd: process.cwd(),
      dirname: __dirname
    });

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'File not found',
        path: event.path,
        message: error.message
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    };
  }
}; 