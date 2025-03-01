#!/bin/bash

# Start backend server
echo "Starting FastAPI backend server..."
cd backend
uv run main.py &
BACKEND_PID=$!

# Start frontend server
echo "Starting Next.js frontend server..."
cd ../frontend
bun run dev &
FRONTEND_PID=$!

# Function to kill processes on exit
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Set up trap to catch exit signal
trap cleanup INT TERM

echo "Servers started! Access the app at http://localhost:3000"
echo "Press Ctrl+C to stop both servers."

# Wait for user to exit
wait 