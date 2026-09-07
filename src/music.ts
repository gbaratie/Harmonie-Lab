export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B'

export type PianoKey = {
  midi: number
  name: NoteName
  octave: number
  pc: number
  isBlack: boolean
  label: string
  latin: string
}

export const NOTE_NAMES: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

export const LATIN_NAMES = [
  'Do',
  'Do♯',
  'Ré',
  'Ré♯',
  'Mi',
  'Fa',
  'Fa♯',
  'Sol',
  'Sol♯',
  'La',
  'La♯',
  'Si',
] as const

const BLACK_NOTES = new Set<NoteName>(['C#', 'D#', 'F#', 'G#', 'A#'])

export const START_MIDI = 48
export const KEY_COUNT = 25

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

export function wrapPc(pc: number): number {
  return ((pc % 12) + 12) % 12
}

export function transposePcs(pcs: number[], semitones: number): number[] {
  return pcs.map((pc) => wrapPc(pc + semitones))
}

export function noteNameToPc(name: NoteName): number {
  return NOTE_NAMES.indexOf(name)
}

export function latinName(pc: number): string {
  return LATIN_NAMES[wrapPc(pc)]
}

export function buildKeys(startMidi = START_MIDI, count = KEY_COUNT): PianoKey[] {
  return Array.from({ length: count }, (_, index) => {
    const midi = startMidi + index
    const pc = wrapPc(midi)
    const name = NOTE_NAMES[pc]
    const octave = Math.floor(midi / 12) - 1
    return {
      midi,
      name,
      octave,
      pc,
      isBlack: BLACK_NOTES.has(name),
      label: `${name}${octave}`,
      latin: LATIN_NAMES[pc],
    }
  })
}

export function pcsToMidis(
  pcs: number[],
  startMidi = START_MIDI,
  count = KEY_COUNT,
): number[] {
  const endMidi = startMidi + count - 1
  const wanted = new Set(pcs.map(wrapPc))
  const midis: number[] = []
  for (let midi = startMidi; midi <= endMidi; midi += 1) {
    if (wanted.has(wrapPc(midi))) {
      midis.push(midi)
    }
  }
  return midis
}

export function voicingMidis(
  pcs: number[],
  startMidi = START_MIDI,
): number[] {
  if (pcs.length === 0) {
    return []
  }
  const ordered: number[] = []
  let cursor = startMidi + wrapPc(pcs[0] - wrapPc(startMidi))
  if (cursor < startMidi) {
    cursor += 12
  }
  ordered.push(cursor)
  for (let index = 1; index < pcs.length; index += 1) {
    const target = wrapPc(pcs[index])
    let next = cursor + 1
    while (wrapPc(next) !== target) {
      next += 1
    }
    ordered.push(next)
    cursor = next
  }
  return ordered
}

/** Scale ascending from the tonic, over a given number of octaves. */
export function ascendingScaleMidis(
  scalePcs: number[],
  scaleRootPc: number,
  startMidi = START_MIDI,
  count = KEY_COUNT,
  octaves = 2,
): number[] {
  const degrees = [...new Set(scalePcs.map(wrapPc))].sort(
    (a, b) => wrapPc(a - scaleRootPc) - wrapPc(b - scaleRootPc),
  )
  if (degrees.length === 0) {
    return []
  }
  const endMidi = startMidi + count - 1
  const root = wrapPc(scaleRootPc)
  let first = startMidi
  while (first <= endMidi && wrapPc(first) !== root) {
    first += 1
  }
  if (first > endMidi) {
    return []
  }

  const midis: number[] = [first]
  let cursor = first
  const stepsNeeded = degrees.length * octaves
  for (let step = 0; step < stepsNeeded; step += 1) {
    const currentDegree = wrapPc(cursor)
    const degreeIndex = degrees.indexOf(currentDegree)
    const nextDegree = degrees[(degreeIndex + 1) % degrees.length]
    let next = cursor + 1
    while (wrapPc(next) !== nextDegree) {
      next += 1
    }
    if (next > endMidi) {
      break
    }
    midis.push(next)
    cursor = next
  }
  return midis
}

/** Scale note names in ascending order from the tonic. */
export function scaleNotesInOrder(
  scalePcs: number[],
  scaleRootPc: number,
): number[] {
  const root = wrapPc(scaleRootPc)
  return [...new Set(scalePcs.map(wrapPc))].sort(
    (a, b) => wrapPc(a - root) - wrapPc(b - root),
  )
}

export const COMPUTER_KEYS: Record<string, number> = {
  a: 60,
  w: 61,
  s: 62,
  e: 63,
  d: 64,
  f: 65,
  t: 66,
  g: 67,
  y: 68,
  h: 69,
  u: 70,
  j: 71,
  k: 72,
}

export const ROOT_OPTIONS: NoteName[] = [...NOTE_NAMES]
