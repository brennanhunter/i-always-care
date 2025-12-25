'use client';

import { useEffect, useState } from 'react';
import { initializeApp, claimReward, isRewardClaimed, getUnredeemedRewards } from '@/lib/storage';
import { getMessageByDay } from '@/lib/messages';
import type { Message } from '@/lib/messages';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';
import Link from 'next/link';

export default function Home() {
  const [daysActive, setDaysActive] = useState<number>(1);
  const [message, setMessage] = useState<Message | null>(null);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [unredeemedCount, setUnredeemedCount] = useState<number>(0);

  useEffect(() => {
    // Initialize app and get today's random message
    const state = initializeApp();
    const daysSinceStart = Math.floor((new Date().getTime() - new Date(state.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    setDaysActive(daysSinceStart);
    
    // Get today's message by ID
    const todayMessage = state.todayMessageId ? getMessageByDay(state.todayMessageId) : null;
    setMessage(todayMessage || null);
    
    // Check if reward is already claimed
    if (todayMessage && todayMessage.type === 'reward') {
      setClaimed(isRewardClaimed(todayMessage.id));
    
    // Load unredeemed rewards count
    setUnredeemedCount(getUnredeemedRewards().length);
    }

    // Request notification permission on first load
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      requestNotificationPermission();
    }

    // Listen for foreground notifications
    onMessageListener().then((payload: any) => {
      console.log('Received foreground message:', payload);
    }).catch(err => console.log('Failed to receive message:', err));
  }, []);

  const handleClaimReward = () => {
    if (message && message.type === 'reward') {
      claimReward(message.id);
      setClaimed(true);
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  if (!message) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F794A8' }}>
        <p className="text-lg text-gray-600">Loading your message...</p>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'affirmation': return 'from-[#FBB5D1] to-[#FD4E8F]';
      case 'bond': return 'from-[#FD4E8F] to-[#FBB5D1]';
      case 'reward': return 'from-[#FD4E8F] via-[#FBB5D1] to-[#FD4E8F]';
      default: return 'from-[#FBB5D1] to-[#FD4E8F]';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'affirmation': return '💝 Affirmation';
      case 'bond': return '❤️ Our Bond';
      case 'reward': return (
        <span className="flex items-center gap-2">
          <img src="/reward-icon.png" alt="Reward" className="w-5 h-5" />
          Reward
        </span>
      );
      default: return '💌 Message';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F794A8' }}>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
      
      <main className="max-w-2xl mx-auto">
        {/* Rewards Button - Always visible */}
        <div className="flex justify-end mb-4">
          <Link 
            href="/rewards"
            className="bg-white text-[#FD4E8F] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <img src="/reward-icon.png" alt="Rewards" className="w-6 h-6" />
            My Rewards {unredeemedCount > 0 && `(${unredeemedCount})`}
          </Link>
        </div>
        
        {/* v>
      )}
      
      <main className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center overflow-hidden w-48 h-48 mx-auto">
            <img 
              src="/logo.png" 
              alt="iAlwaysCare" 
              className="w-full h-full object-cover"
              style={{ backgroundColor: '#F794A8', transform: 'scale(1.6)' }}
            />
          </div>
        </div>

        {/* Day Counter */}
        <div className="bg-white rounded-full shadow-lg px-6 py-3 mb-8 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Day <span className="text-2xl" style={{ color: '#FD4E8F' }}>{daysActive}</span> together
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Your daily dose of love ❤️
          </p>
        </div>

        {/* Message Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 transform transition-all hover:scale-[1.02]">
          {/* Type Badge */}
          <div className="flex justify-center mb-6">
            <span className={`inline-block px-6 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getTypeColor(message.type)}`}>
              {getTypeLabel(message.type)}
            </span>
          </div>

          {/* Message Text */}
          <div className="text-center mb-8">
            <p className="text-2xl leading-relaxed text-gray-800 font-light">
              {message.text}
            </p>
          </div>

          {/* Reward Claim Button */}
          {message.type === 'reward' && (
            <div className="flex flex-col items-center gap-4">
              {!claimed ? (
                <button
                  onClick={handleClaimReward}
                  className="bg-gradient-to-r from-[#FD4E8F] to-[#FBB5D1] hover:from-[#FD4E8F]/90 hover:to-[#FBB5D1]/90 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2 justify-center"
                >
                  <img src="/reward-icon.png" alt="Reward" className="w-6 h-6" />
                  Claim This Reward!
                </button>
              ) : (
                <div className="text-center">
                  <div className="inline-block bg-green-100 text-green-700 px-6 py-3 rounded-full font-medium">
                    ✅ Reward Claimed!
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Let me know when you want to redeem it ❤️
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Hint */}
        <div className="text-center text-gray-500 text-sm">
          <p>Come back tomorrow for your next message 💕</p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-xs">
          <p>Made with ❤️ for the most amazing person</p>
        </div>
      </main>
    </div>
  );
}
