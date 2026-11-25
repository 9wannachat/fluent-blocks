import { describe, expect, it } from 'vitest'
import {
  buildSentence, defaultGrammarInput, intentions, kindOptions, modifierOptions, predicateOptions, subjects,
  type GrammarInput, type Intention,
} from './grammar'

function build(change: Partial<GrammarInput>) {
  return buildSentence({ ...defaultGrammarInput, ...change })
}

describe('sentence builder', () => {
  it('uses does to carry present agreement', () => {
    expect(build({}).english).toBe('She likes coffee.')
    expect(build({ predicate: 'likeYou', kind: 'yesNo' })).toMatchObject({
      english: 'Does she like you?',
      thai: 'เธอชอบคุณไหม',
      shortAnswers: ['Yes, she does.', 'No, she does not.'],
      tokens: [
        { text: 'Does', role: 'auxiliary' }, { text: 'she', role: 'subject' },
        { text: 'like', role: 'verb' }, { text: 'you', role: 'object' },
      ],
    })
    expect(build({ kind: 'negative', contract: true }).english).toBe("She doesn't like coffee.")
  })

  it('distinguishes linking be, progressive be, and past forms of be', () => {
    expect(build({ subject: 'I', intention: 'state', predicate: 'tired', kind: 'yesNo' }).english).toBe('Am I tired?')
    expect(build({ subject: 'I', intention: 'state', predicate: 'tired', kind: 'negative', contract: true }).english).toBe("I'm not tired.")
    expect(build({ subject: 'they', intention: 'pastState', predicate: 'ready', kind: 'negative' }).english).toBe('They were not ready.')
    expect(build({ subject: 'you', intention: 'now', predicate: 'eat', kind: 'yesNo' }).english).toBe('Are you eating?')
    expect(build({ subject: 'he', intention: 'pastOngoing', predicate: 'eat', kind: 'yesNo', modifier: 'atNine' }).english).toBe('Was he eating at nine?')
  })

  it('models different constructions for subject and object questions', () => {
    expect(build({ kind: 'whSubject', subject: 'we' }).english).toBe('Who likes coffee?')
    expect(build({ kind: 'whObject', subject: 'you', predicate: 'likeYou' }).english).toBe('Who do you like?')
    expect(build({ kind: 'whObject', intention: 'past', predicate: 'write' }).english).toBe('What did she write?')
  })

  it('uses V2 for past and V3 for perfect', () => {
    const perfect = build({ subject: 'you', intention: 'relevant', predicate: 'eat', kind: 'yesNo', modifier: 'yet' })
    expect(perfect.english).toBe('Have you eaten yet?')
    expect(perfect.thai).toBe('คุณกินหรือยัง')
    expect(perfect.contrast).toMatchObject({
      english: 'Did you eat yet?', thai: 'คุณกินหรือยัง', noteTh: expect.stringContaining('American English'),
    })
    expect(build({ intention: 'past', predicate: 'go' }).english).toBe('She went.')
    expect(build({ intention: 'relevant', predicate: 'write', kind: 'negative', contract: true }).english).toBe("She hasn't written a report.")
    expect(build({ intention: 'earlierPast', predicate: 'see', modifier: 'beforeTheCall' }).english).toBe('She had seen Maya before the call.')
  })

  it('inverts only the first auxiliary in a question', () => {
    expect(build({ intention: 'duration', predicate: 'work', kind: 'yesNo', modifier: 'forHours' }).english).toBe('Has she been working for hours?')
    expect(build({ intention: 'plan', predicate: 'go', kind: 'whSubject', modifier: 'tomorrow' }).english).toBe('Who is going to go tomorrow?')
    expect(build({ intention: 'plan', predicate: 'make', kind: 'whObject' }).english).toBe('What is she going to make?')
  })

  it('keeps the lexical verb in base form after modals', () => {
    expect(build({ intention: 'can', predicate: 'write', kind: 'negative' }).english).toBe('She cannot write a report.')
    expect(build({ intention: 'future', predicate: 'eat', kind: 'negative', contract: true }).english).toBe("She won't eat.")
    expect(build({ intention: 'would', predicate: 'go', kind: 'yesNo', modifier: 'ifWeHadTime' }).english).toBe('Would she go if we had time?')
    expect(build({ intention: 'should', predicate: 'go', kind: 'whSubject' }).english).toBe('Who should go?')
    expect(build({ intention: 'must', predicate: 'go', kind: 'yesNo' }).shortAnswers).toEqual([
      'Yes, she must.', 'No, she does not have to.',
    ])
  })

  it('places frequency, degree, and time modifiers by role', () => {
    expect(build({ modifier: 'usually' }).english).toBe('She usually likes coffee.')
    expect(build({ modifier: 'usually', kind: 'yesNo' }).english).toBe('Does she usually like coffee?')
    expect(build({ intention: 'state', predicate: 'hungry', modifier: 'usually' }).english).toBe('She is usually hungry.')
    expect(build({ intention: 'state', predicate: 'hungry', modifier: 'kindOf' }).english).toBe('She is kind of hungry.')
    expect(build({ intention: 'now', predicate: 'work', modifier: 'rightNow' }).english).toBe('She is working right now.')
  })

  it('rejects unsupported combinations at runtime', () => {
    expect(() => build({ subject: 'me' as GrammarInput['subject'] })).toThrow(RangeError)
    expect(() => build({ intention: 'now', predicate: 'likeCoffee' })).toThrow(RangeError)
    expect(() => build({ intention: 'state', predicate: 'tired', kind: 'whObject' })).toThrow(RangeError)
    expect(() => build({ intention: 'past', modifier: 'yet', kind: 'affirmative' })).toThrow(RangeError)
    expect(() => build({ modifier: 'kindOf' })).toThrow(RangeError)
    expect(() => build({ intention: 'state', predicate: 'atHome', modifier: 'kindOf' })).toThrow(RangeError)
    expect(() => build({ subject: 'you', predicate: 'likeYou' })).toThrow(RangeError)
    expect(() => build({ predicate: '__proto__' as GrammarInput['predicate'] })).toThrow(RangeError)
  })

  it('builds every available selection with complete tokens and appropriate agreement', () => {
    const presentBe = { I: 'am', you: 'are', he: 'is', she: 'is', it: 'is', we: 'are', they: 'are' }
    const pastBe = { I: 'was', you: 'were', he: 'was', she: 'was', it: 'was', we: 'were', they: 'were' }
    const third = new Set(['he', 'she', 'it'])
    for (const subject of subjects) {
      expect(build({ subject, intention: 'state', predicate: 'tired' }).english).toBe(`${subject[0].toUpperCase()}${subject.slice(1)} ${presentBe[subject]} tired.`)
      expect(build({ subject, intention: 'pastState', predicate: 'tired' }).tokens[1].text).toBe(pastBe[subject])
      expect(build({ subject, kind: 'yesNo' }).tokens[0].text).toBe(third.has(subject) ? 'Does' : 'Do')
      expect(build({ subject, intention: 'relevant', predicate: 'eat', kind: 'yesNo' }).tokens[0].text).toBe(third.has(subject) ? 'Has' : 'Have')
      for (const intention of Object.keys(intentions) as Intention[]) {
        for (const kind of kindOptions(intention)) {
          const predicates = predicateOptions(intention, kind, subject)
          expect(predicates.length).toBeGreaterThan(0)
          for (const { value: predicate } of predicates) {
            const options = { subject, intention, kind, predicate }
            for (const { value: modifier } of modifierOptions(options)) {
              for (const contract of [true, false]) {
                const result = buildSentence({ ...options, modifier, contract })
                if (result.tokens.some(({ text }) => !text) || result.english.includes('  ') ||
                    !result.thai || !result.contrast || !result.rationale.length) {
                  throw new Error(`Incomplete result for ${JSON.stringify({ ...options, modifier, contract })}`)
                }
                const punctuation = kind === 'negative' || kind === 'affirmative' ? '.' : '?'
                if (result.english !== result.tokens.map(({ text }) => text).join(' ') + punctuation) {
                  throw new Error(`Inconsistent tokens for "${result.english}"`)
                }
              }
            }
          }
        }
      }
    }
  })
})
