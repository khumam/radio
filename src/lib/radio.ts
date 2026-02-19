export interface RadioStation {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  homepage: string
  favicon: string
  tags: string
  country: string
  state: string
  language: string
  votes: number
  codec: string
  bitrate: number
  lastcheckok: number
  lastchecktime: string
}

const STORAGE_KEY = 'cachedRadioStations'

interface CachedRadioStations {
  stations: Record<string, RadioStation[]>
  date: string
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function setCachedStations(category: string, stations: RadioStation[]): void {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    const data: CachedRadioStations = cached ? JSON.parse(cached) : { stations: {}, date: getTodayDate() }
    data.stations[category] = stations
    data.date = getTodayDate()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
  }
}

async function fetchFromRadioBrowser(query: string): Promise<RadioStation[]> {
  try {
    const url = `https://de1.api.radio-browser.info/json/stations/search?${query}`
    const response = await fetch(url)
    const stations: RadioStation[] = await response.json()

    return stations
      .filter(station => station.lastcheckok === 1 && station.codec !== 'unknown')
      .slice(0, 10)
  } catch (error) {
    return []
  }
}

export async function fetchRadioStations(category: string): Promise<RadioStation[]> {
  const today = getTodayDate()
  const cached = localStorage.getItem(STORAGE_KEY)
  const data: CachedRadioStations = cached ? JSON.parse(cached) : { stations: {}, date: getTodayDate() }

  const isQuery = category.includes('&')

  if (data.date === today && !isQuery && data.stations[category]) {
    return data.stations[category]
  }

  const query = isQuery ? category : getCategoryQuery(category)
  const stations = await fetchFromRadioBrowser(query)
  setCachedStations(category, stations)
  return stations
}

export function getCategoryQuery(category: string): string {
  return `taglist=${category}&limit=30&order=clickcount&reverse=true&bitrate_min=64`
}

export function getRandomStation(stations: RadioStation[]): RadioStation | null {
  if (!stations || stations.length === 0) return null
  const shuffled = [...stations].sort(() => Math.random() - 0.5)
  return shuffled[0]
}
