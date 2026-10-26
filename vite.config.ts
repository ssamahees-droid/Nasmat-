import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false
        },
        includeAssets: [
          'favicon.ico',
          'favicon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-192x192.png',
          'pwa-maskable-512x512.png',
          'logo.jpg'
        ],
        manifest: {
          id: '/',
          name: 'نسمة حياة | Nesma Hayat',
          short_name: 'نسمة حياة',
          description: 'منصة عربية تفاعلية للصحة النفسية والاستكشاف الذاتي الآمن، وتمارين الاسترخاء والتهدئة، ومتابعة الرحلة الشخصية.',
          theme_color: '#355C4A',
          background_color: '#0c0c0e',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          lang: 'ar',
          dir: 'rtl',
          categories: ['health', 'lifestyle', 'education'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-maskable-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any'
            }
          ],
          shortcuts: [
            {
              name: 'رفيقي النفسي',
              short_name: 'رفيقي',
              description: 'التحدث مع المرشد الذاتي للاحتواء والدعم النفسي',
              url: '/?action=companion',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }]
            },
            {
              name: 'تمارين التهدئة',
              short_name: 'التهدئة',
              description: 'جلسات التنفس والاسترخاء السريع',
              url: '/?action=breathe',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }]
            },
            {
              name: 'صالون النغم',
              short_name: 'الموسيقى',
              description: 'موسيقى الاسترخاء والهدوء بالبيانو الحقيقي',
              url: '/?action=music',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }]
            }
          ]
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,jpg}'],
          navigateFallback: '/index.html',
          // Strictly protect sensitive user data by refusing to cache backend/auth/database endpoints
          navigateFallbackDenylist: [/^\/api\//, /^https:\/\/(identitytoolkit|securetoken|firestore)\.googleapis\.com/],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|svgz|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'nesmat-images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 60
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:js|css)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'nesmat-static-resources-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^\/audio\/.*\.mp3$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'nature-audio-cache',
                expiration: {
                  maxEntries: 15,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^\/books\/.*\.pdf$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'nesmat-books-cache',
                expiration: {
                  maxEntries: 5,
                  maxAgeSeconds: 60 * 60 * 24 * 90
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react/') || id.includes('react-dom/')) {
                return 'vendor-react';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide';
              }
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      hmr: false,
      watch: null,
    },
  };
});
