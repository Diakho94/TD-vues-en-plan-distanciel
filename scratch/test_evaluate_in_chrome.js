const http = require('http');
const WebSocket = require('ws'); // wait, do we have ws installed?

http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const list = JSON.parse(data);
        const page = list.find(p => p.type === 'page' && p.url.includes('TD_Sequence1_MELEC_Echelle_Document'));
        console.log("Page found:", page ? page.title : "NONE");
    });
});
