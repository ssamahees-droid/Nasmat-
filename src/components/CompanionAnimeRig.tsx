import React, { useMemo } from 'react';
import { AnimeAccessory, AnimeTheme, CompanionExpression, CompanionPersona } from '../types/companion';

export interface CompanionAnimeRigProps {
  persona: CompanionPersona;
  expression: CompanionExpression;
  isSpeaking: boolean;
  isListening: boolean;
  isAnimatedMode: boolean;
  breathTick: number;
  isBlinking: boolean;
  isWinking: boolean;
  visemeIndex: number;
  accessory: AnimeAccessory;
  theme: AnimeTheme;
}

export const CompanionAnimeRig: React.FC<CompanionAnimeRigProps> = ({
  persona,
  expression,
  isSpeaking,
  isListening,
  isAnimatedMode,
  breathTick,
  isBlinking,
  isWinking,
  visemeIndex,
  accessory
}) => {
  // Palettes per anime persona
  const personaTheme = useMemo(() => {
    switch (persona) {
      case 'child':
        return {
          skinTone: '#FFF2E6',
          skinShadow: '#F8D8C0',
          blush: '#FF9D9D',
          hairColor: '#542B14',
          hairHighlight: '#8B4D26',
          hairGlint: '#C87B4A',
          irisTop: '#68350F',
          irisMid: '#9B531C',
          irisBottom: '#D88235',
          irisGlow: '#F5B05E',
          clothingMain: '#E87A3C',
          clothingAccent: '#FF9E64',
          clothingShadow: '#BA531E'
        };
      case 'father':
        return {
          skinTone: '#FDF3E7',
          skinShadow: '#ECD7C2',
          blush: '#E5A0A0',
          hairColor: '#252B2E',
          hairHighlight: '#3E464B',
          hairGlint: '#DCE0E5',
          irisTop: '#3D2817',
          irisMid: '#704824',
          irisBottom: '#A8743E',
          irisGlow: '#D49B55',
          clothingMain: '#2D3F4E',
          clothingAccent: '#3E576C',
          clothingShadow: '#1B2732'
        };
      case 'adult':
      default:
        return {
          skinTone: '#FFF8F0',
          skinShadow: '#F5E4D5',
          blush: '#FFB8B8',
          hairColor: '#362215',
          hairHighlight: '#5A3922',
          hairGlint: '#875936',
          irisTop: '#164E3D',
          irisMid: '#1F7A5C',
          irisBottom: '#2EA07B',
          irisGlow: '#4FD1A1',
          clothingMain: '#244A38',
          clothingAccent: '#35634D',
          clothingShadow: '#153023'
        };
    }
  }, [persona]);

  // Eyebrow geometry based on expression
  const { leftBrow, rightBrow } = useMemo(() => {
    switch (expression) {
      case 'listening':
        return { leftBrow: 'M 32 37 Q 40 33 48 36', rightBrow: 'M 52 36 Q 60 33 68 37' };
      case 'thinking':
        return { leftBrow: 'M 32 35 Q 40 31 48 35', rightBrow: 'M 52 39 Q 60 37 68 40' };
      case 'empathy':
        return { leftBrow: 'M 32 38 Q 40 34 48 38', rightBrow: 'M 52 38 Q 60 34 68 38' };
      case 'encouraging':
        return { leftBrow: 'M 32 35 Q 40 30 48 35', rightBrow: 'M 52 35 Q 60 30 68 35' };
      case 'speaking':
        return { leftBrow: 'M 32 35 Q 40 31 48 36', rightBrow: 'M 52 36 Q 60 31 68 35' };
      case 'welcome':
      default:
        return { leftBrow: 'M 32 36 Q 40 33 48 37', rightBrow: 'M 52 37 Q 60 33 68 36' };
    }
  }, [expression]);

  // Mouth Path Morphing for Viseme Lip-Sync
  const mouthPath = useMemo(() => {
    if (isSpeaking) {
      switch (visemeIndex) {
        case 1: // Open A/O
          return 'M 42 66 Q 50 63 58 66 Q 58 75 50 75 Q 42 75 42 66 Z';
        case 2: // Mid E
          return 'M 41 67 Q 50 64 59 67 Q 59 72 50 72 Q 41 72 41 67 Z';
        case 3: // Wide I/smile
          return 'M 39 67 Q 50 65 61 67 Q 58 74 50 74 Q 42 74 39 67 Z';
        case 4: // Round O/U
          return 'M 45 66 Q 50 63 55 66 Q 55 74 50 74 Q 45 74 45 66 Z';
        case 0:
        default:
          return 'M 42 67 Q 50 69 58 67';
      }
    }

    if (isWinking) {
      return 'M 40 66 Q 50 75 60 66';
    }

    switch (expression) {
      case 'encouraging':
        return 'M 40 66 Q 50 76 60 66';
      case 'thinking':
        return 'M 43 68 Q 50 66 57 68';
      case 'listening':
        return 'M 41 67 Q 50 71 59 67';
      case 'empathy':
      case 'welcome':
      default:
        return 'M 41 66 Q 50 73 59 66';
    }
  }, [isSpeaking, visemeIndex, expression, isWinking]);

  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full object-cover select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Skin Gradient */}
        <linearGradient id={`skinGrad-${persona}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={personaTheme.skinTone} />
          <stop offset="100%" stopColor={personaTheme.skinShadow} />
        </linearGradient>

        {/* Hair Base Gradient */}
        <linearGradient id={`hairGrad-${persona}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={personaTheme.hairHighlight} />
          <stop offset="45%" stopColor={personaTheme.hairColor} />
          <stop offset="100%" stopColor="#141A17" />
        </linearGradient>

        {/* Hair Angel Ring Highlight */}
        <linearGradient id={`hairHaloGrad-${persona}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={personaTheme.hairGlint} stopOpacity="0" />
          <stop offset="50%" stopColor={personaTheme.hairGlint} stopOpacity="0.85" />
          <stop offset="100%" stopColor={personaTheme.hairGlint} stopOpacity="0" />
        </linearGradient>

        {/* Silver Streak Gradient for Inner Father */}
        <linearGradient id="silverStreakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="80%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Anime Iris Gradient */}
        <linearGradient id={`irisGrad-${persona}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={personaTheme.irisTop} />
          <stop offset="45%" stopColor={personaTheme.irisMid} />
          <stop offset="85%" stopColor={personaTheme.irisBottom} />
          <stop offset="100%" stopColor={personaTheme.irisGlow} />
        </linearGradient>

        {/* Clothes Gradient */}
        <linearGradient id={`clothGrad-${persona}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={personaTheme.clothingAccent} />
          <stop offset="30%" stopColor={personaTheme.clothingMain} />
          <stop offset="100%" stopColor={personaTheme.clothingShadow} />
        </linearGradient>

        {/* Soft Drop Shadow */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* 1. Torso & Clothing */}
      <g id="torso">
        <path
          d="M 20 100 Q 24 82 34 76 Q 50 82 66 76 Q 76 82 80 100 Z"
          fill={`url(#clothGrad-${persona})`}
          filter="url(#softShadow)"
        />

        {/* Torso Details per Persona */}
        {persona === 'child' && (
          <g>
            {/* Cozy Hoodie Collar */}
            <path d="M 36 75 Q 50 88 64 75 Q 50 84 36 75 Z" fill={personaTheme.clothingAccent} />
            <path d="M 46 80 L 46 95" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <path d="M 54 80 L 54 95" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <circle cx="46" cy="95" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="54" cy="95" r="1.6" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {persona === 'adult' && (
          <g>
            {/* Structured Balanced Shirt Collar */}
            <path d="M 40 73 L 50 85 L 60 73" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
            <path d="M 41 73 L 47 84 L 50 78 L 53 84 L 59 73" fill={personaTheme.clothingAccent} opacity="0.5" />
          </g>
        )}

        {persona === 'father' && (
          <g>
            {/* Protective Mantle / Cowl Scarf with Golden Brooch */}
            <path d="M 32 75 Q 50 90 68 75 Q 50 82 32 75 Z" fill={personaTheme.clothingAccent} />
            <circle cx="50" cy="82" r="3.2" fill="#FACC15" filter="url(#softShadow)" />
            <circle cx="50" cy="82" r="1.6" fill="#FEF08A" />
          </g>
        )}
      </g>

      {/* 2. Neck & Head Base */}
      <g id="head">
        {/* Neck */}
        <path d="M 43 65 L 43 78 Q 50 81 57 78 L 57 65 Z" fill={`url(#skinGrad-${persona})`} />
        {/* Soft neck shadow below chin */}
        <path d="M 43 67 Q 50 74 57 67 Z" fill={personaTheme.skinShadow} opacity="0.7" />

        {/* Anime Face Shape (soft rounded jaw with cute contour) */}
        <path
          d="M 28 42 Q 28 62 44 71 Q 50 74 56 71 Q 72 62 72 42 Q 72 24 50 24 Q 28 24 28 42 Z"
          fill={`url(#skinGrad-${persona})`}
          filter="url(#softShadow)"
        />

        {/* Cheerful Anime Blush */}
        <ellipse cx="34" cy="56" rx="4.5" ry="2.2" fill={personaTheme.blush} opacity="0.55" />
        <ellipse cx="66" cy="56" rx="4.5" ry="2.2" fill={personaTheme.blush} opacity="0.55" />

        {/* Inner Father Dignified Trimmed Beard */}
        {persona === 'father' && (
          <g opacity="0.85">
            <path
              d="M 40 68 Q 50 76 60 68 Q 50 73 40 68 Z"
              fill={personaTheme.hairColor}
            />
            <path
              d="M 45 64 Q 50 66 55 64"
              stroke={personaTheme.hairColor}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>

      {/* 3. Facial Features: Eyebrows, Eyes, Nose, Mouth */}
      <g id="face-features">
        {/* Eyebrows */}
        <path d={leftBrow} stroke={personaTheme.hairColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d={rightBrow} stroke={personaTheme.hairColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        {/* Left Eye */}
        {isBlinking ? (
          <path d="M 34 50 Q 41 55 48 50" stroke={personaTheme.hairColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        ) : (
          <g id="left-eye">
            {/* Sclera */}
            <path d="M 33 50 Q 41 43 49 50 Q 41 57 33 50 Z" fill="#FFFFFF" />
            {/* Iris */}
            <ellipse cx="41" cy="50" rx="5.2" ry="6.2" fill={`url(#irisGrad-${persona})`} />
            {/* Pupil */}
            <ellipse cx="41" cy="50" rx="2.5" ry="3.2" fill="#1A1C1B" />
            {/* Specular Glints */}
            <circle cx="39.5" cy="48" r="1.8" fill="#FFFFFF" />
            <circle cx="43" cy="52.5" r="0.9" fill="#FFFFFF" opacity="0.85" />
            {/* Upper Eyelash */}
            <path d="M 32 49 Q 41 42 50 49" stroke={personaTheme.hairColor} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Right Eye (winks on reassurance tap) */}
        {isBlinking || isWinking ? (
          <path d="M 52 50 Q 59 55 66 50" stroke={personaTheme.hairColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        ) : (
          <g id="right-eye">
            {/* Sclera */}
            <path d="M 51 50 Q 59 43 67 50 Q 59 57 51 50 Z" fill="#FFFFFF" />
            {/* Iris */}
            <ellipse cx="59" cy="50" rx="5.2" ry="6.2" fill={`url(#irisGrad-${persona})`} />
            {/* Pupil */}
            <ellipse cx="59" cy="50" rx="2.5" ry="3.2" fill="#1A1C1B" />
            {/* Specular Glints */}
            <circle cx="57.5" cy="48" r="1.8" fill="#FFFFFF" />
            <circle cx="61" cy="52.5" r="0.9" fill="#FFFFFF" opacity="0.85" />
            {/* Upper Eyelash */}
            <path d="M 50 49 Q 59 42 68 49" stroke={personaTheme.hairColor} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Delicate Anime Nose */}
        <circle cx="50" cy="58" r="0.8" fill={personaTheme.skinShadow} opacity="0.9" />

        {/* Morphing Expression Mouth */}
        <path
          d={mouthPath}
          stroke={personaTheme.hairColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill={isSpeaking && visemeIndex > 0 ? '#C25E5E' : 'none'}
        />
      </g>

      {/* 4. Hair Styles per Persona */}
      <g id="hair">
        {persona === 'child' && (
          <g id="child-hair">
            {/* Back Hair */}
            <path d="M 22 45 Q 20 22 50 18 Q 80 22 78 45 Q 70 58 66 50 Q 50 48 34 50 Q 30 58 22 45 Z" fill={`url(#hairGrad-${persona})`} />
            {/* Messy Front Tuft & Spikes */}
            <path d="M 28 35 Q 36 24 48 30 Q 42 22 52 24 Q 58 22 66 32 Q 72 35 68 42 Q 62 34 56 36 Q 48 32 38 40 Q 32 38 28 35 Z" fill={`url(#hairGrad-${persona})`} />
            {/* Playful Ahoge Tuft (bounces gently with breath) */}
            <path
              d="M 50 19 Q 54 10 60 12 Q 55 14 51 20 Z"
              fill={personaTheme.hairHighlight}
              style={{
                transform: isAnimatedMode ? `rotate(${Math.sin((breathTick * Math.PI) / 15) * 4}deg)` : 'none',
                transformOrigin: '50% 19%'
              }}
            />
          </g>
        )}

        {persona === 'adult' && (
          <g id="adult-hair">
            {/* Neat contoured medium hair */}
            <path d="M 24 45 Q 22 18 50 16 Q 78 18 76 45 Q 74 30 50 26 Q 26 30 24 45 Z" fill={`url(#hairGrad-${persona})`} />
            {/* Side-swept Bangs */}
            <path d="M 26 36 Q 38 25 54 32 Q 44 26 62 30 Q 70 34 74 44 Q 68 34 58 35 Q 46 32 32 44 Q 28 40 26 36 Z" fill={`url(#hairGrad-${persona})`} />
            {/* Framing Side Locks */}
            <path d="M 26 40 Q 28 50 31 54 Q 30 46 28 40 Z" fill={`url(#hairGrad-${persona})`} />
            <path d="M 74 40 Q 72 50 69 54 Q 70 46 72 40 Z" fill={`url(#hairGrad-${persona})`} />
          </g>
        )}

        {persona === 'father' && (
          <g id="father-hair">
            {/* Dignified Swept-back Hair */}
            <path d="M 25 44 Q 22 16 50 15 Q 78 16 75 44 Q 70 28 50 24 Q 30 28 25 44 Z" fill={`url(#hairGrad-${persona})`} />
            <path d="M 28 34 Q 40 22 55 28 Q 66 24 73 38 Q 65 28 52 28 Q 38 26 28 34 Z" fill={`url(#hairGrad-${persona})`} />
            {/* Prominent Silver Streak Gradient */}
            <path d="M 38 22 Q 48 18 56 24 Q 48 22 40 25 Z" fill="url(#silverStreakGrad)" opacity="0.95" />
            <path d="M 60 22 Q 68 24 71 30 Q 66 26 58 24 Z" fill="url(#silverStreakGrad)" opacity="0.8" />
          </g>
        )}

        {/* Hair Angel Ring Halo Sheen */}
        <ellipse cx="50" cy="27" rx="18" ry="4" fill={`url(#hairHaloGrad-${persona})`} opacity="0.75" />
      </g>

      {/* 5. Accessories (Sprout, Sakura, Crescent, Glasses) */}
      <g id="accessories">
        {accessory === 'sprout' && (
          <g 
            style={{ 
              transform: isAnimatedMode ? `rotate(${Math.sin((breathTick * Math.PI) / 15) * 6}deg)` : 'none', 
              transformOrigin: '50% 19%' 
            }}
          >
            <path d="M 50 19 Q 45 13 41 14 Q 42 18 50 19" fill="#48B87B" />
            <path d="M 50 19 Q 55 11 60 13 Q 58 18 50 19" fill="#74D89E" />
            <line x1="50" y1="19" x2="50" y2="15" stroke="#2D7A50" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="60" cy="13" r="1.2" fill="#FFEB3B" opacity="0.9" />
          </g>
        )}

        {accessory === 'sakura' && (
          <g 
            style={{ 
              transform: isAnimatedMode ? `rotate(${Math.sin((breathTick * Math.PI) / 20) * 4}deg)` : 'none', 
              transformOrigin: '66% 26%' 
            }}
          >
            <circle cx="66" cy="25" r="3" fill="#FFB7C5" />
            <circle cx="69" cy="27" r="3" fill="#FFC2D1" />
            <circle cx="68" cy="31" r="3" fill="#FFB7C5" />
            <circle cx="64" cy="31" r="3" fill="#FFC2D1" />
            <circle cx="63" cy="27" r="3" fill="#FFB7C5" />
            <circle cx="66" cy="28" r="1.6" fill="#FDE047" />
          </g>
        )}

        {accessory === 'crescent' && (
          <g 
            style={{ 
              transform: isAnimatedMode ? `translateY(${Math.sin((breathTick * Math.PI) / 18) * 1.5}px)` : 'none' 
            }}
          >
            <path 
              d="M 68 20 A 4.5 4.5 0 1 0 71 28 A 3.6 3.6 0 1 1 68 20 Z" 
              fill="#FACC15" 
              filter="url(#softShadow)"
            />
            <circle cx="70" cy="31" r="1" fill="#FEF08A" />
          </g>
        )}

        {accessory === 'glasses' && (
          <g opacity="0.92">
            <circle cx="41" cy="50" rx="6" ry="6.2" stroke="#D4AF37" strokeWidth="1.2" fill="#FFFFFF" fillOpacity="0.12" />
            <path d="M 38 47 Q 41 45 43 48" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.75" />
            <path d="M 47 50 Q 50 48 53 50" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
            <circle cx="59" cy="50" rx="6" ry="6.2" stroke="#D4AF37" strokeWidth="1.2" fill="#FFFFFF" fillOpacity="0.12" />
            <path d="M 56 47 Q 59 45 61 48" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.75" />
            <line x1="35" y1="50" x2="31" y2="51" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round" />
            <line x1="65" y1="50" x2="69" y2="51" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* 6. Listening Audio Wave Ring Overlay */}
      {isListening && (
        <circle cx="50" cy="50" r="47" stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0.5" className="animate-ping" />
      )}
    </svg>
  );
};
