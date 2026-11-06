# Office Door Status & Knock Notifier

An interactive availability indicator and knock notification system using an old iPhone mounted outside your office and a desktop Node.js backend.

---

## 📌 Project Overview

This project provides a full-stack status display and alert system:
1. **Status Display (iPhone Mount):** An old iPhone running Guided Access mode in Safari displays your availability status (Green for **AVAILABLE**, Red for **IN A MEETING**). It polls the server every 2 seconds to reflect status changes.
2. **Knock Alert (Desktop Toast):** Tapping the iPhone screen sends a request to the backend server, instantly triggering a native Windows desktop toast notification on your PC.
3. **Desktop Controls:** Quick batch scripts or API endpoints allow you to change status directly from your Windows machine.

---

## 📁 Project Structure

```text
door-status/
├── public/
│   └── index.html      # Mobile full-screen web UI running on the iPhone
├── scripts/
│   ├── status-green.bat # Switch status to Green (Available)
│   ├── status-red.bat   # Switch status to Red (In a Meeting)
│   └── toggle-status.bat# Toggle status between Green and Red
├── server.js            # Node.js / Express backend server
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- **Node.js** installed on your Windows machine.
- iPhone connected to the **same local Wi-Fi network** as your PC.

### 2. Manual Start (Development Mode)
To run the server manually without process managers:
```bash
node server.js
```
The server will run on `http://0.0.0.0:3000`, binding to all network interfaces on your PC.

---

## ⚙️ PM2 Auto-Start Setup (Windows Startup)

The project uses **PM2** and `pm2-windows-startup` to run silently in the background and automatically start up whenever you log into Windows.

### Initial Setup Steps
If setting up on a new environment or reconfiguring:

1. **Install PM2 globally:**
   ```bash
   npm install -g pm2 pm2-windows-startup
   ```

2. **Register the Windows Startup Helper:**
   ```bash
   pm2-startup install
   ```

3. **Start the Server Process:**
   Navigate to the project root directory and start the server:
   ```bash
   pm2 start server.js --name "door-status-server"
   ```

4. **Save Current Process List for Boot:**
   ```bash
   pm2 save
   ```

### Daily PM2 Management Commands
- **Check Server Status:**
  ```bash
  pm2 status
  ```
- **View Live Server Logs (e.g., tap logs):**
  ```bash
  pm2 logs
  ```
- **Restart Server (after editing `server.js`):**
  ```bash
  pm2 restart door-status-server
  ```
- **Stop Server:**
  ```bash
  pm2 stop door-status-server
  ```

---

## 📲 How to Use

### 1. iPhone Setup
1. Find your PC's local IPv4 address (run `ipconfig` in Command Prompt, e.g., `192.168.1.50`).
2. Open Safari on the iPhone and navigate to `http://<YOUR-PC-IP>:3000`.
3. Enable **Guided Access** on iOS (*Settings > Accessibility > Guided Access*).
4. Set Display Auto-Lock to **Never**.
5. Launch Guided Access in Safari by triple-clicking the Home/Side button to keep the browser locked in full-screen mode.

### 2. Toggling Status from Desktop
Run the batch files in the `scripts/` folder or execute the following `curl` commands:

- **Set Green (Available):**
  ```cmd
  .\scripts\status-green.bat
  ```
  *(or `curl -s -X POST http://localhost:3000/api/status -H "Content-Type: application/json" -d "{\"status\":\"green\"}"`)*

- **Set Red (In a Meeting):**
  ```cmd
  .\scripts\status-red.bat
  ```
  *(or `curl -s -X POST http://localhost:3000/api/status -H "Content-Type: application/json" -d "{\"status\":\"red\"}"`)*

- **Toggle Status:**
  ```cmd
  .\scripts\toggle-status.bat
  ```

### 3. Tap to Knock
Tapping anywhere on the iPhone screen issues a `POST /api/notify` request, triggering a Windows desktop notification banner and alert sound on your PC.

---

## 🛠️ Troubleshooting Windows Notifications

If iPhone taps log to the console but no desktop toast appears:
1. Ensure Windows **Do Not Disturb** / **Focus Assist** is turned **OFF** (*Settings > System > Notifications*).
2. Ensure VS Code or your terminal is **NOT running as Administrator**, as elevated sessions can suppress Windows UI toasts.