/**
 * Minimal GAME_DATA for development when window.__GAME_DATA__ is not set.
 * Shape matches the full game data from game_v2.html.
 */
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="%23999" text-anchor="middle" dy=".3em"%3E?%3C/text%3E%3C/svg%3E';

export const devGameData = {
  meta: {
    title: 'Share House',
    subtitle: 'A Story About Yena',
    startScene: '1_arrival',
    affectionThresholds: { good: 18, neutral: 8 },
    endingScenes: { good: 'ending_good', neutral: 'ending_neutral', bad: 'ending_bad' },
  },
  player: { name: 'Player' },
  characters: {
    yena: {
      id: 'yena',
      name: 'Yena',
      titleCharacter: true,
      images: { default: placeholderImage },
    },
  },
  backgrounds: {
    default: 'linear-gradient(180deg, #2C2421 0%, #3d2b2b 100%)',
  },
  scenes: {
    '1_arrival': {
      background: 'default',
      dialogue: [{ speaker: 'narrator', text: 'You arrive at the share house.' }],
      next: 'ending_bad',
    },
    ending_good: {
      background: 'default',
      dialogue: [],
      ending: { type: 'Good', title: 'A New Chapter', text: 'You got the good ending.' },
    },
    ending_neutral: {
      background: 'default',
      dialogue: [],
      ending: { type: 'Neutral', title: 'The Distance Between', text: 'Neutral ending.' },
    },
    ending_bad: {
      background: 'default',
      dialogue: [],
      ending: { type: 'Bad', title: 'Unread Pages', text: 'Bad ending.' },
    },
  },
};
