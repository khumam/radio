# YouTube Embed Integration

This file contains the YouTube video IDs and related functions for the radio app.

## Structure

- `VIDEO_IDS`: Object containing YouTube video IDs for each category
  - `cafe`: Lofi/chill music videos
  - `cars`: Electronic/synthwave music videos

- `shuffleArray()`: Helper function to randomize array elements

- `getRandomVideoId()`: Get a random video ID for a category

## How to Use

1. Import from `@/lib/youtube`:
```typescript
import { getRandomVideoId, type VIDEO_IDS } from '@/lib/youtube'
```

2. Get a random video ID:
```typescript
const videoId = getRandomVideoId('cafe')
```

3. Set it as current video in the YouTube player:
```typescript
setCurrentVideoId(videoId)
```

## Video IDs

Current video IDs are placeholder/sample videos. Add more video IDs to the arrays:

```typescript
export const VIDEO_IDS = {
  'cafe': [
    'BYTxPFj44uo', // Lofi Girl
    'another-video-id',
    'yet-another-video-id'
  ],
  'cars': [
    'QvA2NCigtBY', // Synthwave driving
    'another-driving-video-id'
  ]
}
```

## To Add New Videos

1. Go to YouTube
2. Copy the video ID from the URL (e.g., youtube.com/watch?v=VIDEO_ID)
3. Add it to the appropriate category array in VIDEO_IDS
4. Save the file

## Rollback Instructions

If you need to rollback to a previous version:

1. Check git history:
```bash
git log --oneline src/lib/youtube.ts
```

2. Checkout specific commit:
```bash
git checkout <commit-hash> -- src/lib/youtube.ts
```

Or manually restore from your backup by replacing this file with your backup version.

## Notes

- This is used with the official YouTube Embed API (react-youtube)
- The YouTube player renders in a hidden iframe
- Volume and playback are controlled through the YouTube Player API
- This approach complies with YouTube's Terms of Service
