import type { NoteName } from './music'

export type ChordShape = {
  symbol: string
  nameFr: string
  /** Pitch classes relative to the selected tonic (0 = tonic). */
  pcs: number[]
}

export type Lesson = {
  id: string
  style: string
  title: string
  description: string
  scaleName: string
  /** Scale degrees relative to the selected tonic (0 = tonic). */
  scalePcs: number[]
  tips: string[]
  chords: ChordShape[]
}

export const LESSONS: Lesson[] = [
  {
    id: 'study-piano',
    style: 'Study piano',
    title: 'Focus calme pour réviser',
    description:
      'Progression lo-fi douce (I–V–vi–IV) : idéale pour travailler des phrases simples sans se presser.',
    scaleName: 'majeur',
    scalePcs: [0, 2, 4, 5, 7, 9, 11],
    tips: [
      'Garde un volume bas et des phrases courtes.',
      'Répète 2–3 notes de l’accord, puis ajoute une note de passage.',
      'Laisse des silences : le study piano respire.',
    ],
    chords: [
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [0, 4, 7, 11] },
      { symbol: '7', nameFr: '7', pcs: [7, 11, 2, 5] },
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [9, 0, 4, 7] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [5, 9, 0, 4] },
    ],
  },
  {
    id: 'sleepy-piano',
    style: 'Sleepy piano',
    title: 'Douceur nocturne',
    description:
      'Couleurs mineures très lentes (i–bVI–bIII–bVII), pour une ambiance sleepy.',
    scaleName: 'mineur naturel',
    scalePcs: [0, 2, 3, 5, 7, 8, 10],
    tips: [
      'Joue encore plus lentement que d’habitude.',
      'La pentatonique mineure suffit souvent.',
      'Fais sonner les 9es et laisse résonner.',
    ],
    chords: [
      { symbol: 'm9', nameFr: 'mineur 9', pcs: [0, 3, 7, 10, 2] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [8, 0, 3, 7] },
      { symbol: 'maj9', nameFr: 'majeur 9', pcs: [3, 7, 10, 2, 5] },
      { symbol: '7sus4', nameFr: '7 sus4', pcs: [10, 3, 5, 8] },
    ],
  },
  {
    id: 'pop-chill',
    style: 'Pop chill',
    title: 'Progression douce et intemporelle',
    description: 'Le point de départ idéal : I–vi–IV–V en majeur, avec des 7es.',
    scaleName: 'majeur',
    scalePcs: [0, 2, 4, 5, 7, 9, 11],
    tips: [
      'Reste dans la gamme majeure au début.',
      'Vise d’abord les notes de l’accord affiché.',
      'Puis utilise les autres notes de la gamme comme notes de passage.',
    ],
    chords: [
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [0, 4, 7, 11] },
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [9, 0, 4, 7] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [5, 9, 0, 4] },
      { symbol: '7', nameFr: '7', pcs: [7, 11, 2, 5] },
    ],
  },
  {
    id: 'jazz-251',
    style: 'Jazz ii–V–I',
    title: 'Ambiance jazzy et élégante',
    description: 'Un ii–V–I classique, parfait pour faire sonner le jazz.',
    scaleName: 'majeur',
    scalePcs: [0, 2, 4, 5, 7, 9, 11],
    tips: [
      'Joue les accords en douceur, avec les 7es.',
      'Sur chaque accord, fais atterrir tes phrases sur ses notes constitutives.',
      'Teste ensuite le mode dorien sur le ii pour une couleur jazz.',
    ],
    chords: [
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [2, 5, 9, 0] },
      { symbol: '7', nameFr: '7', pcs: [7, 11, 2, 5] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [0, 4, 7, 11] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [5, 9, 0, 4] },
    ],
  },
  {
    id: 'minor-cine',
    style: 'Mineur ciné',
    title: 'Couleur mineure et mélancolique',
    description: 'Mineur naturel pour une ambiance introspective et cinématographique.',
    scaleName: 'mineur naturel',
    scalePcs: [0, 2, 3, 5, 7, 8, 10],
    tips: [
      'Joue très doucement et laisse résonner les accords.',
      'La pentatonique mineure est une excellente étape suivante.',
      'Utilise les silences comme faisant partie de la phrase.',
    ],
    chords: [
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [0, 3, 7, 10] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [8, 0, 3, 7] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [3, 7, 10, 2] },
      { symbol: '7', nameFr: '7', pcs: [10, 2, 5, 8] },
    ],
  },
  {
    id: 'blues',
    style: 'Blues',
    title: 'Blues condensé',
    description: 'I–IV–I–V–IV–I : un 12 mesures raccourci, idéal pour la pentatonique.',
    scaleName: 'mixolydien / blues',
    scalePcs: [0, 3, 5, 6, 7, 10],
    tips: [
      'La tierce mineure et la blue note (b5) colorent le I7.',
      'Sur le IV, insiste un peu plus sur la fondamentale de l’accord.',
      'Laisse de l’air : le blues aime les phrases courtes.',
    ],
    chords: [
      { symbol: '7', nameFr: '7', pcs: [0, 4, 7, 10] },
      { symbol: '7', nameFr: '7', pcs: [5, 9, 0, 3] },
      { symbol: '7', nameFr: '7', pcs: [0, 4, 7, 10] },
      { symbol: '7', nameFr: '7', pcs: [7, 11, 2, 5] },
      { symbol: '7', nameFr: '7', pcs: [5, 9, 0, 3] },
      { symbol: '7', nameFr: '7', pcs: [0, 4, 7, 10] },
    ],
  },
  {
    id: 'bossa',
    style: 'Bossa',
    title: 'Bossa ii–V–I',
    description: 'Une cadence douce, avec un V altéré léger et un I maj7 qui respire.',
    scaleName: 'majeur',
    scalePcs: [0, 2, 4, 5, 7, 9, 11],
    tips: [
      'Pense syncopes légères, même si le clic est régulier.',
      'Vise les 3es et 7es pour coller à l’harmonie.',
      'Sur le I, des notes longues suffisent souvent.',
    ],
    chords: [
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [2, 5, 9, 0] },
      { symbol: '7', nameFr: '7', pcs: [7, 11, 2, 5] },
      { symbol: 'maj7', nameFr: 'majeur 7', pcs: [0, 4, 7, 11] },
      { symbol: '7', nameFr: '7', pcs: [9, 1, 4, 7] },
    ],
  },
  {
    id: 'dorian',
    style: 'Modal dorien',
    title: 'Vamp dorien',
    description: 'Un accord mineur 7 qui dure : idéal pour improviser en dorien.',
    scaleName: 'dorien',
    scalePcs: [0, 2, 3, 5, 7, 9, 10],
    tips: [
      'La sixte majeure donne la couleur dorienne.',
      'Répète un petit motif et fais-le voyager sur l’octave.',
      'Alterne notes de l’accord et notes de passage de la gamme.',
    ],
    chords: [
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [0, 3, 7, 10] },
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [0, 3, 7, 10] },
      { symbol: '7sus4', nameFr: '7 sus4', pcs: [5, 10, 0, 3] },
      { symbol: 'm7', nameFr: 'mineur 7', pcs: [0, 3, 7, 10] },
    ],
  },
]

export function transposedChordLabel(
  chord: ChordShape,
  semitones: number,
  latinName: (pc: number) => string,
  englishName: (pc: number) => NoteName,
): { symbol: string; nameFr: string } {
  const root = ((chord.pcs[0] + semitones) % 12 + 12) % 12
  const en = englishName(root)
  const fr = latinName(root)
  return {
    symbol: `${en}${chord.symbol}`,
    nameFr: `${fr} ${chord.nameFr}`,
  }
}
