import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // Silence Turbopack warning for webpack-based next-pwa
};

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // iOS-specific settings
  buildExcludes: [/middleware-manifest.json$/],
  // Don't precache the Firebase messaging service worker
  publicExcludes: ['!firebase-messaging-sw.js'],
})(nextConfig as any);

export default config;
