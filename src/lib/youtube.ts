export interface YouTubeVideo {
  video_id: string
  title: string
}

export type VideoCategory = 'cafe' | 'cars'

export const VIDEO_IDS = {
  cafe: ['jfKfPfyJRdk', '1YcnN9C0PCo', 'nfW6f2gf4g8', 'wGskLO2ESOI', 'OpZX51yb23w'],
  cars: ['4xDzrJKXOOY', 'tiyuRJthHwc', 'R0UYHS8A_A', 'qzyl0f3mRG0', 'N0FPLdagb8Q']
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomVideoId(category: VideoCategory): string {
  const videos = VIDEO_IDS[category]
  const shuffled = shuffleArray(videos)
  return shuffled[0]
}

export function getChannelVideoIds(category: string): string[] {
  const categories: Record<string, string[]> = {
    cafe: ['BYTxPFj44uo'],
    cars: ['QvA2NCigtBY']
  }
  return categories[category] || []
}

export async function getRandomChannelVideoId(category: string): Promise<string> {
  const ids = getChannelVideoIds(category)
  if (ids.length === 0) return 'BYTxPFj44uo'
  return ids[Math.floor(Math.random() * ids.length)]
}
