import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

interface AnimatedBackgroundProps {
  isPlaying: boolean
}

function hslToRgb(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return `rgb(${Math.round(255 * f(0))}, ${Math.round(255 * f(8))}, ${Math.round(255 * f(4))})`
}

export function AnimatedBackground({ isPlaying }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rippleRef = useRef({ radius: 0, opacity: 0 })
  const isPlayingRef = useRef(isPlaying)
  const timeRef = useRef(0)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const particleCount = 80
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      })
    }
    particlesRef.current = particles

    const animate = () => {
      timeRef.current += 0.002
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const hue1 = 220 + Math.sin(timeRef.current) * 20
      const hue2 = 270 + Math.cos(timeRef.current * 0.7) * 30
      const hue3 = 220 + Math.sin(timeRef.current * 0.5) * 15

      const color1 = hslToRgb(hue1, 40, 12)
      const color2 = hslToRgb(hue2, 60, 25)
      const color3 = hslToRgb(hue3, 45, 14)

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, color1)
      gradient.addColorStop(0.5, color2)
      gradient.addColorStop(1, color3)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const currentIsPlaying = isPlayingRef.current
      const speedMultiplier = currentIsPlaying ? 3 : 1
      const alphaMultiplier = currentIsPlaying ? 1 : 0.6

      if (currentIsPlaying && rippleRef.current.opacity < 1) {
        rippleRef.current.opacity += 0.02
      } else if (!currentIsPlaying && rippleRef.current.opacity > 0) {
        rippleRef.current.opacity -= 0.02
      }

      if (rippleRef.current.opacity > 0) {
        rippleRef.current.radius += 2
        if (rippleRef.current.radius > Math.max(canvas.width, canvas.height) * 0.8) {
          rippleRef.current.radius = 0
        }

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const maxRadius = Math.max(canvas.width, canvas.height) * 0.8
        const progress = 1 - (rippleRef.current.radius / maxRadius)
        const smoothOpacity = progress * 0.4

        ctx.beginPath()
        ctx.arc(centerX, centerY, rippleRef.current.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(168, 85, 247, ${smoothOpacity})`
        ctx.lineWidth = 2
        ctx.stroke()

        const secondRadius = rippleRef.current.radius * 0.7
        const secondProgress = 1 - (secondRadius / maxRadius)
        const secondOpacity = secondProgress * 0.3
        if (secondRadius > 0) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, secondRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(192, 132, 252, ${secondOpacity})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        const thirdRadius = rippleRef.current.radius * 0.4
        const thirdProgress = 1 - (thirdRadius / maxRadius)
        const thirdOpacity = thirdProgress * 0.2
        if (thirdRadius > 0) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, thirdRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(216, 180, 254, ${thirdOpacity})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      particles.forEach((particle) => {
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        let fx = 0
        let fy = 0

        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance
          fx = (dx / distance) * force * 2
          fy = (dy / distance) * force * 2
        }

        particle.x += (particle.vx + fx) * speedMultiplier
        particle.y += (particle.vy + fy) * speedMultiplier

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 85, 247, ${alphaMultiplier})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  )
}
