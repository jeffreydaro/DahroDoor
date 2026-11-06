const express = require('express');
const notifier = require('node-notifier');
const path = require('path');
const app = express();

let currentStatus = 'green'; // Default state

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// admin
app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Status Control</title></head>
        <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
            <h1>Office Status Control</h1>
            <button onclick="setStatus('green')" style="background:green; color:white; padding:20px 40px; font-size:24px; border:none; margin:10px; cursor:pointer;">Set Green</button>
            <button onclick="setStatus('red')" style="background:red; color:white; padding:20px 40px; font-size:24px; border:none; margin:10px; cursor:pointer;">Set Red</button>
            <script>
                async function setStatus(s) {
                    await fetch('/api/status', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({status: s})
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Get current status (iPhone polls this)
app.get('/api/status', (req, res) => {
    res.json({ status: currentStatus });
});

// Toggle status from Desktop
app.post('/api/status', (req, res) => {
    // Check if req.body exists first to prevent crashes[cite: 1]
    const requestedStatus = req.body && req.body.status;
    currentStatus = requestedStatus || (currentStatus === 'green' ? 'red' : 'green');
    
    res.json({ success: true, status: currentStatus });
});

// Fire Windows Toast Notification from iPhone tap
app.post('/api/notify', (req, res) => {
    notifier.notify({
        title: 'Office Door Notice',
        message: 'Someone is outside your office!',
        sound: true,
        wait: false
    });
    res.json({ success: true });
    console.log("notification triggered");
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});