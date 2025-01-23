// Update the BASE_URL logic
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname.includes('192.168')
  ? '' 
  : '/.netlify/functions/server';

// Update the fetch call
async function fetchDataset() {
    const response = await fetch(BASE_URL ? `${BASE_URL}/dataset.csv` : '/dataset.csv');
    if (!response.ok) {
        console.error('Response:', response);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
} 