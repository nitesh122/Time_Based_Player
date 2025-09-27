# 🎵 Time-Based Music Player - Customization Guide

## 🕐 Clock Design Fixed
The clock now looks like a proper analog clock with:
- ✅ Traditional clock face with gradient background
- ✅ Hour and minute tick marks
- ✅ Proper clock hands (hour, minute, second)
- ✅ Realistic center hub
- ✅ Time block quadrant highlighting

## 📁 How to Add Custom Background Images and Music

### **Step 1: Prepare Your Files**

#### **Background Images:**
- **Format**: JPG, PNG, GIF, WebP
- **Size**: Recommended 1920x1080 or higher
- **Naming**: Use descriptive names like `morning-sunrise.jpg`, `night-city.jpg`

#### **Music Files:**
- **Format**: MP3, WAV, OGG, M4A
- **Quality**: 128kbps or higher recommended
- **Naming**: Use descriptive names like `relaxing-morning.mp3`

### **Step 2: Upload Files Using Admin Panel**

1. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

2. **Open Admin Panel:**
   - Go to http://localhost:3000
   - Click the ⚙️ gear icon in the top-left corner
   - This opens the Admin Panel

3. **Upload Background Images:**
   - Click "Backgrounds" tab
   - Select a time block (e.g., "Morning Energy")
   - Choose your image file
   - Click "Upload Background"

4. **Upload Music Files:**
   - Click "Music" tab
   - Enter song title and artist
   - Select a playlist (e.g., "Morning Energy")
   - Choose your music file
   - Click "Upload Music"

### **Step 3: File Organization**

Your files will be stored in:
```
Time_Based_Player/
├── media/
│   ├── backgrounds/
│   │   ├── background-1234567890-123456789.jpg
│   │   └── background-1234567891-123456790.png
│   └── music/
│       ├── music-1234567890-123456789.mp3
│       └── music-1234567891-123456790.wav
```

### **Step 4: Database Integration**

The files are automatically linked to the database:
- **Backgrounds**: Updated in `time_blocks` table
- **Music**: Added to `songs` table with playlist association

### **Step 5: Access Your Files**

Your uploaded files are accessible at:
- **Backgrounds**: `http://localhost:3001/media/backgrounds/filename.jpg`
- **Music**: `http://localhost:3001/media/music/filename.mp3`

## 🎨 Time Block Customization

### **Current Time Blocks:**
1. **00:00-03:59**: Midnight Chill
2. **04:00-07:59**: Sunrise Calm
3. **08:00-11:59**: Morning Energy
4. **12:00-15:59**: Afternoon Focus
5. **16:00-19:59**: Evening Relax
6. **20:00-23:59**: Night Vibes

### **To Change Time Blocks:**
1. Edit `backend/src/init-db.js`
2. Modify the `sampleData.timeBlocks` array
3. Run `npm run init-db` to update database

## 🎵 Playlist Management

### **To Add New Playlists:**
1. Use the Admin Panel to upload music
2. Or edit the database directly:
   ```sql
   INSERT INTO playlists (name, description) 
   VALUES ('Your Playlist', 'Your Description');
   ```

### **To Modify Existing Playlists:**
1. Use the Admin Panel
2. Or edit the database:
   ```sql
   UPDATE playlists 
   SET name = 'New Name', description = 'New Description' 
   WHERE playlist_id = 1;
   ```

## 🔧 Advanced Customization

### **Change Clock Colors:**
Edit `frontend/src/components/Clock.css`:
```css
.clock-face {
  background: linear-gradient(135deg, #your-color1, #your-color2);
}
```

### **Change Background Overlay:**
Edit `frontend/src/components/Background.css`:
```css
.background-overlay {
  background: linear-gradient(135deg, #your-color1, #your-color2);
}
```

### **Add More Time Blocks:**
1. Add to `sampleData.timeBlocks` in `init-db.js`
2. Add corresponding playlist
3. Add songs for the playlist
4. Run `npm run init-db`

## 🚀 Production Deployment

### **For Production:**
1. Run the build script:
   ```bash
   ./build-production.sh
   ```

2. Your production files will be in the `production/` directory

3. Deploy the `production/` folder to your server

## 📝 Troubleshooting

### **Common Issues:**

1. **Upload fails:**
   - Check file size (max 50MB)
   - Check file format (images: jpg/png, music: mp3/wav)
   - Check server logs

2. **Files not displaying:**
   - Ensure backend is running
   - Check file paths in database
   - Verify file permissions

3. **Clock not updating:**
   - Check browser console for errors
   - Verify API connection
   - Check time block data

### **File Size Limits:**
- **Background Images**: 50MB max
- **Music Files**: 50MB max
- **Total Storage**: Limited by server disk space

## 🎉 You're Ready!

Your Time-Based Music Player now has:
- ✅ Beautiful analog clock design
- ✅ Custom background image upload
- ✅ Custom music file upload
- ✅ Admin panel for easy management
- ✅ Automatic database integration
- ✅ Real-time updates

Enjoy your personalized musical journey! 🎵
