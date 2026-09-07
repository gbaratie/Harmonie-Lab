import type { PianoKey } from './music'

type PianoMode = 'chord' | 'scale'

type PianoProps = {
  title: string
  mode: PianoMode
  keys: PianoKey[]
  highlightedMidis: number[]
  activeMidis: number[]
  onPress: (midi: number) => void
  caption?: string
}

function keyClassName(
  key: PianoKey,
  mode: PianoMode,
  highlighted: Set<number>,
  endpoints: Set<number>,
  activeMidis: number[],
): string {
  const classes = ['key', key.isBlack ? 'black' : 'white']
  if (highlighted.has(key.midi)) {
    classes.push(mode === 'chord' ? 'in-chord' : 'in-scale')
  }
  if (endpoints.has(key.midi)) {
    classes.push('endpoint')
  }
  if (activeMidis.includes(key.midi)) {
    classes.push('active')
  }
  return classes.join(' ')
}

export function Piano({
  title,
  mode,
  keys,
  highlightedMidis,
  activeMidis,
  onPress,
  caption,
}: PianoProps) {
  const whiteKeys = keys.filter((key) => !key.isBlack)
  const blackKeys = keys.filter((key) => key.isBlack)
  const highlighted = new Set(highlightedMidis)
  const endpoints = new Set(
    highlightedMidis.length > 0
      ? [highlightedMidis[0], highlightedMidis[highlightedMidis.length - 1]]
      : [],
  )
  const dotClass = mode === 'chord' ? 'chord' : 'scale'

  return (
    <div className={`piano-wrap piano-${mode}`}>
      <div className="piano-heading">
        <h3>{title}</h3>
      </div>
      <div className="piano" role="application" aria-label={title}>
        <div className="white-row">
          {whiteKeys.map((key) => (
            <button
              key={key.midi}
              type="button"
              className={keyClassName(
                key,
                mode,
                highlighted,
                endpoints,
                activeMidis,
              )}
              onPointerDown={() => onPress(key.midi)}
            >
              {highlighted.has(key.midi) && (
                <i
                  className={`note-dot ${dotClass}${endpoints.has(key.midi) ? ' endpoint' : ''}`}
                  aria-hidden="true"
                />
              )}
              <span className="key-label">
                <strong>{key.latin}</strong>
                <small>{key.label}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="black-row">
          {whiteKeys.map((white, index) => {
            const next = whiteKeys[index + 1]
            const black = blackKeys.find(
              (candidate) =>
                candidate.midi > white.midi &&
                next !== undefined &&
                candidate.midi < next.midi,
            )
            return (
              <div key={`slot-${white.midi}`} className="black-slot">
                {black ? (
                  <button
                    type="button"
                    className={keyClassName(
                      black,
                      mode,
                      highlighted,
                      endpoints,
                      activeMidis,
                    )}
                    onPointerDown={() => onPress(black.midi)}
                  >
                    {highlighted.has(black.midi) && (
                      <i
                        className={`note-dot ${dotClass}${endpoints.has(black.midi) ? ' endpoint' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                    <span className="key-label">
                      <strong>{black.latin}</strong>
                    </span>
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
      {caption ? <p className="piano-caption">{caption}</p> : null}
    </div>
  )
}
