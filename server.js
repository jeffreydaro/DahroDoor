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

// Variable to track the last notification timestamp
let lastNotificationTime = 0;
const COOLDOWN_MS = 3000; // 3 seconds cooldown window

app.post('/api/notify', (req, res) => {
    const now = Date.now();

    // SPAM FILTER: Check if tap happened within the cooldown window
    if (now - lastNotificationTime < COOLDOWN_MS) {
        console.log('Spam tap ignored.');
        return res.json({ success: false, message: 'Rate limited (spam ignored)' });
    }

    // Update last tap timestamp
    lastNotificationTime = now;

    console.log('Valid tap received! Triggering notification...');

    // 1. Play custom sound (if enabled)
    // sound.play(path.join(__dirname, 'chime.mp3')).catch(err => console.error(err));

    // 2. Fire Toast Notification
    notifier.notify({
        title: 'Office Door Notice',
        message: 'Someone is outside your office!',
        appID: 'Door Status Notifier',
        sound: true,
        wait: false
    }, (err) => {
        if (err) console.error('Notification error:', err);
    });

    res.json({ success: true });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});