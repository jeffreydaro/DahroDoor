@echo off
curl -s -X POST http://localhost:3000/api/status -H "Content-Type: application/json" -d "{\"status\":\"green\"}"
