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
      {/* Animation Container - scaled for mobile */}
      <div 
        data-us-project="KZ5tVUOUmE7H92J9Vsig" 
        className="absolute inset-0"
        style={{
          width: '100%', 
          height: '100%',
          minHeight: '100vh',
          minWidth: '100vw',
          transform: 'scale(1)',
          transformOrigin: 'center center'
        }}
      />
      
      {/* Products Button - Centered on Mobile, Bottom on Desktop */}
      <div className="absolute top-1/2 md:top-auto md:bottom-12 left-0 right-0 -translate-y-1/2 md:translate-y-0 z-50 px-4">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => router.push('/products')}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-amber-700 hover:to-amber-900 transition-all shadow-2xl hover:shadow-amber-500/50 active:scale-95 touch-manipulation"
          >
            Products
          </button>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    UnicornStudio: any;
  }
}
