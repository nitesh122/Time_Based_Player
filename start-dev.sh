#!/bin/bash

echo "🚀 Starting Time-Based Music Player in Development Mode..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    cd backend
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi

    print_status "Backend starting on port 3001..."
    npm start &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend development server..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    print_status "Frontend starting on port 3000..."
    npm start &
    FRONTEND_PID=$!
    cd ..
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
sleep 3
start_frontend

print_status "✅ Both servers are starting up!"
print_status "🌐 Frontend: http://localhost:3000"
print_status "🔧 Backend API: http://localhost:3001"
print_status "📊 Health Check: http://localhost:3001/api/health"
print_status ""
print_status "Press Ctrl+C to stop both servers"

# Wait for both processes
wait
