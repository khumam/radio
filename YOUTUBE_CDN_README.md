# YouTube CDN Integration - NOT IN USE

**❌ THIS APPROACH WAS REVERTED DUE TO CORS ERRORS**

## Why It Failed

The CDN approach encountered these issues:

1. **CORS Error**: YouTube blocks direct access to watch pages
```
Access to video at 'https://www.youtube.com/watch?v=...' from origin 'http://localhost:5175' has been blocked by CORS policy
```

2. **NotSupportedError**: Video element has no supported sources when URLs are blocked

3. **YouTube actively blocks browser-based CDN access** - This is intentional

## What's Currently Implemented

The app now uses **only** YouTube Embed API for Cafe and Cars:

- `src/lib/youtube.ts` - YouTube video IDs and helper functions
- `src/App.tsx` - Uses react-youtube component for playback

## This File Is Kept For Reference

This file (`youtube-cdn.ts`) is kept in the repo for documentation purposes if you want to experiment with:
- Backend-based CDN URL extraction (requires server)
- Third-party yt-dl APIs (requires API keys)
- Non-browser environments (like Electron apps)

## How To Re-enable (At Your Own Risk)

⚠️ **This requires a backend server** - browsers cannot directly access YouTube CDN URLs

1. Set up a Node.js/Python backend
2. Use youtube-dl or yt-dlp to extract CDN URLs
3. Create an API endpoint your frontend can call
4. Handle CORS by proxying requests through your backend

Example backend (Node.js):
```javascript
const ytdl = require('ytdl-core');

app.get('/api/youtube-url/:videoId', async (req, res) => {
  try {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${req.params.videoId}`);
    const audioUrl = info.formats.find(f => f.mimeType === 'audio/mp4').url;
    res.json({ url: audioUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract URL' });
  }
});
```

Then call from frontend:
```typescript
const response = await fetch(`/api/youtube-url/${videoId}`);
const data = await response.json();
```

## Recommended Approach

For stable, compliant YouTube playback:

✅ **Use YouTube Embed** (current implementation)
- No CORS issues
- Official API
- Stable and reliable
- Complies with ToS

❌ **Avoid Direct CDN** (this file)
- CORS blocked in browsers
- URLs expire quickly
- Against YouTube ToS
- Requires backend

## File Status

- **Created**: Feb 19, 2025
- **Status**: Reverted due to CORS errors
- **Current**: Using YouTube Embed API only

See `YOUTUBE_README.md` for the working YouTube implementation.
