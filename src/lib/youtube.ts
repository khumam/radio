import { useRef, useState } from 'react'

export const VIDEO_IDS = {
  'cafe': [
    'BYTxPFj44uo'
  ],
  'cars': [
    'QvA2NCigtBY'
  ]
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomVideoId(category: keyof typeof VIDEO_IDS): string {
  const videos = VIDEO_IDS[category]
  const shuffled = shuffleArray(videos)
  return shuffled[0]
}

export function useYouTubePlayer() {
  const playerInstanceRef = useRef<any>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)

  const onReady = (event: any) => {
    if (event?.target) {
      playerInstanceRef.current = event.target
      event.target.setVolume(volume)
      setIsPlayerReady(true)
    }
  }

  const onStateChange = (event: any) => {
    if (!event?.data) return
    const state = event.data
    return state === 1
  }

  const play = () => {
    if (playerInstanceRef.current && playerInstanceRef.current.playVideo) {
      playerInstanceRef.current.playVideo()
    }
  }

  const stop = () => {
    if (playerInstanceRef.current && playerInstanceRef.current.stopVideo) {
      playerInstanceRef.current.stopVideo()
    }
  }

  const setVolumeLevel = (newVolume: number) => {
    setVolume(newVolume)
    if (isPlayerReady && playerInstanceRef.current) {
      playerInstanceRef.current.setVolume(newVolume)
    }
  }

  const reset = () => {
    setIsPlayerReady(false)
    setCurrentVideoId(null)
  }

  return {
    playerInstanceRef,
    currentVideoId,
    setCurrentVideoId,
    isPlayerReady,
    volume,
    setVolume: setVolumeLevel,
    onReady,
    onStateChange,
    play,
    stop,
    reset
  }
}
