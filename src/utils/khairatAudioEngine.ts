// High-Fidelity Web Audio Engine for Omar Khairat relaxing oriental piano & strings music
// Generates warm acoustic grand piano tones, lush string orchestral chords, and ambient acoustics.

export interface KhairatTrack {
  id: string;
  titleAr: string;
  composerAr: string;
  maqamAr: string;
  moodTagAr: string;
  therapeuticBenefitAr: string;
  tempoBpm: number;
  durationApproxMin: number;
  icon: string;
  themeColor: string;
  // Musical sequence: notes with [pitchName, durationBeats, isChord?]
  sequence: {
    melody: Array<{ note: string; dur: number; octave?: number; velocity?: number }>;
    chords: Array<{ root: string; type: 'min' | 'maj' | 'dim' | 'sus4'; dur: number; octave?: number }>;
    bass: Array<{ note: string; dur: number; octave?: number }>;
  };
}

// Frequency map for musical notes in standard tuning (A4 = 440Hz)
const NOTE_FREQS: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18,
  'Db': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'Eb': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'Gb': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'Ab': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'Bb': 466.16,
  'B': 493.88,
  'REST': 0
};

export function getFreq(note: string, octaveOffset = 0): number {
  if (note === 'REST') return 0;
  const baseFreq = NOTE_FREQS[note] || 440;
  return baseFreq * Math.pow(2, octaveOffset);
}

// 10 curated tracks of Omar Khairat and relaxing oriental piano/strings
export const KHAIRAT_TRACKS: KhairatTrack[] = [
  {
    id: 'am-ahmed',
    titleAr: 'قضية عم أحمد',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'نهاوند / كورد',
    moodTagAr: 'سكينة وطمأنينة دافئة',
    therapeuticBenefitAr: 'تهدئة دقات القلب واستعادة التوازن النفسي والشعور بالألفة وراحة البال.',
    tempoBpm: 76,
    durationApproxMin: 5,
    icon: '☕',
    themeColor: 'from-amber-600/30 to-emerald-900/40',
    sequence: {
      melody: [
        { note: 'D', dur: 1, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'A', dur: 1.5, octave: 0 },
        { note: 'G', dur: 0.5, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'D', dur: 2, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'D', dur: 1.5, octave: 1 },
        { note: 'C', dur: 0.5, octave: 1 },
        { note: 'Bb', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'G', dur: 2, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'Bb', dur: 1.5, octave: 0 },
        { note: 'A', dur: 0.5, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'E', dur: 2, octave: 0 },
        { note: 'C#', dur: 1, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'A', dur: 2, octave: 0 },
        { note: 'D', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'D', type: 'min', dur: 4, octave: -1 },
        { root: 'D', type: 'min', dur: 4, octave: -1 },
        { root: 'G', type: 'min', dur: 4, octave: -1 },
        { root: 'A', type: 'maj', dur: 4, octave: -1 },
        { root: 'D', type: 'min', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'D', dur: 4, octave: -2 },
        { note: 'F', dur: 4, octave: -2 },
        { note: 'G', dur: 4, octave: -2 },
        { note: 'A', dur: 4, octave: -2 },
        { note: 'D', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'feeha-haga-helwa',
    titleAr: 'فيها حاجة حلوة',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'عجم (Major)',
    moodTagAr: 'بهجة هادئة وامتنان للحياة',
    therapeuticBenefitAr: 'تحفيز إفراز هرمون الدوبامين وتعزيز التفاؤل والامتنان لتفاصيل اليوم البسيطة.',
    tempoBpm: 84,
    durationApproxMin: 4,
    icon: '✨',
    themeColor: 'from-yellow-500/30 to-amber-900/40',
    sequence: {
      melody: [
        { note: 'G', dur: 0.75, octave: 0 },
        { note: 'A', dur: 0.25, octave: 0 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'D', dur: 1, octave: 1 },
        { note: 'C', dur: 1, octave: 1 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'A', dur: 2, octave: 0 },
        { note: 'F#', dur: 0.75, octave: 0 },
        { note: 'G', dur: 0.25, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'C', dur: 1, octave: 1 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'G', dur: 2, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'C', dur: 1.5, octave: 1 },
        { note: 'B', dur: 0.5, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'D', dur: 2, octave: 1 },
        { note: 'G', dur: 3, octave: 0 }
      ],
      chords: [
        { root: 'G', type: 'maj', dur: 4, octave: -1 },
        { root: 'D', type: 'maj', dur: 4, octave: -1 },
        { root: 'E', type: 'min', dur: 4, octave: -1 },
        { root: 'C', type: 'maj', dur: 2, octave: -1 },
        { root: 'D', type: 'maj', dur: 2, octave: -1 },
        { root: 'G', type: 'maj', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'G', dur: 4, octave: -2 },
        { note: 'D', dur: 4, octave: -2 },
        { note: 'E', dur: 4, octave: -2 },
        { note: 'C', dur: 2, octave: -2 },
        { note: 'D', dur: 2, octave: -2 },
        { note: 'G', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'khally-balak-men-aqlak',
    titleAr: 'خلي بالك من عقلك',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'نهاوند رقيق',
    moodTagAr: 'تصفية الذهن والتأمل الفكري',
    therapeuticBenefitAr: 'تخفيف الضجيج الفكري والوساوس وإعادة الهدوء لمركز التركيز في الفص الجبهي.',
    tempoBpm: 72,
    durationApproxMin: 6,
    icon: '🧠',
    themeColor: 'from-teal-600/30 to-indigo-950/40',
    sequence: {
      melody: [
        { note: 'E', dur: 1, octave: 0 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'F#', dur: 1.5, octave: 0 },
        { note: 'G', dur: 0.5, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'F#', dur: 1, octave: 0 },
        { note: 'G', dur: 1.5, octave: 0 },
        { note: 'F#', dur: 0.5, octave: 0 },
        { note: 'E', dur: 2, octave: 0 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'D', dur: 1, octave: 1 },
        { note: 'C', dur: 1, octave: 1 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'A', dur: 2, octave: 0 },
        { note: 'F#', dur: 1, octave: 0 },
        { note: 'D#', dur: 1, octave: 0 },
        { note: 'E', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'E', type: 'min', dur: 4, octave: -1 },
        { root: 'B', type: 'min', dur: 4, octave: -1 },
        { root: 'C', type: 'maj', dur: 4, octave: -1 },
        { root: 'A', type: 'min', dur: 4, octave: -1 },
        { root: 'B', type: 'maj', dur: 2, octave: -1 },
        { root: 'E', type: 'min', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'E', dur: 4, octave: -2 },
        { note: 'B', dur: 4, octave: -2 },
        { note: 'C', dur: 4, octave: -2 },
        { note: 'A', dur: 4, octave: -2 },
        { note: 'B', dur: 2, octave: -2 },
        { note: 'E', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'dameer-abla-hekmat',
    titleAr: 'ضمير أبلة حكمت',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'نهاوند كلاسيكي دافئ',
    moodTagAr: 'احتواء النفس وسلام الوجدان',
    therapeuticBenefitAr: 'تحفيز مسارات الرحمة الذاتية، طمأنة الطفل الداخلي، والتصالح مع الذات.',
    tempoBpm: 68,
    durationApproxMin: 5,
    icon: '🕊️',
    themeColor: 'from-emerald-600/30 to-stone-900/40',
    sequence: {
      melody: [
        { note: 'C', dur: 1, octave: 0 },
        { note: 'Eb', dur: 1, octave: 0 },
        { note: 'G', dur: 1.5, octave: 0 },
        { note: 'F', dur: 0.5, octave: 0 },
        { note: 'Eb', dur: 1, octave: 0 },
        { note: 'D', dur: 1, octave: 0 },
        { note: 'C', dur: 2, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'C', dur: 1.5, octave: 1 },
        { note: 'Bb', dur: 0.5, octave: 0 },
        { note: 'Ab', dur: 1, octave: 0 },
        { note: 'G', dur: 2, octave: 0 },
        { note: 'Eb', dur: 1, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'G', dur: 1.5, octave: 0 },
        { note: 'F', dur: 0.5, octave: 0 },
        { note: 'Eb', dur: 1, octave: 0 },
        { note: 'D', dur: 1, octave: 0 },
        { note: 'C', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'C', type: 'min', dur: 4, octave: -1 },
        { root: 'G', type: 'min', dur: 4, octave: -1 },
        { root: 'Ab', type: 'maj', dur: 4, octave: -1 },
        { root: 'F', type: 'min', dur: 4, octave: -1 },
        { root: 'G', type: 'maj', dur: 2, octave: -1 },
        { root: 'C', type: 'min', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'C', dur: 4, octave: -2 },
        { note: 'G', dur: 4, octave: -2 },
        { note: 'Ab', dur: 4, octave: -2 },
        { note: 'F', dur: 4, octave: -2 },
        { note: 'G', dur: 2, octave: -2 },
        { note: 'C', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'liqaa-fel-ghoroub',
    titleAr: 'لقاء في الغروب',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'نهاوند شاعري هادئ',
    moodTagAr: 'استرخاء المساء والتهيئة للنوم',
    therapeuticBenefitAr: 'خفض مستويات الكورتيزول المسائية، إبطاء التنفس، ومساعدة الجسم على الاستغراق في النوم.',
    tempoBpm: 60,
    durationApproxMin: 7,
    icon: '🌅',
    themeColor: 'from-orange-600/30 to-purple-950/40',
    sequence: {
      melody: [
        { note: 'A', dur: 1.5, octave: 0 },
        { note: 'C', dur: 0.5, octave: 1 },
        { note: 'E', dur: 2, octave: 1 },
        { note: 'D', dur: 1, octave: 1 },
        { note: 'C', dur: 1, octave: 1 },
        { note: 'B', dur: 2, octave: 0 },
        { note: 'G', dur: 1.5, octave: 0 },
        { note: 'B', dur: 0.5, octave: 0 },
        { note: 'D', dur: 2, octave: 1 },
        { note: 'C', dur: 1, octave: 1 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'A', dur: 4, octave: 0 },
        { note: 'F', dur: 1.5, octave: 0 },
        { note: 'A', dur: 0.5, octave: 0 },
        { note: 'C', dur: 2, octave: 1 },
        { note: 'E', dur: 2, octave: 0 },
        { note: 'A', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'A', type: 'min', dur: 4, octave: -1 },
        { root: 'E', type: 'min', dur: 4, octave: -1 },
        { root: 'G', type: 'maj', dur: 4, octave: -1 },
        { root: 'A', type: 'min', dur: 4, octave: -1 },
        { root: 'F', type: 'maj', dur: 4, octave: -1 },
        { root: 'E', type: 'min', dur: 2, octave: -1 },
        { root: 'A', type: 'min', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'A', dur: 4, octave: -2 },
        { note: 'E', dur: 4, octave: -2 },
        { note: 'G', dur: 4, octave: -2 },
        { note: 'A', dur: 4, octave: -2 },
        { note: 'F', dur: 4, octave: -2 },
        { note: 'E', dur: 2, octave: -2 },
        { note: 'A', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'saber-ya-am-saber',
    titleAr: 'صابر يا عم صابر',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'عجم / راست مريح',
    moodTagAr: 'الصبر الجميل والرضا القلبي',
    therapeuticBenefitAr: 'تفريغ مشاعر التوتر والإحباط واستبدالها بنبضات هدوء وتفاؤل عميق.',
    tempoBpm: 78,
    durationApproxMin: 5,
    icon: '🌱',
    themeColor: 'from-lime-600/30 to-emerald-950/40',
    sequence: {
      melody: [
        { note: 'C', dur: 1, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'G', dur: 1.5, octave: 0 },
        { note: 'A', dur: 0.5, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'C', dur: 2, octave: 0 },
        { note: 'D', dur: 1, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'A', dur: 1.5, octave: 0 },
        { note: 'G', dur: 0.5, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'D', dur: 1, octave: 0 },
        { note: 'E', dur: 2, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'C', dur: 2, octave: 1 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'G', dur: 2, octave: 0 },
        { note: 'C', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'C', type: 'maj', dur: 4, octave: -1 },
        { root: 'C', type: 'maj', dur: 4, octave: -1 },
        { root: 'D', type: 'min', dur: 4, octave: -1 },
        { root: 'G', type: 'maj', dur: 4, octave: -1 },
        { root: 'C', type: 'maj', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'C', dur: 4, octave: -2 },
        { note: 'E', dur: 4, octave: -2 },
        { note: 'D', dur: 4, octave: -2 },
        { note: 'G', dur: 4, octave: -2 },
        { note: 'C', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'masalat-mabdaa',
    titleAr: 'مسألة مبدأ',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'نهاوند وقور',
    moodTagAr: 'الثبات والوقار والاتزان الداخلي',
    therapeuticBenefitAr: 'تعزيز صلابة الأنا النفسية والمشاعر المتزنة الواثقة بعيداً عن القلق الاندفاعي.',
    tempoBpm: 70,
    durationApproxMin: 5,
    icon: '⚖️',
    themeColor: 'from-blue-600/30 to-slate-900/40',
    sequence: {
      melody: [
        { note: 'D', dur: 1.5, octave: 0 },
        { note: 'F', dur: 0.5, octave: 0 },
        { note: 'A', dur: 1.5, octave: 0 },
        { note: 'D', dur: 0.5, octave: 1 },
        { note: 'C', dur: 1, octave: 1 },
        { note: 'Bb', dur: 1, octave: 0 },
        { note: 'A', dur: 2, octave: 0 },
        { note: 'G', dur: 1.5, octave: 0 },
        { note: 'Bb', dur: 0.5, octave: 0 },
        { note: 'D', dur: 1, octave: 1 },
        { note: 'C', dur: 1, octave: 1 },
        { note: 'Bb', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'G', dur: 2, octave: 0 },
        { note: 'F', dur: 1, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'D', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'D', type: 'min', dur: 4, octave: -1 },
        { root: 'D', type: 'min', dur: 4, octave: -1 },
        { root: 'G', type: 'min', dur: 4, octave: -1 },
        { root: 'A', type: 'maj', dur: 4, octave: -1 },
        { root: 'D', type: 'min', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'D', dur: 4, octave: -2 },
        { note: 'A', dur: 4, octave: -2 },
        { note: 'G', dur: 4, octave: -2 },
        { note: 'A', dur: 4, octave: -2 },
        { note: 'D', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'fatma-night',
    titleAr: 'ليلة القبض على فاطمة',
    composerAr: 'الموسيقار عمر خيرت',
    maqamAr: 'نهاوند شجي',
    moodTagAr: 'تطهير المشاعر والتفريغ العاطفي',
    therapeuticBenefitAr: 'السماح للدموع والمشاعر المحتبسة بالخروج بأمان وتخفيف الاحتقان النفسي.',
    tempoBpm: 66,
    durationApproxMin: 6,
    icon: '🌙',
    themeColor: 'from-violet-600/30 to-purple-950/40',
    sequence: {
      melody: [
        { note: 'F#', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'C#', dur: 2, octave: 1 },
        { note: 'B', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'G#', dur: 2, octave: 0 },
        { note: 'E', dur: 1, octave: 0 },
        { note: 'G#', dur: 1, octave: 0 },
        { note: 'B', dur: 2, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'G#', dur: 1, octave: 0 },
        { note: 'F#', dur: 4, octave: 0 },
        { note: 'D', dur: 1.5, octave: 0 },
        { note: 'F#', dur: 0.5, octave: 0 },
        { note: 'A', dur: 2, octave: 0 },
        { note: 'C#', dur: 2, octave: 0 },
        { note: 'F#', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'F#', type: 'min', dur: 4, octave: -1 },
        { root: 'C#', type: 'min', dur: 4, octave: -1 },
        { root: 'E', type: 'maj', dur: 4, octave: -1 },
        { root: 'F#', type: 'min', dur: 4, octave: -1 },
        { root: 'D', type: 'maj', dur: 4, octave: -1 },
        { root: 'C#', type: 'maj', dur: 2, octave: -1 },
        { root: 'F#', type: 'min', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'F#', dur: 4, octave: -2 },
        { note: 'C#', dur: 4, octave: -2 },
        { note: 'E', dur: 4, octave: -2 },
        { note: 'F#', dur: 4, octave: -2 },
        { note: 'D', dur: 4, octave: -2 },
        { note: 'C#', dur: 2, octave: -2 },
        { note: 'F#', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'andalusian-ney-oud',
    titleAr: 'سكون العود والناي الشرقي',
    composerAr: 'موسيقى شرقية تأملية مهدئة',
    maqamAr: 'حجاز / بياتي صوفي',
    moodTagAr: 'تأمل روحي وتفريغ التوتر العضلي',
    therapeuticBenefitAr: 'تحفيز العصب الحائر وإرسال إشارات الاسترخاء العميق لكافة عضلات الجسم والفك.',
    tempoBpm: 62,
    durationApproxMin: 7,
    icon: '🪕',
    themeColor: 'from-amber-600/30 to-yellow-950/40',
    sequence: {
      melody: [
        { note: 'D', dur: 1.5, octave: 0 },
        { note: 'Eb', dur: 0.5, octave: 0 },
        { note: 'F#', dur: 1.5, octave: 0 },
        { note: 'G', dur: 0.5, octave: 0 },
        { note: 'A', dur: 2, octave: 0 },
        { note: 'Bb', dur: 1, octave: 0 },
        { note: 'A', dur: 1, octave: 0 },
        { note: 'G', dur: 1, octave: 0 },
        { note: 'F#', dur: 1, octave: 0 },
        { note: 'Eb', dur: 2, octave: 0 },
        { note: 'F#', dur: 1, octave: 0 },
        { note: 'Eb', dur: 1, octave: 0 },
        { note: 'D', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'D', type: 'maj', dur: 4, octave: -1 },
        { root: 'Eb', type: 'maj', dur: 4, octave: -1 },
        { root: 'G', type: 'min', dur: 4, octave: -1 },
        { root: 'D', type: 'maj', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'D', dur: 4, octave: -2 },
        { note: 'Eb', dur: 4, octave: -2 },
        { note: 'G', dur: 4, octave: -2 },
        { note: 'D', dur: 4, octave: -2 }
      ]
    }
  },
  {
    id: 'alpha-piano-serenade',
    titleAr: 'بيانو موجات ألفا (432Hz)',
    composerAr: 'موسيقى سينمائية هادئة مع ترددات طبيعية',
    maqamAr: 'هارموني كلاسيكي نقي',
    moodTagAr: 'صفاء فائق وخفض الصداع والضغط',
    therapeuticBenefitAr: 'تنسيق موجات المخ في نطاق ألفا (8-12Hz) الذي يجمع بين التركيز الهادئ والاسترخاء العميق.',
    tempoBpm: 56,
    durationApproxMin: 8,
    icon: '🌊',
    themeColor: 'from-cyan-600/30 to-blue-950/40',
    sequence: {
      melody: [
        { note: 'C', dur: 2, octave: 0 },
        { note: 'E', dur: 2, octave: 0 },
        { note: 'G', dur: 2, octave: 0 },
        { note: 'B', dur: 2, octave: 0 },
        { note: 'C', dur: 4, octave: 1 },
        { note: 'A', dur: 2, octave: 0 },
        { note: 'F', dur: 2, octave: 0 },
        { note: 'D', dur: 2, octave: 0 },
        { note: 'G', dur: 4, octave: 0 },
        { note: 'C', dur: 4, octave: 0 }
      ],
      chords: [
        { root: 'C', type: 'maj', dur: 4, octave: -1 },
        { root: 'A', type: 'min', dur: 4, octave: -1 },
        { root: 'F', type: 'maj', dur: 4, octave: -1 },
        { root: 'G', type: 'maj', dur: 4, octave: -1 },
        { root: 'C', type: 'maj', dur: 4, octave: -1 }
      ],
      bass: [
        { note: 'C', dur: 4, octave: -2 },
        { note: 'A', dur: 4, octave: -2 },
        { note: 'F', dur: 4, octave: -2 },
        { note: 'G', dur: 4, octave: -2 },
        { note: 'C', dur: 4, octave: -2 }
      ]
    }
  }
];

class KhairatSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private currentTrackIndex: number = 0;
  private volume: number = 0.65;
  private ambientVolume: number = 0.2; // Blend with ocean/nature breeze
  private tempoMultiplier: number = 1.0;
  private activeTimeouts: NodeJS.Timeout[] = [];
  private onNotePlayedCallback?: (note: string, isChord: boolean) => void;
  private onStateChangeCallback?: (isPlaying: boolean, trackIndex: number) => void;

  constructor() {
    // Lazy initialized on interaction
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambient pink-noise / ocean air filter for realistic acoustic depth
      this.setupAmbientLayer();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private setupAmbientLayer() {
    if (!this.ctx || !this.masterGain) return;
    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.15, this.ctx.currentTime);

      // Soft low-frequency pink/ocean rumble
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz subtle sub-drone

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);
      osc.start();
      this.ambientOsc = osc;
    } catch (e) {
      console.warn('Ambient layer init error:', e);
    }
  }

  // Play an acoustic grand piano note with rich harmonics and exponential natural decay
  private playPianoNote(freq: number, durationSec: number, velocity = 0.8) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;

    const now = this.ctx.currentTime;
    const noteGain = this.ctx.createGain();
    noteGain.connect(this.masterGain);

    // Fundamental tone (Triangle wave gives acoustic warmth)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // 2nd Harmonic (Sine wave)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // 3rd Harmonic (Subtle sparkle)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);

    // Hammer strike filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(3500, freq * 4.5), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 1.5), now + durationSec);

    // ADSR Envelope: Fast attack (<0.012s), warm sustain, exponential piano decay
    const peakVol = Math.max(0.01, velocity * 0.35);
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(peakVol, now + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(peakVol * 0.45, now + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 1.25);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(noteGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + durationSec * 1.3);
    osc2.stop(now + durationSec * 1.3);
    osc3.stop(now + durationSec * 1.3);
  }

  // Play orchestral strings section chord pad
  private playStringsPad(rootFreq: number, type: 'min' | 'maj' | 'dim' | 'sus4', durationSec: number) {
    if (!this.ctx || !this.masterGain || rootFreq <= 0) return;

    const now = this.ctx.currentTime;
    const chordGain = this.ctx.createGain();
    chordGain.connect(this.masterGain);

    // Determine chord interval semitones
    const thirdOffset = type === 'min' ? 3 : type === 'sus4' ? 5 : type === 'dim' ? 3 : 4;
    const fifthOffset = type === 'dim' ? 6 : 7;

    const f1 = rootFreq;
    const f2 = rootFreq * Math.pow(2, thirdOffset / 12);
    const f3 = rootFreq * Math.pow(2, fifthOffset / 12);
    const f4 = rootFreq * 2; // Octave

    const freqs = [f1, f2, f3, f4];

    // Warm orchestral filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, now);

    // Slow bowed attack and gentle release
    chordGain.gain.setValueAtTime(0.0001, now);
    chordGain.gain.linearRampToValueAtTime(0.09, now + 0.4);
    chordGain.gain.setValueAtTime(0.08, now + Math.max(0.4, durationSec - 0.3));
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec + 0.3);

    freqs.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      // Subtle detune for lush orchestral chorus
      osc.frequency.setValueAtTime(f, now);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      osc.connect(filter);
      osc.start(now);
      osc.stop(now + durationSec + 0.4);
    });

    filter.connect(chordGain);
  }

  // Play bass note
  private playBassNote(freq: number, durationSec: number) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;
    const now = this.ctx.currentTime;
    const bassGain = this.ctx.createGain();
    bassGain.connect(this.masterGain);

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    bassGain.gain.setValueAtTime(0.0001, now);
    bassGain.gain.linearRampToValueAtTime(0.18, now + 0.03);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 1.1);

    osc.connect(bassGain);
    osc.start(now);
    osc.stop(now + durationSec * 1.15);
  }

  // Play full movement of a track in a continuous loop
  private scheduleTrackMovement(track: KhairatTrack) {
    this.clearScheduledNotes();
    if (!this.isPlaying) return;

    const beatDurationSec = (60 / track.tempoBpm) / this.tempoMultiplier;
    let melodyTimeOffset = 0;

    // 1. Schedule Melody notes
    track.sequence.melody.forEach((item) => {
      const durSec = item.dur * beatDurationSec;
      const tId = setTimeout(() => {
        if (!this.isPlaying) return;
        const freq = getFreq(item.note, item.octave || 0);
        this.playPianoNote(freq, durSec, item.velocity || 0.85);
        if (this.onNotePlayedCallback) {
          this.onNotePlayedCallback(item.note, false);
        }
      }, melodyTimeOffset * 1000);
      this.activeTimeouts.push(tId);
      melodyTimeOffset += durSec;
    });

    // 2. Schedule Strings Chords
    let chordTimeOffset = 0;
    track.sequence.chords.forEach((chord) => {
      const durSec = chord.dur * beatDurationSec;
      const tId = setTimeout(() => {
        if (!this.isPlaying) return;
        const rootFreq = getFreq(chord.root, chord.octave ?? -1);
        this.playStringsPad(rootFreq, chord.type, durSec);
        if (this.onNotePlayedCallback) {
          this.onNotePlayedCallback(chord.root, true);
        }
      }, chordTimeOffset * 1000);
      this.activeTimeouts.push(tId);
      chordTimeOffset += durSec;
    });

    // 3. Schedule Bass
    let bassTimeOffset = 0;
    track.sequence.bass.forEach((bass) => {
      const durSec = bass.dur * beatDurationSec;
      const tId = setTimeout(() => {
        if (!this.isPlaying) return;
        const freq = getFreq(bass.note, bass.octave ?? -2);
        this.playBassNote(freq, durSec);
      }, bassTimeOffset * 1000);
      this.activeTimeouts.push(tId);
      bassTimeOffset += durSec;
    });

    // Loop cycle: loop when the longest sequence completes
    const totalCycleTimeSec = Math.max(melodyTimeOffset, chordTimeOffset, bassTimeOffset);
    const loopTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleTrackMovement(track);
      }
    }, totalCycleTimeSec * 1000);
    this.activeTimeouts.push(loopTimeout);
  }

  private clearScheduledNotes() {
    this.activeTimeouts.forEach(t => clearTimeout(t));
    this.activeTimeouts = [];
  }

  public playTrack(index: number) {
    this.initContext();
    this.currentTrackIndex = Math.max(0, Math.min(KHAIRAT_TRACKS.length - 1, index));
    this.isPlaying = true;

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(true, this.currentTrackIndex);
    }

    const track = KHAIRAT_TRACKS[this.currentTrackIndex];
    this.scheduleTrackMovement(track);
  }

  public play() {
    this.playTrack(this.currentTrackIndex);
  }

  public pause() {
    this.isPlaying = false;
    this.clearScheduledNotes();
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false, this.currentTrackIndex);
    }
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    const nextIndex = (this.currentTrackIndex + 1) % KHAIRAT_TRACKS.length;
    this.playTrack(nextIndex);
  }

  public prevTrack() {
    const prevIndex = (this.currentTrackIndex - 1 + KHAIRAT_TRACKS.length) % KHAIRAT_TRACKS.length;
    this.playTrack(prevIndex);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.15, this.ctx.currentTime);
    }
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  public setTempoMultiplier(speed: number) {
    this.tempoMultiplier = Math.max(0.6, Math.min(1.5, speed));
    if (this.isPlaying) {
      // Re-schedule with new tempo
      this.clearScheduledNotes();
      const track = KHAIRAT_TRACKS[this.currentTrackIndex];
      this.scheduleTrackMovement(track);
    }
  }

  public getTempoMultiplier(): number {
    return this.tempoMultiplier;
  }

  public getCurrentTrack(): KhairatTrack {
    return KHAIRAT_TRACKS[this.currentTrackIndex];
  }

  public getCurrentIndex(): number {
    return this.currentTrackIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setOnNotePlayed(callback?: (note: string, isChord: boolean) => void) {
    this.onNotePlayedCallback = callback;
  }

  public setOnStateChange(callback?: (isPlaying: boolean, trackIndex: number) => void) {
    this.onStateChangeCallback = callback;
  }
}

export const khairatEngine = new KhairatSoundSynthesizer();
