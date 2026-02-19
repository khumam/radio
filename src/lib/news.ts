interface NewsArticle {
  title: string
  description: string
  pubDate: string
  source_id: string
}

interface NewsDataResponse {
  status: string
  totalResults: number
  results: NewsArticle[]
}

interface CachedNews {
  text: string
  date: string
}

const STORAGE_KEY = 'cachedNewsData'

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

function getCachedNews(): CachedNews | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
  }
  return null
}

function setCachedNews(text: string): void {
  try {
    const cached: CachedNews = {
      text,
      date: getTodayDate()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

async function fetchFromAPI(country: string, language: string): Promise<string> {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    return 'Please add your NewsData.io API key to the .env file • Visit newsdata.io to get your free API key • '
  }

  try {
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&language=${language}&removeduplicate=1`
    const response = await fetch(url)
    const data: NewsDataResponse = await response.json()

    if (data.status !== 'success' || !data.results || data.results.length === 0) {
      return 'Unable to fetch news • Please try again later • '
    }

    const newsText = data.results
      .map(article => article.title)
      .filter(title => title && title.length > 10)
      .slice(0, 10)
      .join(' • ')

    return newsText || 'No news available at the moment • '
  } catch (error) {
    console.error('Error fetching news:', error)
    return 'Error fetching news • Please check your connection • '
  }
}

export async function fetchNewsData(country: string = 'id', language: string = 'id'): Promise<string> {
  const cached = getCachedNews()
  const today = getTodayDate()

  if (!cached) {
    const newsText = await fetchFromAPI(country, language)
    setCachedNews(newsText)
    return newsText
  }

  if (cached.date !== today) {
    const newsText = await fetchFromAPI(country, language)
    setCachedNews(newsText)
    return newsText
  }

  return cached.text
}
