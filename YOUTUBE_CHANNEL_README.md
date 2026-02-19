# YouTube Channel Video Fetcher - STATUS: REVERTED

**❌ NOT IN USE - CORS ERRORS**

## What Happened

The YouTube channel XML feed API approach has been **reverted** due to CORS errors:
```javascript
Access to fetch at 'https://www.youtube.com/feeds/videos.xml?channel_id=...' from origin 'http://localhost:5175' 
has been blocked by CORS policy
```

## Current Implementation

The app now uses **only** static video IDs for YouTube playback:

✅ **Cafe & Cars** → Static video IDs from `VIDEO_IDS`
✅ **Radio** → Radio Browser API (stations)
✅ **No CORS issues**
✅ **No API keys required**
✅ **Instant playback**

## Files

### Active Files (Currently Used)

1. **`src/lib/youtube.ts`** - ✅ Active
   - `VIDEO_IDS` - Static video IDs for Cafe and Cars
   - `getRandomVideoId()` - Get random video ID
   - `shuffleArray()` - Helper function
   - **Note:** Channel functions (`getChannelVideoIds`, `getRandomChannelVideoId`) are kept for future use

2. **`src/lib/youtube-channel.ts`** - ⏸️ Not Used (kept for reference)
   - XML feed parser
   - Channel caching logic
   - Can be re-enabled if backend proxy is added

3. **`src/lib/channels.ts`** - ✅ Active
   - `CHANNEL_IDS` - Maps categories to channel IDs
   - `CHANNEL_INFO` - Category descriptions
   - Cafe category → UCATyidusLbgd54WOCIryJow (your channel)

4. **`YOUTUBE_CHANNEL_README.md`** - ⏸️ Reverted documentation
   - Updated with "REVERTED" status
   - Explains why it was reverted

5. **`src/App.tsx`** - ✅ Updated
   - Uses `getRandomVideoId` from `youtube.ts`
   - Cafe category now uses static video IDs

### Inactive Files

- `src/lib/videos.ts` - Removed (replaced by youtube.ts)
- `src/lib/youtube-cdn.ts` - Removed (CORS issues)

## Channel ID (Currently Configured)

```
Cafe Category: UCATyidusLbgd54WOCIryJow
```

This is **your YouTube channel** with cafe/lofi music.

## Why This Approach?

### ✅ Advantages
- **CORS-free** - No backend server needed
- **Works on Vercel** - Perfect for deployment
- **Instant** - No loading times
- **Reliable** - YouTube embed is stable
- **Official** - Complies with ToS
- **Free** - No API costs or rate limits

### ❌ Why Not Channel Approach?

1. **CORS blocking** - YouTube blocks browser access to XML feeds
2. **Backend required** - Needs Node.js server with cors proxy
3. **Complexity** - Requires server-side processing
4. **Not for Vercel** - Serverless platform (no persistent backend)
5. **Against ToS** - Violates terms of service

## Architecture Summary

```
User clicks "Cafe" button
    ↓
selectCategory('cafe')
    ↓
getRandomVideoId('cafe')  // Returns: 'BYTxPFj44uo' (instant)
    ↓
setCurrentVideoId(videoId)
    ↓
YouTube embed plays video
```

## To Use Channel Fetcher (Future)

If you want to re-enable channel video fetching, you need:

### Step 1: Add Backend Proxy
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const ytdl = require('yt-dlp-nodejs');

const app = express();
app.use(cors());

app.get('/api/proxy/youtube-feed', async (req, res) => {
  const url = req.query.url
  const response = await fetch(url)
  const text = await response.text()
  res.set('Access-Control-Allow-Origin', '*')
  res.send(text)
});

app.listen(3001);
```

### Step 2: Update Frontend
```typescript
// In src/lib/youtube-channel.ts
export async function fetchChannelVideos(channelId: string) {
  const url = `http://localhost:3001/api/proxy/youtube-feed?url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`
  const response = await fetch(url)
  const text = await response.text()
  // Parse XML and return videos
}
```

### Step 3: Deploy Backend
- **Vercel**: Use VPS, Railway, Render, or Fly.io
- **Heroku**: Not recommended (pricing issues)
- **Railway**: $5/mo (good for hobby projects)

## Or Use YouTube Data API v3

Get free API key from Google Cloud Console:
- 10,000 quota units/day (free)
- Use for searching videos and getting video IDs
- Requires setup but no credit card needed

## To Add More Videos

**Current Method** (Simple Arrays):
```typescript
// In src/lib/youtube.ts
export const VIDEO_IDS = {
  cafe: [
    'BYTxPFj44uo',  // Existing
    'NEW_VIDEO_1',   // Add new
    'NEW_VIDEO_2',   // Add more
  ],
}
```

**No API calls needed** - Just add video IDs to the array!

## Rollback Instructions

If this needs to be reverted to channel-based fetching:

```bash
git log --oneline src/lib/youtube.ts
git checkout <commit-hash> -- src/lib/youtube.ts
```

## Error Recovery

### What If Channel Fetch Fails

**Current Behavior:**
1. Falls back to static video IDs from `VIDEO_IDS` array
2. Shows loading state during fetch attempt
3. App remains functional with Cars category

**To Test:**
1. Clear localStorage: `localStorage.removeItem('youtube_channel_UCATyidusLbgd54WOCIryJow')`
2. Refresh page and click Cafe category
3. Should fetch fresh videos

### What If No Videos Found

**Current Behavior:**
1. Shows "Loading..." message
2. Falls back to static video IDs
3. App works, just uses different video

**To Fix:**
1. Check channel ID is correct: `UCATyidusLbgd54WOCIryJow`
2. Verify channel has public videos
3. Add more video IDs to arrays in `src/lib/youtube.ts`

## Summary

**✅ Working: Static video IDs with YouTube Embed**
✅ Working: Radio Browser API for News category
✅ Working: All playback controls
✅ Working: Animated background with ripple effect
✅ Working: News ticker with caching
✅ Deployment ready for Vercel

**Architecture:** Simple, fast, reliable, no backend needed
