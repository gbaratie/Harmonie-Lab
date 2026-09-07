import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { playChord, playNote, resumeAudio } from './audio'
import { LESSONS, transposedChordLabel, type Lesson } from './catalog'
import {
  COMPUTER_KEYS,
  LATIN_NAMES,
  NOTE_NAMES,
  ROOT_OPTIONS,
  START_MIDI,
  ascendingScaleMidis,
  buildKeys,
  latinName,
  noteNameToPc,
  scaleNotesInOrder,
  transposePcs,
  voicingMidis,
  wrapPc,
  type NoteName,
} from './music'
import { Piano } from './Piano'
import './App.css'

const KEYS = buildKeys()

type View = 'home' | 'studio'

function scaleTitle(lesson: Lesson, tonicPc: number): string {
  return `${latinName(tonicPc)} ${lesson.scaleName}`
}

function App() {
  const [view, setView] = useState<View>('home')
  const [lessonId, setLessonId] = useState(LESSONS[0].id)
  const [tonic, setTonic] = useState<NoteName>('C')
  const [chordIndex, setChordIndex] = useState(0)
  const [chordActiveMidis, setChordActiveMidis] = useState<number[]>([])
  const [scaleActiveMidis, setScaleActiveMidis] = useState<number[]>([])
  const [playingProgression, setPlayingProgression] = useState(false)
  const [playingScale, setPlayingScale] = useState(false)
  const [bpm, setBpm] = useState(72)
  const [barsPerChord, setBarsPerChord] = useState(1)

  const [menuOpen, setMenuOpen] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [routineOpen, setRoutineOpen] = useState(false)

  const lesson = useMemo(
    () => LESSONS.find((item) => item.id === lessonId) ?? LESSONS[0],
    [lessonId],
  )
  const tonicPc = noteNameToPc(tonic)
  const safeChordIndex = Math.min(chordIndex, lesson.chords.length - 1)
  const currentChord = lesson.chords[safeChordIndex]

  const scalePcsList = useMemo(
    () => transposePcs(lesson.scalePcs, tonicPc),
    [lesson, tonicPc],
  )
  const chordPcsList = useMemo(
    () => transposePcs(currentChord.pcs, tonicPc),
    [currentChord, tonicPc],
  )
  const chordVoicing = useMemo(
    () => voicingMidis(chordPcsList, START_MIDI),
    [chordPcsList],
  )
  const scaleRun = useMemo(
    () => ascendingScaleMidis(scalePcsList, tonicPc),
    [scalePcsList, tonicPc],
  )
  const scaleNoteLabels = useMemo(
    () => scaleNotesInOrder(scalePcsList, tonicPc).map((pc) => latinName(pc)),
    [scalePcsList, tonicPc],
  )

  const flashKey = useCallback(
    (
      midi: number,
      setActive: Dispatch<SetStateAction<number[]>>,
      ms = 180,
    ) => {
      setActive((current) =>
        current.includes(midi) ? current : [...current, midi],
      )
      window.setTimeout(() => {
        setActive((current) => current.filter((value) => value !== midi))
      }, ms)
    },
    [],
  )

  const pressChordKey = useCallback(
    async (midi: number) => {
      flashKey(midi, setChordActiveMidis)
      await playNote(midi)
    },
    [flashKey],
  )

  const pressScaleKey = useCallback(
    async (midi: number) => {
      flashKey(midi, setScaleActiveMidis)
      await playNote(midi)
    },
    [flashKey],
  )

  useEffect(() => {
    if (view !== 'studio') {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      const midi = COMPUTER_KEYS[event.key.toLowerCase()]
      if (midi === undefined) {
        return
      }
      event.preventDefault()
      void pressScaleKey(midi)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pressScaleKey, view])

  useEffect(() => {
    if (!playingProgression) {
      return
    }

    let cancelled = false
    let timeoutId = 0

    const run = async () => {
      await resumeAudio()
      if (cancelled) {
        return
      }
      const pcs = transposePcs(lesson.chords[safeChordIndex].pcs, tonicPc)
      const seconds = (60 / bpm) * 4 * barsPerChord
      await playChord(voicingMidis(pcs, START_MIDI), Math.min(seconds * 0.9, 2.4))
      timeoutId = window.setTimeout(() => {
        if (cancelled) {
          return
        }
        setChordIndex((value) => (value + 1) % lesson.chords.length)
      }, seconds * 1000)
    }

    void run()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [playingProgression, safeChordIndex, bpm, barsPerChord, lesson, tonicPc])

  useEffect(() => {
    if (!playingScale) {
      return
    }

    let cancelled = false
    let timeoutId = 0
    let index = 0
    const noteMs = Math.max(220, (60_000 / bpm) * 0.5)

    const step = async () => {
      await resumeAudio()
      if (cancelled || scaleRun.length === 0) {
        return
      }
      const midi = scaleRun[index]
      flashKey(midi, setScaleActiveMidis, noteMs * 0.85)
      await playNote(midi, Math.min(noteMs / 1000, 0.7))
      index = (index + 1) % scaleRun.length
      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          void step()
        }
      }, noteMs)
    }

    void step()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [playingScale, scaleRun, bpm, flashKey])

  const stopPlayback = () => {
    setPlayingProgression(false)
    setPlayingScale(false)
  }

  const openStudio = (id: string) => {
    setLessonId(id)
    setChordIndex(0)
    stopPlayback()
    setTipsOpen(false)
    setHelpOpen(false)
    setRoutineOpen(false)
    setMenuOpen(false)
    setView('studio')
  }

  const goHome = () => {
    stopPlayback()
    setMenuOpen(false)
    setTipsOpen(false)
    setHelpOpen(false)
    setRoutineOpen(false)
    setView('home')
  }

  const selectLesson = (id: string) => {
    setLessonId(id)
    setChordIndex(0)
    stopPlayback()
    setTipsOpen(false)
    setMenuOpen(false)
  }

  const selectTonic = (note: NoteName) => {
    setTonic(note)
    setChordIndex(0)
    stopPlayback()
  }

  const onChordClick = (index: number) => {
    setPlayingProgression(false)
    setChordIndex(index)
    const pcs = transposePcs(lesson.chords[index].pcs, tonicPc)
    void playChord(voicingMidis(pcs, START_MIDI), 1.1)
  }

  const toggleProgression = () => {
    setPlayingScale(false)
    setPlayingProgression((value) => !value)
  }

  const toggleScale = () => {
    setPlayingProgression(false)
    setPlayingScale((value) => !value)
  }

  if (view === 'home') {
    return (
      <div className="app home">
        <section className="home-screen">
          <header className="home-hero">
            <p className="eyebrow">Piano • harmonie • improvisation</p>
            <h1>Harmonie Lab</h1>
            <p className="lede">
              Choisis un style pour entrer dans le studio et improviser.
            </p>
          </header>

          <div className="style-grid" role="list">
            {LESSONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="style-card"
                role="listitem"
                onClick={() => openStudio(item.id)}
              >
                <span className="style-card-label">{item.style}</span>
                <span className="style-card-title">{item.title}</span>
                <span className="style-card-desc">{item.description}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={`app studio ${menuOpen ? 'menu-open' : ''}`}>
      <header className="mobile-topbar">
        <div className="mobile-topbar-inner">
          <button type="button" className="back-btn" onClick={goHome}>
            Accueil
          </button>
          <button
            type="button"
            className={`burger ${menuOpen ? 'open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="style-menu"
            aria-label="Choisir un style"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="burger-lines" aria-hidden="true" />
            <span className="burger-label">{lesson.style}</span>
          </button>
        </div>
        <div
          id="style-menu"
          className={`mobile-style-menu ${menuOpen ? 'open' : ''}`}
          role="tablist"
          aria-label="Styles"
        >
          {LESSONS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === lesson.id}
              className={`tab ${item.id === lesson.id ? 'active' : ''}`}
              onClick={() => selectLesson(item.id)}
            >
              {item.style}
            </button>
          ))}
        </div>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <section className="studio-screen">
        <div className="studio-chrome desktop-only">
          <button type="button" className="back-btn" onClick={goHome}>
            ← Accueil
          </button>
          <nav className="style-nav" aria-label="Styles">
            <div className="style-tabs" role="tablist">
              {LESSONS.map((item) => (
                <button
                  key={`desktop-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={item.id === lesson.id}
                  className={`tab ${item.id === lesson.id ? 'active' : ''}`}
                  onClick={() => selectLesson(item.id)}
                >
                  {item.style}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <section className="lesson-card">
          <div className="lesson-head">
            <div>
              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
            </div>
            <label>
              Tonique
              <select
                value={tonic}
                onChange={(event) =>
                  selectTonic(event.target.value as NoteName)
                }
              >
                {ROOT_OPTIONS.map((note, index) => (
                  <option key={note} value={note}>
                    {note} · {LATIN_NAMES[index]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="lesson-body">
            <div className="progression">
              <p className="panel-title">Progression</p>
              <div className="chord-row">
                {lesson.chords.map((chord, index) => {
                  const label = transposedChordLabel(
                    chord,
                    tonicPc,
                    latinName,
                    (pc) => NOTE_NAMES[wrapPc(pc)],
                  )
                  return (
                    <button
                      key={`${chord.symbol}-${index}`}
                      type="button"
                      className={`chord-btn ${index === safeChordIndex ? 'active' : ''}`}
                      onClick={() => onChordClick(index)}
                    >
                      <strong>{label.symbol}</strong>
                      <span>{label.nameFr}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <aside className="scale-panel">
              <p className="panel-title">Gamme pour improviser</p>
              <p className="scale-name">{scaleTitle(lesson, tonicPc)}</p>
              <p className="scale-notes">{scaleNoteLabels.join(' · ')}</p>

              <button
                type="button"
                className={`tips-toggle ${tipsOpen ? 'open' : ''}`}
                aria-expanded={tipsOpen}
                onClick={() => setTipsOpen((value) => !value)}
              >
                Conseils
                <span aria-hidden="true">{tipsOpen ? '−' : '+'}</span>
              </button>
              {tipsOpen ? (
                <ol className="tips">
                  {lesson.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ol>
              ) : null}
            </aside>
          </div>

          <div className="transport">
            <button
              type="button"
              className="play-chord"
              onClick={toggleProgression}
            >
              {playingProgression ? 'Pause progression' : 'Boucle progression'}
            </button>
            <button
              type="button"
              className="play-chord ghost"
              onClick={toggleScale}
            >
              {playingScale ? 'Pause gamme' : 'Jouer la gamme'}
            </button>
            <label>
              BPM
              <input
                type="range"
                min={50}
                max={140}
                value={bpm}
                onChange={(event) => setBpm(Number(event.target.value))}
              />
              <span>{bpm}</span>
            </label>
            <label>
              Mesures / accord
              <select
                value={barsPerChord}
                onChange={(event) =>
                  setBarsPerChord(Number(event.target.value))
                }
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </label>
          </div>
        </section>

        <p className="scroll-hint desktop-only">
          Fais défiler pour les claviers ↓
        </p>
      </section>

      <section className="studio-pianos" aria-label="Claviers">
        <div className="piano-help">
          <button
            type="button"
            className={`tips-toggle ${helpOpen ? 'open' : ''}`}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((value) => !value)}
          >
            Aide claviers
            <span aria-hidden="true">{helpOpen ? '−' : '+'}</span>
          </button>
          {helpOpen ? (
            <p className="piano-caption inline">
              Deux claviers séparés : accords et gamme. La boucle enchaîne la
              progression ; un clic sur un accord ne joue que celui-là. Tu peux
              aussi faire défiler la gamme note par note.
            </p>
          ) : null}
        </div>

        <Piano
          title="Clavier accords"
          mode="chord"
          keys={KEYS}
          highlightedMidis={chordVoicing}
          activeMidis={chordActiveMidis}
          onPress={(midi) => void pressChordKey(midi)}
        />

        <Piano
          title="Clavier gamme"
          mode="scale"
          keys={KEYS}
          highlightedMidis={scaleRun}
          activeMidis={scaleActiveMidis}
          onPress={(midi) => void pressScaleKey(midi)}
        />

        <footer className="practice">
          <button
            type="button"
            className={`tips-toggle ${routineOpen ? 'open' : ''}`}
            aria-expanded={routineOpen}
            onClick={() => setRoutineOpen((value) => !value)}
          >
            Routine de départ
            <span aria-hidden="true">{routineOpen ? '−' : '+'}</span>
          </button>
          {routineOpen ? (
            <>
              <p>
                5 min main gauche seule → 5 min accords + écoute → 5 min
                d’improvisation main droite. Commence très lentement et laisse
                de l’espace.
              </p>
              <p className="quote">« Moins de notes, plus d’émotions. »</p>
            </>
          ) : null}
        </footer>
      </section>
    </div>
  )
}

export default App
