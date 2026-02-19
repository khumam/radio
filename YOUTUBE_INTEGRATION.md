# YouTube Video Integration

## Current Implementation

**Status: Reverted to static video IDs (CORS issues resolved)**

## How It Works Now

### YouTube Videos (Cafe & Cars)
- Uses static video IDs from `VIDEO_IDS`
- Simple, fast, no API calls needed
- Works perfectly on Vercel and all platforms
- No CORS issues
- No rate limits

### Radio (News)
- Uses Radio Browser API
- Shuffles stations on click

## Files

### `src/lib/youtube.ts`
Contains:
- `VIDEO_IDS` - Static video IDs for Cafe and Cars
- `getRandomVideoId()` - Get random video ID
- `shuffleArray()` - Helper function
- `getChannelVideoIds()` - Returns video IDs by category
- `getRandomChannelVideoId()` - Async version for future channel use

### `src/lib/youtube-channel.ts`
Channel video fetcher (not currently used):
- Fetches from YouTube XML Feed API
- Has caching (1 hour TTL)
- Can be re-enabled if needed

### `src/lib/channels.ts`
Channel ID mappings:
- Maps category names to channel IDs
- Currently has: `cafe` → UCATyidusLbgd54WOCIryJow

### `src/App.tsx`
Main app component:
- `selectCategory()` - Handles both YouTube and Radio
- `play()`, `stop()`, `stopAll()` - Playback controls
- `handleVolumeMin()`, `handleVolumeMax()` - Volume controls
- `handlePlayStop()` - Play/pause toggle
- `handleRadioShuffle()` - Shuffle radio stations
- `handleAudioError()` - Error recovery for radio

## Video IDs

Current static video IDs:

```typescript
cafe: 'BYTxPFj44uo'     // Lofi Girl
cars: 'QvA2NCigtBY'       // Synthwave Driving
```

## How to Add More Videos

**Option 1: Simple Array (Recommended)**
```typescript
export const VIDEO_IDS = {
  'cafe': [
    'BYTxPFj44uo',
    'NEW_VIDEO_ID_1',
    'NEW_VIDEO_ID_2',
  ],
  'cars': [
    'QvA2NCigtBY',
    'NEW_VIDEO_ID_3',
    'NEW_VIDEO_ID_4',
  ]
}
```

**Option 2: Use Channel Videos (Requires Backend)**
See `YOUTUBE_CHANNEL_README.md` for details

**Option 3: YouTube Data API v3**
```typescript
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=YOUR_CHANNEL_ID}`)
const data = await response.json()
const videoIds = data.items.map(item => item.id.videoId)
```

## Channel ID

Currently configured:
```
UCATyidusLbgd54WOCIryJow  // Cafe & Chill Channel
```

## Features

✅ **No CORS errors** - Static video IDs work everywhere
✅ **No API keys required** - Uses embed player
✅ **Instant playback** - No loading wait times
✅ **Radio Browser API** - For News category
✅ **LocalStorage caching** - Radio stations cached
✅ **Error recovery** - Auto-switch on stream failure

## Architecture

```
User Interface (React)
    ↓ App.tsx (Main Component)
    ↓ selectCategory()
    ↓ play / stop / stopAll
    ↓ handleVolumeMin / Max
    ↓ handlePlayStop
    ↓ handleRadioShuffle
    ↓ handleAudioError

    ↓ AnimatedBackground (Canvas)
    ↓ YouTube Player (react-youtube)
    ↓ HTML5 Audio (Radio)

State Management:
    - selectedCategory: 'cafe' | 'cars' | 'radio' | null
    - currentVideoId: YouTube video ID
    - currentStation: Radio station
    - isPlaying: Playback state
    - isLoading: Loading state
    - volume: 0-100
    - currentType: 'youtube' | 'radio'
```

## How Each Category Works

### Cafe (YouTube)
1. User clicks "Cafe" button
2. `selectCategory('cafe')` called
3. `getRandomVideoId('cafe')` returns random video ID from `VIDEO_IDS.cafe`
4. `setCurrentVideoId(videoId)` sets the video
5. YouTube embed player plays the video
6. Volume and playback controls work

### Cars (YouTube)
1. User clicks "Cars" button
2. `selectCategory('cars')` called
3. `getRandomVideoId('cars')` returns random video ID from `VIDEO_IDS.cars`
4. `setCurrentVideoId(videoId)` sets the video
5. YouTube embed player plays the video
6. Volume and playback controls work

### Radio
1. User clicks "Radio" button
2. `selectCategory('radio')` called
3. `fetchRadioStations()` fetches radio stations from Radio Browser API
4. `getRandomStation()` returns random station
5. `setCurrentStation(station)` sets the station
6. HTML5 audio player plays the stream
7. "Shuffle Station" button loads new random station

## Dependencies

- **react-youtube** - YouTube embed player
- **lucide-react** - Icons
- **tailwindcss** - Styling
- **Radio Browser API** - Radio station data (free)

## Rollback

If needed to revert:

```bash
# Check git history
git log --oneline src/lib/youtube.ts src/App.tsx

# Checkout specific commit
git checkout <commit-hash> -- src/lib/youtube.ts src/App.tsx
```

## Known Issues and Solutions

### CORS Error (YouTube Channel API) - ✅ FIXED
**Issue:** YouTube blocks browser access to XML feed
**Solution:** Use static video IDs (current approach)

### Video ID Not Found
**Current:** Falls back to static IDs if channel fetch fails
**Future:** Use YouTube Data API v3 with backend

### Radio Stream Errors
**Current:** Auto-switches to next station on error
**Future:** Better error handling with user feedback

## Performance

- YouTube: Instant (no API calls)
- Radio: ~500ms first load, cached thereafter
- Both use localStorage caching
- Works perfectly on Vercel

## Deployment

✅ **Vercel ready** - No backend needed
✅ **Static assets** - No build issues
✅ **Free APIs** - No API key costs
✅ **CORS-free** - All content works

## To Add More Videos

Simply add to the arrays in `src/lib/youtube.ts`:

```typescript
export const VIDEO_IDS = {
  'cafe': [
    'BYTxPFj44uo',
    'NEW_ID_HERE_1',
  'NEW_ID_HERE_2',
  ],
  'cars': [
    'QvA2NCigtBY',
    'NEW_ID_HERE_3',
  ],
}
```

That's it! No API calls, no backend needed.
