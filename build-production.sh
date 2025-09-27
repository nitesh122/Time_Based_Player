#!/bin/bash

echo "🚀 Building Time-Based Music Player for Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Build backend
print_status "Building backend..."
cd backend
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Initialize database
print_status "Initializing database..."
npm run init-db

# Build frontend
print_status "Building frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

print_status "Creating production build..."
npm run build

# Create production directory
print_status "Creating production directory..."
cd ..
mkdir -p production
rm -rf production/*

# Copy backend files
print_status "Copying backend files..."
cp -r backend/* production/
rm -rf production/node_modules

# Copy frontend build
print_status "Copying frontend build..."
cp -r frontend/build production/public

# Create production package.json
print_status "Creating production package.json..."
cat > production/package.json << EOF
{
  "name": "time-based-music-player",
  "version": "1.0.0",
  "description": "Time-Based Music Player - Production Build",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "init-db": "node src/init-db.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "body-parser": "^1.20.2",
    "path": "^0.12.7"
  },
  "keywords": ["music", "time-based", "playlist", "api"],
  "author": "Your Name",
  "license": "MIT"
}
EOF

# Create production README
print_status "Creating production README..."
cat > production/README.md << EOF
# Time-Based Music Player - Production Build

This is the production build of the Time-Based Music Player.

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Initialize database:
   \`\`\`bash
   npm run init-db
   \`\`\`

3. Start the application:
   \`\`\`bash
   npm start
   \`\`\`

4. Open your browser and go to: http://localhost:3001

## Features

- 🕐 6 Time Blocks with automatic switching
- 🎵 Dynamic playlists based on time of day
- ⏰ Real-time analog clock
- 🎨 Dynamic backgrounds
- 📱 Responsive design
- 🔄 Auto-looping playlists

## Environment Variables

- PORT: Server port (default: 3001)
- NODE_ENV: Environment (production/development)

## API Endpoints

- GET /api/health - Health check
- GET /api/time-blocks - All time blocks
- GET /api/time-blocks/current - Current time block
- GET /api/playlists/:id - Playlist with songs

Enjoy your musical journey! 🎵
EOF

# Create start script
print_status "Creating start script..."
cat > production/start.sh << 'EOF'
#!/bin/bash
echo "🎵 Starting Time-Based Music Player..."
echo "📊 Initializing database..."
npm run init-db
echo "🚀 Starting server..."
npm start
EOF

chmod +x production/start.sh

print_status "✅ Production build complete!"
print_status "📁 Production files are in the 'production' directory"
print_status "🚀 To start the production server:"
print_status "   cd production && npm install && ./start.sh"
print_status "🌐 Then open: http://localhost:3001"

echo ""
print_status "🎉 Build Summary:"
echo "   - Backend: ✅ Built and configured"
echo "   - Frontend: ✅ Built and optimized"
echo "   - Database: ✅ Initialized with sample data"
echo "   - Production: ✅ Ready to deploy"
