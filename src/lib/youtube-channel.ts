export interface FeedEntry {
  id: string
  title: string
  link: {
    href: string
  }
  published: string
  updated: string
}

export interface YouTubeVideo {
  video_id: string
  title: string
  url: string
  published_at: string
  latest_update_at: string
  created_at: string
  updated_at: string
}

export async function fetchChannelVideos(channelId: string): Promise<YouTubeVideo[]> {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    const response = await fetch(url)
    const text = await response.text()
    
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')
    const feed = xml.querySelector('feed')
    
    if (!feed) {
      throw new Error('Failed to parse YouTube feed')
    }
    
    const entries = Array.from(feed.querySelectorAll('entry'))
    const videos: YouTubeVideo[] = []
    
    for (const entry of entries) {
      const videoIdElement = entry.querySelector('yt:videoId')
      const titleElement = entry.querySelector('title')
      const linkElement = entry.querySelector('link')
      const publishedElement = entry.querySelector('published')
      const updatedElement = entry.querySelector('updated')
      
      if (!videoIdElement || !titleElement || !linkElement) {
        continue
      }
      
      const videoId = videoIdElement.textContent || ''
      const title = titleElement.textContent || ''
      const url = linkElement.getAttribute('href') || ''
      const published = publishedElement?.textContent || ''
      const updated = updatedElement?.textContent || ''
      
      if (url.includes('shorts')) {
        continue
      }
      
      videos.push({
        video_id: videoId,
        title,
        url,
        published_at: published,
        latest_update_at: updated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    return videos
  } catch (error) {
    throw new Error(`Failed to fetch YouTube videos: ${error}`)
  }
}

export function extractVideoId(entryId: string): string {
  const parts = entryId.split(':')
  return parts.length > 1 ? parts[1] : parts[0]
}

export function saveVideosToLocalStorage(channelId: string, videos: YouTubeVideo[]): void {
  const storageKey = `youtube_channel_${channelId}`
  const data = {
    videos,
    timestamp: Date.now(),
    count: videos.length
  }
  localStorage.setItem(storageKey, JSON.stringify(data))
}

export function getVideosFromLocalStorage(channelId: string): { videos: YouTubeVideo[]; count: number } | null {
  const storageKey = `youtube_channel_${channelId}`
  const cached = localStorage.getItem(storageKey)
  
  if (!cached) {
    return null
  }
  
  try {
    const data = JSON.parse(cached)
    
    const oneHour = 60 * 60 * 1000
    if (data.timestamp && Date.now() - data.timestamp > oneHour) {
      localStorage.removeItem(storageKey)
      return null
    }
    
    return data
  } catch (error) {
    localStorage.removeItem(storageKey)
    return null
  }
}

export async function getCachedOrFetchChannelVideos(channelId: string): Promise<YouTubeVideo[]> {
  const cached = getVideosFromLocalStorage(channelId)
  
  if (cached) {
    return cached.videos
  }
  
  const videos = await fetchChannelVideos(channelId)
  saveVideosToLocalStorage(channelId, videos)
  
  return videos
}
