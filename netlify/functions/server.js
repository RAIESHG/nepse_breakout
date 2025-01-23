const path = require('path');
const fs = require('fs').promises;

exports.handler = async function(event, context) {
  try {
    // Remove /.netlify/functions/server from the path if present
    const requestPath = event.path.replace('/.netlify/functions/server', '') || '/index.html';
    
    // Log the requested path for debugging
    console.log('Requested path:', requestPath);

    // Read the file from the project root
    const filePath = path.join(__dirname, '../..', requestPath);
    console.log('Attempting to read:', filePath);

    if (requestPath === '/health') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: 'ok',
          time: new Date().toISOString()
        })
      };
    }

    const data = await fs.readFile(filePath);
    
    // Set content type based on file extension
    const ext = path.extname(requestPath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.csv': 'text/csv'
    }[ext] || 'text/plain';

    return {
      statusCode: 200,
      body: data.toString(),
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      }
    };
  } catch (error) {
    console.error('Error serving file:', error);
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'File not found',
        path: event.path,
        message: error.message
      })
    };
  }
}; 