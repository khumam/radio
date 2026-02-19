import { useState, useRef } from 'react'
import YouTube from 'react-youtube'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Volume2, VolumeX, Play, StopCircle, Radio } from 'lucide-react'
import { CATEGORIES, getRandomVideoId } from '@/lib/videos'

function App() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const playerInstanceRef = useRef<any>(null)

  const onReady = (event: any) => {
    playerInstanceRef.current = event.target
    event.target.setVolume(volume)
  }

  const onStateChange = (event: any) => {
    const state = event.data
    if (state === YouTube.PlayerState.PLAYING) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  const play = () => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.playVideo()
    }
  }

  const stop = () => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.stopVideo()
    }
  }

  const handlePlayStop = () => {
    if (isPlaying) {
      stop()
    } else {
      play()
    }
  }

  const handleVolumeMin = () => {
    const newVolume = Math.max(0, volume - 10)
    setVolume(newVolume)
    if (playerInstanceRef.current) {
      playerInstanceRef.current.setVolume(newVolume)
    }
  }

  const handleVolumeMax = () => {
    const newVolume = Math.min(100, volume + 10)
    setVolume(newVolume)
    if (playerInstanceRef.current) {
      playerInstanceRef.current.setVolume(newVolume)
    }
  }

  const selectCategory = (key: keyof typeof CATEGORIES) => {
    const randomVideoId = getRandomVideoId(key)
    setIsPlaying(false)
    setSelectedCategory(key)
    setCurrentVideoId(randomVideoId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm border-purple-500/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Radio className="w-12 h-12 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-white">Radio</CardTitle>
          <CardDescription className="text-slate-300">Select a category to start listening</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                onClick={() => selectCategory(key as keyof typeof CATEGORIES)}
                className={`
                  ${selectedCategory === key ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-slate-600'}
                  flex flex-col h-auto py-3 px-2 gap-1
                `}
              >
                <span className="text-xs font-semibold">{category.name}</span>
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={handleVolumeMin}
              className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-slate-200"
            >
              <VolumeX className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={handlePlayStop}
              disabled={!selectedCategory}
              className={`bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-slate-200 transition-all duration-300 ${!selectedCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="transition-all duration-300 ease-in-out">
                {isPlaying ? <StopCircle className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </div>
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={handleVolumeMax}
              className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-slate-200"
            >
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">Volume: {volume}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full transition-all duration-200" style={{ width: `${volume}%` }} />
            </div>
          </div>

          {selectedCategory && (
            <div className="text-center">
              <div className={`text-sm font-semibold mb-1 ${isPlaying ? 'text-green-400' : 'text-slate-400'}`}>
                {isPlaying ? 'Now Playing' : 'Ready to Play'}
              </div>
              <div className="text-purple-300">
                {CATEGORIES[selectedCategory].name}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
            onReady={onReady}
            onStateChange={onStateChange}
          />
        </div>
      )}
    </div>
  )
}

export default App
