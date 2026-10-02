const https = require('https');

const url = "https://script.google.com/macros/s/AKfycbzEX7l1BYeOLoGc1ULmUh5SlyGkLivc5f_xB6o3G81wco9rE4hpcZmVE2cYHofURNr_6Q/exec";

console.log("Testing connection to:", url);

const req = https.request(url, { method: 'GET' }, (res) => {
    console.log("Status Code:", res.statusCode);
    console.log("Headers:", res.headers);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Response (first 300 chars):", data.substring(0, 300));
    });
});

req.on('error', (err) => {
    console.error("Error connecting:", err.message);
});

req.end();
