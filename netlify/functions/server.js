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

    // Log for debugging
    console.log('Processing request for path:', requestPath);

    // Health check endpoint
    if (requestPath === '/health') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'ok',
          time: new Date().toISOString()
        })
      };
    }

    // Construct the file path relative to the project root
    const filePath = path.join(__dirname, '../..', requestPath);
    console.log('Attempting to read file:', filePath);

    // Check if file exists and is not a directory
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      throw new Error('Path is a directory');
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
        // Add CORS headers if needed
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    console.error('Error serving file:', {
      error: error.message,
      path: event.path,
      stack: error.stack
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