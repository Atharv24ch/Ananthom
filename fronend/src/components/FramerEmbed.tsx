'use client';

import { useEffect, useRef } from 'react';

export default function FramerEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.35/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => {
        // Wait for UnicornStudio to be available
        if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
          try {
            window.UnicornStudio.init();
          } catch (error) {
            console.error('UnicornStudio init error:', error);
          }
        }
      };
      (document.head || document.body).appendChild(script);
    };

    // Check if script already loaded
    if (!window.UnicornStudio) {
      loadScript();
    } else if (typeof window.UnicornStudio.init === 'function') {
      try {
        window.UnicornStudio.init();
      } catch (error) {
        console.error('UnicornStudio init error:', error);
      }
    }
  }, []);

  return (
    <div className="w-full mb-16" ref={containerRef}>
      <div 
        data-us-project="nDgkQQisGCg6FFNL1qKp" 
        style={{
          width: '100%', 
          height: '600px', 
          maxWidth: '1440px', 
          margin: '0 auto',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px'
        }}
      />
    </div>
  );
}

declare global {
  interface Window {
    UnicornStudio: any;
  }
}
