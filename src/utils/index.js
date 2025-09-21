// Utility functions for GameMood AI

export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Dashboard': '/dashboard',
    'Profile': '/profile',
    'Recommendations': '/recommendations'
  };
  return routes[pageName] || '/';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getMoodColor = (mood) => {
  const moodColors = {
    'very_low': 'text-red-600',
    'low': 'text-orange-500',
    'neutral': 'text-yellow-500',
    'good': 'text-green-500',
    'excellent': 'text-emerald-600'
  };
  return moodColors[mood] || 'text-gray-500';
};

export const getMoodEmoji = (mood) => {
  const moodEmojis = {
    'very_low': '😔',
    'low': '😕',
    'neutral': '😐',
    'good': '😊',
    'excellent': '😄'
  };
  return moodEmojis[mood] || '😐';
};

export const calculateWellnessScore = (moodEntries) => {
  if (!moodEntries || moodEntries.length === 0) return 0;
  
  const moodValues = {
    'very_low': 1,
    'low': 2,
    'neutral': 3,
    'good': 4,
    'excellent': 5
  };
  
  const totalScore = moodEntries.reduce((sum, entry) => {
    const moodValue = moodValues[entry.overall_mood] || 3;
    return sum + moodValue;
  }, 0);
  
  return Math.round((totalScore / moodEntries.length) * 20); // Scale to 0-100
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 6) return 'late_night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning, Gamer';
  if (hour < 18) return 'Good Afternoon, Player';
  return 'Good Evening, Legend';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getRandomGameRecommendation = () => {
  const games = [
    { name: 'Stardew Valley', genre: 'Simulation', mood: 'calming' },
    { name: 'Celeste', genre: 'Platformer', mood: 'challenging' },
    { name: 'Journey', genre: 'Adventure', mood: 'peaceful' },
    { name: 'Animal Crossing', genre: 'Life Simulation', mood: 'relaxing' },
    { name: 'Hades', genre: 'Roguelike', mood: 'energetic' },
    { name: 'The Witcher 3', genre: 'RPG', mood: 'immersive' },
    { name: 'Minecraft', genre: 'Sandbox', mood: 'creative' },
    { name: 'Ori and the Blind Forest', genre: 'Platformer', mood: 'beautiful' }
  ];
  
  return games[Math.floor(Math.random() * games.length)];
};
