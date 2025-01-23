const path = require('path');
const fs = require('fs').promises;

exports.handler = async function(event, context) {
  try {
    const requestPath = event.path === '/.netlify/functions/server' 
      ? '/index.html' 
      : event.path;

    // Read the file from the project root
    const filePath = path.join(__dirname, '../..', requestPath);
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
        'Content-Type': contentType
      }
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: 'File not found'
    };
  }
}; 