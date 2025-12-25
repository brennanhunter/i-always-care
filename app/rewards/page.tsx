'use client';

import { useEffect, useState } from 'react';
import { getUnredeemedRewards, redeemReward } from '@/lib/storage';
import { getMessageByDay } from '@/lib/messages';
import type { Message } from '@/lib/messages';
import Link from 'next/link';

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Message[]>([]);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = () => {
    const unredeemedIds = getUnredeemedRewards();
    const rewardMessages = unredeemedIds
      .map(id => getMessageByDay(id))
      .filter((msg): msg is Message => msg !== undefined && msg.type === 'reward');
    setRewards(rewardMessages);
  };

  const handleRedeem = (messageId: number) => {
    redeemReward(messageId);
    loadRewards(); // Reload to remove redeemed reward
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#F794A8' }}>
      <main className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-white hover:text-gray-100 transition-colors">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-white">My Rewards</h1>
          <div className="w-16"></div>
        </div>

        {/* Rewards List */}
        {rewards.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <img src="/reward-icon.png" alt="Reward" className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Rewards Yet</h2>
            <p className="text-gray-600">
              Claim rewards from your daily messages and they'll appear here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div 
                key={reward.id} 
                className="bg-white rounded-2xl shadow-xl p-6 flex items-start gap-4 hover:shadow-2xl transition-all"
              >
                <input
                  type="checkbox"
                  onChange={() => handleRedeem(reward.id)}
                  className="mt-1 w-6 h-6 accent-[#FD4E8F] cursor-pointer flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {reward.rewardDetails || reward.text}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {reward.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        {rewards.length > 0 && (
          <div className="mt-6 text-center text-white text-sm">
            <p>Check off rewards when you've redeemed them 💕</p>
          </div>
        )}
      </main>
    </div>
  );
}
