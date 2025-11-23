'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const loadScript = () => {
      if (!window.UnicornStudio) {
        window.UnicornStudio = { isInitialized: false };
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.35/dist/unicornStudio.umd.js';
        script.onload = () => {
          if (!window.UnicornStudio.isInitialized) {
            if (typeof window.UnicornStudio.init === 'function') {
              window.UnicornStudio.init();
              window.UnicornStudio.isInitialized = true;
            }
          }
        };
        (document.head || document.body).appendChild(script);
      }
    };

    loadScript();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950">
      <div 
        data-us-project="KZ5tVUOUmE7H92J9Vsig" 
        style={{
          width: '100vw', 
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      
      {/* Products Button */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={() => router.push('/products')}
          className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-12 py-4 rounded-full font-bold text-xl hover:from-amber-700 hover:to-amber-900 transition-all shadow-2xl hover:shadow-amber-500/50 hover:scale-105"
        >
          Products
        </button>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    UnicornStudio: any;
  }
}
