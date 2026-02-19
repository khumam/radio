export interface YouTubeCDNVideo {
  id: string
  title: string
  cdnUrl: string
  format: 'audio' | 'video'
}

export const CDN_VIDEO_IDS: Record<string, YouTubeCDNVideo[]> = {
  'cafe': [
    {
      id: 'BYTxPFj44uo',
      title: 'Lofi Girl - Be Friends',
      cdnUrl: 'https://www.youtube.com/watch?v=BYTxPFj44uo',
      format: 'audio'
    }
  ],
  'cars': [
    {
      id: 'QvA2NCigtBY',
      title: 'Synthwave Driving',
      cdnUrl: 'https://www.youtube.com/watch?v=QvA2NCigtBY',
      format: 'audio'
    }
  ]
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomCDNVideo(category: string): YouTubeCDNVideo | null {
  const videos = CDN_VIDEO_IDS[category]
  if (!videos || videos.length === 0) return null
  const shuffled = shuffleArray(videos)
  return shuffled[0]
}

export async function fetchCDNUrl(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
    const data = await response.json()
    return data.html || null
  } catch (error) {
    return null
  }
}
