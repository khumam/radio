export const VIDEO_IDS = {
  'cafe-chill': [
    'BYTxPFj44uo'
  ],
  'cars': [
    'QvA2NCigtBY'
  ],
  'news': [
    'yNKvkPJl-tg',
  ]
}

export const CATEGORIES = {
  'cafe-chill': {
    name: 'Cafe and Chill',
    description: 'Lofi/Chill Jazz stream'
  },
  'cars': {
    name: 'Cars',
    description: 'Driving/Synthwave stream'
  },
  'news': {
    name: 'News',
    description: 'News livestream'
  }
}

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getRandomVideoId = (category: keyof typeof VIDEO_IDS): string => {
  const videos = VIDEO_IDS[category]
  const shuffled = shuffleArray(videos)
  return shuffled[0]
}
