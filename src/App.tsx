import { useState, useRef, useEffect } from 'react'
import YouTube from 'react-youtube'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Volume2, VolumeX, Play, StopCircle, Radio } from 'lucide-react'
import { CATEGORIES, type CategoryType } from '@/lib/categories'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { fetchNewsData } from '@/lib/news'
import { fetchRadioStations, getRandomStation, type RadioStation } from '@/lib/radio'
import { getRandomVideoId } from '@/lib/youtube'

function App() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES | null>(null)
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [stationsList, setStationsList] = useState<RadioStation[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(50)
  const [newsText, setNewsText] = useState('Loading news...')
  const [currentType, setCurrentType] = useState<CategoryType | null>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const playerInstanceRef = useRef<any>(null)

  const canPlay = !isLoading && selectedCategory && (
    (currentType === 'youtube' && currentVideoId !== null) ||
    (currentType === 'radio' && currentStation !== null)
  )

  useEffect(() => {
    fetchNewsData('id', 'id').then(setNewsText)
  }, [])

  const play = () => {
    if (currentType === 'youtube' && playerInstanceRef.current && playerInstanceRef.current.playVideo) {
      playerInstanceRef.current.playVideo()
    } else if (currentType === 'radio' && audioRef.current) {
      audioRef.current.play()
    }
  }

  const stop = () => {
    if (currentType === 'youtube' && playerInstanceRef.current && playerInstanceRef.current.stopVideo) {
      playerInstanceRef.current.stopVideo()
    } else if (currentType === 'radio' && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const stopAll = () => {
    if (playerInstanceRef.current && playerInstanceRef.current.stopVideo) {
      playerInstanceRef.current.stopVideo()
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const handlePlayStop = () => {
    if (!selectedCategory || isLoading) return
    if (isPlaying) {
      stop()
    } else {
      play()
    }
  }

  const handleVolumeMin = () => {
    const newVolume = Math.max(0, volume - 10)
    setVolume(newVolume)
    if (currentType === 'youtube' && isPlayerReady && playerInstanceRef.current) {
      playerInstanceRef.current.setVolume(newVolume)
    } else if (currentType === 'radio' && audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleVolumeMax = () => {
    const newVolume = Math.min(100, volume + 10)
    setVolume(newVolume)
    if (currentType === 'youtube' && isPlayerReady && playerInstanceRef.current) {
      playerInstanceRef.current.setVolume(newVolume)
    } else if (currentType === 'radio' && audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleAudioError = () => {
    const remainingStations = stationsList.filter(s => s.stationuuid !== currentStation?.stationuuid)
    
    if (remainingStations.length > 0) {
      const nextStation = getRandomStation(remainingStations)
      if (nextStation) {
        setCurrentStation(nextStation)
      }
    } else {
      setIsPlaying(false)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const handleRadioShuffle = async () => {
    if (currentType !== 'radio' || isLoading) return
    
    stopAll()
    setIsLoading(true)
    
    const stations = await fetchRadioStations('taglist=news,talk,news,talk,music&limit=50&order=clickcount&reverse=true&bitrate_min=64')
    setStationsList(stations)
    const station = getRandomStation(stations)
    
    if (station) {
      setCurrentStation(station)
    }
    setIsLoading(false)
  }

  const onYouTubeReady = (event: any) => {
    if (event?.target) {
      playerInstanceRef.current = event.target
      event.target.setVolume(volume)
      setIsPlayerReady(true)
    }
  }

  const onYouTubeStateChange = (event: any) => {
    if (!event?.data) return
    const state = event.data
    if (state === 1) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const selectCategory = async (key: keyof typeof CATEGORIES) => {
    stopAll()
    setIsLoading(true)
    setIsPlayerReady(false)
    setSelectedCategory(key)

    const category = CATEGORIES[key]
    setCurrentType(category.type as CategoryType)

    if (category.type === 'youtube') {
      const videoId = getRandomVideoId(key as 'cafe' | 'cars')
      setCurrentVideoId(videoId)
      setCurrentStation(null)
      setStationsList([])
    } else {
      const stations = await fetchRadioStations('taglist=news,talk,news,talk,music&limit=50&order=clickcount&reverse=true&bitrate_min=64')
      setStationsList(stations)
      const station = getRandomStation(stations)
      
      if (station) {
        setCurrentStation(station)
      }
      setCurrentVideoId(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (currentType === 'youtube' && isPlayerReady && playerInstanceRef.current) {
      playerInstanceRef.current.setVolume(volume)
    } else if (currentType === 'radio' && audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  return (
    <>
      <AnimatedBackground isPlaying={isPlaying} />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10 flex-col">
      <Card className="w-full max-w-md bg-slate-800 border-purple-500/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Radio className="w-12 h-12 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-white">Radio</CardTitle>
          <CardDescription className="text-slate-300">Click Radio to shuffle through different stations worldwide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <Button
                key={key}
                onClick={() => selectCategory(key as keyof typeof CATEGORIES)}
                disabled={isLoading}
                className={`
                  ${selectedCategory === key ? 'bg-purple-600' : 'bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50'}
                  text-white flex flex-col h-auto py-3 px-2 gap-1 transition-all duration-200
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className="text-xs font-semibold">{category.name}</span>
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <Button
              size="icon-lg"
              onClick={handleVolumeMin}
              className="bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50 text-white transition-all duration-200"
            >
              <VolumeX className="w-5 h-5" />
            </Button>
            <Button
              size="icon-lg"
              onClick={handlePlayStop}
              disabled={!canPlay}
              className={`bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50 text-white transition-all duration-300 ${!canPlay ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="transition-all duration-300 ease-in-out">
                {isPlaying ? <StopCircle className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </div>
            </Button>
            <Button
              size="icon-lg"
              onClick={handleVolumeMax}
              className="bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50 text-white transition-all duration-200"
            >
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>

          {currentType === 'radio' && (
            <div className="flex justify-center">
              <Button
                size="default"
                onClick={handleRadioShuffle}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 border border-purple-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Shuffle Station
              </Button>
            </div>
          )}

          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">Volume: {volume}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full transition-all duration-200" style={{ width: `${volume}%` }} />
            </div>
          </div>

          {selectedCategory && (
            <div className="text-center">
              <div className={`text-sm font-semibold mb-1 ${isPlaying ? 'text-green-400' : 'text-slate-400'}`}>
                {isLoading ? 'Loading...' : isPlaying ? 'Now Playing' : 'Ready to Play'}
              </div>
              <div className="text-purple-300">
                {isLoading ? 'Loading...' : (
                  currentType === 'youtube'
                    ? CATEGORIES[selectedCategory].name
                    : (currentStation?.name || CATEGORIES[selectedCategory].name)
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="w-full max-w-md mt-4 overflow-hidden bg-slate-800 border border-purple-500/30 rounded-lg">
        <div className="animate-marquee marquee-content text-purple-300 py-2 px-4">
          <span className="whitespace-nowrap">
            {newsText}
          </span>
          <span className="whitespace-nowrap">
             • {newsText}
          </span>
        </div>
      </div>

      {currentVideoId && (
        <div className="opacity-0 absolute -left-[9999px]">
          <YouTube
            key={currentVideoId}
            videoId={currentVideoId}
            opts={{
              height: '200',
              width: '300',
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
              },
            }}
            onReady={onYouTubeReady}
            onStateChange={onYouTubeStateChange}
          />
        </div>
      )}

      {currentStation && (
        <audio
          ref={audioRef}
          src={currentStation.url_resolved}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          crossOrigin="anonymous"
        />
      )}
      </div>
    </>
  )
}

export default App
