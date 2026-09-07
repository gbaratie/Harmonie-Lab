import { midiToFrequency } from './music'

let audioContext: AudioContext | null = null

function getContext(): AudioContext {
  audioContext ??= new AudioContext()
  return audioContext
}

export async function resumeAudio(): Promise<AudioContext> {
  const context = getContext()
  if (context.state === 'suspended') {
    await context.resume()
  }
  return context
}

export async function playNote(midi: number, duration = 0.55): Promise<void> {
  const context = await resumeAudio()
  const now = context.currentTime
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'triangle'
  oscillator.frequency.value = midiToFrequency(midi)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + duration)
}

export async function playChord(midis: number[], duration = 0.85): Promise<void> {
  await Promise.all(midis.map((midi) => playNote(midi, duration)))
}
