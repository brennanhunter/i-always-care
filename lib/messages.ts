export interface Message {
  id: number;
  day: number; // 1-45
  type: 'affirmation' | 'bond' | 'reward';
  text: string;
  rewardDetails?: string; // For claimable rewards
  claimed?: boolean;
  claimedDate?: string;
}

export const messages: Message[] = [
  {
    id: 1,
    day: 1,
    type: 'reward',
    text: 'Merry Christmas Princess! Before you, my life felt stuffy and closed in. Then you came along and became my breath of fresh air - filling my world with light, love, and joy. Today, let me give you a breath of fresh air: 1 hour all to yourself. Me and the older boys have the younger two covered. Go enjoy, relax, and breathe. You deserve it. ❤️',
    rewardDetails: '1 hour break - we babysit the younger kids',
  },
  {
    id: 2,
    day: 2,
    type: 'affirmation',
    text: 'Your smile lights up my world in ways words cannot express. Never forget how beautiful you are, inside and out.',
  },
  {
    id: 3,
    day: 3,
    type: 'bond',
    text: 'Remember our first date? I knew then that you were someone special. Every day since has only confirmed it.',
  },
  {
    id: 4,
    day: 4,
    type: 'reward',
    text: 'REWARD: One full hour back massage - no questions asked, whenever you want it!',
    rewardDetails: 'One hour back massage',
  },
  {
    id: 5,
    day: 5,
    type: 'affirmation',
    text: 'You are stronger than you know, braver than you believe, and more loved than you can imagine.',
  },
  {
    id: 6,
    day: 6,
    type: 'bond',
    text: 'I love how we can talk about anything and everything. Your mind fascinates me as much as your heart captivates me.',
  },
  {
    id: 7,
    day: 7,
    type: 'affirmation',
    text: 'Your kindness makes the world a better place. Thank you for being the most caring person I know.',
  },
  {
    id: 8,
    day: 8,
    type: 'reward',
    text: 'REWARD: Your choice of restaurant - date night is on me, anywhere you want!',
    rewardDetails: 'Date night at restaurant of your choice',
  },
  {
    id: 9,
    day: 9,
    type: 'affirmation',
    text: 'Every challenge you face, you handle with such grace. I admire your strength more than you know.',
  },
  {
    id: 10,
    day: 10,
    type: 'bond',
    text: 'The way you laugh at my terrible jokes is one of my favorite things in the world. Never stop being you.',
  },
  {
    id: 11,
    day: 11,
    type: 'affirmation',
    text: 'You deserve all the happiness in the world. I am so lucky to be the one who gets to try to give it to you.',
  },
  {
    id: 12,
    day: 12,
    type: 'reward',
    text: 'REWARD: Breakfast in bed - your favorite meal, made with love!',
    rewardDetails: 'Breakfast in bed',
  },
  {
    id: 13,
    day: 13,
    type: 'bond',
    text: 'I love how safe I feel with you. You are my home, my peace, my everything.',
  },
  {
    id: 14,
    day: 14,
    type: 'affirmation',
    text: 'Your intelligence and wisdom never cease to amaze me. You make me want to be better every day.',
  },
  {
    id: 15,
    day: 15,
    type: 'bond',
    text: 'Remember when we stayed up all night just talking? I would do that every night if I could. You are my favorite person.',
  },
  {
    id: 16,
    day: 16,
    type: 'reward',
    text: 'REWARD: Movie night marathon - your choice of movies, I provide the snacks and cuddles!',
    rewardDetails: 'Movie night marathon with snacks',
  },
  {
    id: 17,
    day: 17,
    type: 'affirmation',
    text: 'You have a heart of gold. The way you care for others inspires me to be more compassionate.',
  },
  {
    id: 18,
    day: 18,
    type: 'bond',
    text: 'I love the little moments with you - cooking together, lazy Sundays, quiet mornings. Those are my treasures.',
  },
  {
    id: 19,
    day: 19,
    type: 'affirmation',
    text: 'You are capable of achieving anything you set your mind to. I believe in you completely.',
  },
  {
    id: 20,
    day: 20,
    type: 'reward',
    text: 'REWARD: Full day of no chores - I will handle everything while you relax!',
    rewardDetails: 'Full day off from chores',
  },
  {
    id: 21,
    day: 21,
    type: 'bond',
    text: 'The sound of your voice is my favorite sound. Your laughter is my favorite song.',
  },
  {
    id: 22,
    day: 22,
    type: 'affirmation',
    text: 'You make everything better just by being you. Your presence is a gift I never take for granted.',
  },
  {
    id: 23,
    day: 23,
    type: 'bond',
    text: 'I love how we can communicate without words. One look and I know exactly what you are thinking.',
  },
  {
    id: 24,
    day: 24,
    type: 'reward',
    text: 'REWARD: Spa day at home - bubble bath, candles, face masks, the works!',
    rewardDetails: 'Home spa day',
  },
  {
    id: 25,
    day: 25,
    type: 'affirmation',
    text: 'Your dreams matter. Your goals matter. You matter. Never let anyone make you feel otherwise.',
  },
  {
    id: 26,
    day: 26,
    type: 'bond',
    text: 'Thank you for choosing me every day. Thank you for your patience, your love, your everything.',
  },
  {
    id: 27,
    day: 27,
    type: 'affirmation',
    text: 'You are more than enough. You have always been enough. You will always be enough.',
  },
  {
    id: 28,
    day: 28,
    type: 'reward',
    text: 'REWARD: Shopping spree - pick something you have been wanting, my treat!',
    rewardDetails: 'Shopping spree gift',
  },
  {
    id: 29,
    day: 29,
    type: 'bond',
    text: 'I love watching you pursue your passions. Seeing you happy makes my heart full.',
  },
  {
    id: 30,
    day: 30,
    type: 'affirmation',
    text: 'You are a work of art. Every part of you is beautiful, from your mind to your soul to your smile.',
  },
  {
    id: 31,
    day: 31,
    type: 'bond',
    text: 'Being with you feels like home. No matter where we are, if you are there, I am home.',
  },
  {
    id: 32,
    day: 32,
    type: 'reward',
    text: 'REWARD: Foot massage while we watch your favorite show!',
    rewardDetails: 'Foot massage TV session',
  },
  {
    id: 33,
    day: 33,
    type: 'affirmation',
    text: 'Your love has made me a better person. Thank you for seeing the best in me.',
  },
  {
    id: 34,
    day: 34,
    type: 'bond',
    text: 'I love the way you dance when you think no one is watching. I love all your quirks.',
  },
  {
    id: 35,
    day: 35,
    type: 'affirmation',
    text: 'You are worthy of all the love, joy, and success in the world. Do not ever doubt that.',
  },
  {
    id: 36,
    day: 36,
    type: 'reward',
    text: 'REWARD: Surprise date night - let me plan everything, you just show up looking gorgeous (which you always do)!',
    rewardDetails: 'Surprise date night',
  },
  {
    id: 37,
    day: 37,
    type: 'bond',
    text: 'Thank you for being my partner in everything. Life with you is the greatest adventure.',
  },
  {
    id: 38,
    day: 38,
    type: 'affirmation',
    text: 'Your resilience amazes me. No matter what life throws at you, you rise above it.',
  },
  {
    id: 39,
    day: 39,
    type: 'bond',
    text: 'I love growing old with you. Every wrinkle, every gray hair, every year makes you more beautiful to me.',
  },
  {
    id: 40,
    day: 40,
    type: 'reward',
    text: 'REWARD: Lazy Sunday - we stay in pajamas all day, order takeout, and do absolutely nothing!',
    rewardDetails: 'Lazy Sunday in pajamas',
  },
  {
    id: 41,
    day: 41,
    type: 'affirmation',
    text: 'You are the strongest person I know. Your courage inspires me every single day.',
  },
  {
    id: 42,
    day: 42,
    type: 'bond',
    text: 'I fall in love with you more every day. Thank you for being my forever.',
  },
  {
    id: 43,
    day: 43,
    type: 'affirmation',
    text: 'You are exactly who you are supposed to be. Perfect in your imperfections.',
  },
  {
    id: 44,
    day: 44,
    type: 'reward',
    text: 'REWARD: Your choice of surprise gift - tell me what you have been wanting!',
    rewardDetails: 'Surprise gift of your choice',
  },
  {
    id: 45,
    day: 45,
    type: 'bond',
    text: 'These 45 days are just the beginning. I will spend the rest of my life showing you how much I love you. You are my everything. ❤️',
  },
];

// Helper function to get message by ID
export const getMessageByDay = (id: number): Message | undefined => {
  return messages.find(m => m.id === id);
};

// Helper to get all messages up to a certain day
export const getMessagesUpToDay = (day: number): Message[] => {
  return messages.filter(m => m.day <= day);
};

// Helper to get only reward messages
export const getRewardMessages = (): Message[] => {
  return messages.filter(m => m.type === 'reward');
};
