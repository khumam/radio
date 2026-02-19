export const CHANNEL_IDS = {
  'cafe': 'UCATyidusLbgd54WOCIryJow',
  'cars': null,
  'news': null
}

export const CHANNEL_INFO = {
  'cafe': {
    name: 'Cafe and Chill Channel',
    description: 'Lofi/chill music and cafe ambience'
  },
  'cars': {
    name: 'Cars Channel',
    description: 'Driving and synthwave music'
  },
  'news': {
    name: 'News Channel',
    description: 'News and talk radio'
  }
}

export type CategoryWithChannel = keyof typeof CHANNEL_IDS
