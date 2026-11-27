export const subjects = ['I', 'you', 'he', 'she', 'it', 'we', 'they'] as const
export type Subject = (typeof subjects)[number]

const thaiSubjects: Record<Subject, string> = {
  I: 'ฉัน', you: 'คุณ', he: 'เขา', she: 'เธอ', it: 'มัน', we: 'เรา', they: 'พวกเขา',
}

export const intentions = {
  state: 'สภาพหรือความรู้สึกตอนนี้',
  pastState: 'สภาพหรือความรู้สึกในอดีต',
  habit: 'นิสัยหรือความชอบ',
  now: 'กำลังทำอยู่',
  past: 'เหตุการณ์ที่จบไปแล้ว',
  pastOngoing: 'กำลังทำอยู่ ณ จุดหนึ่งในอดีต',
  relevant: 'สิ่งที่ทำแล้วและเกี่ยวข้องกับตอนนี้',
  duration: 'ทำต่อเนื่องมาถึงตอนนี้',
  earlierPast: 'เหตุการณ์ก่อนอีกจุดหนึ่งในอดีต',
  future: 'คาดการณ์หรือบอกสิ่งที่จะทำ',
  plan: 'ตั้งใจไว้แล้ว',
  can: 'ความสามารถ',
  could: 'ความเป็นไปได้หรือข้อเสนอ',
  should: 'คำแนะนำ',
  must: 'ความจำเป็น',
  might: 'ความเป็นไปได้ที่ยังไม่แน่ใจ',
  would: 'สิ่งที่จะทำในสถานการณ์สมมติ',
} as const
export type Intention = keyof typeof intentions

type Frame = {
  forms: readonly [base: string, third: string, past: string, participle: string, ongoing: string]
  th: string
  object?: { en: string; th: string; question: 'what' | 'who' }
  stative?: boolean
}

const like = ['like', 'likes', 'liked', 'liked', 'liking'] as const

export const verbFrames = {
  likeCoffee: { forms: like, th: 'ชอบ', stative: true, object: { en: 'coffee', th: 'กาแฟ', question: 'what' } },
  likeYou: { forms: like, th: 'ชอบ', stative: true, object: { en: 'you', th: 'คุณ', question: 'who' } },
  eat: { forms: ['eat', 'eats', 'ate', 'eaten', 'eating'], th: 'กิน' },
  eatBreakfast: { forms: ['eat', 'eats', 'ate', 'eaten', 'eating'], th: 'กิน', object: { en: 'breakfast', th: 'อาหารเช้า', question: 'what' } },
  work: { forms: ['work', 'works', 'worked', 'worked', 'working'], th: 'ทำงาน' },
  make: { forms: ['make', 'makes', 'made', 'made', 'making'], th: 'ชง', object: { en: 'coffee', th: 'กาแฟ', question: 'what' } },
  pourWater: { forms: ['pour', 'pours', 'poured', 'poured', 'pouring'], th: 'ริน', object: { en: 'water', th: 'น้ำ', question: 'what' } },
  wearGlasses: { forms: ['wear', 'wears', 'wore', 'worn', 'wearing'], th: 'ใส่', object: { en: 'glasses', th: 'แว่น', question: 'what' } },
  containPeanuts: { forms: ['contain', 'contains', 'contained', 'contained', 'containing'], th: 'มี', stative: true, object: { en: 'peanuts', th: 'ถั่วลิสง', question: 'what' } },
  go: { forms: ['go', 'goes', 'went', 'gone', 'going'], th: 'ไป' },
  write: { forms: ['write', 'writes', 'wrote', 'written', 'writing'], th: 'เขียน', object: { en: 'a report', th: 'รายงาน', question: 'what' } },
  see: { forms: ['see', 'sees', 'saw', 'seen', 'seeing'], th: 'เจอ', object: { en: 'Maya', th: 'มายา', question: 'who' } },
  notice: { forms: ['notice', 'notices', 'noticed', 'noticed', 'noticing'], th: 'สังเกตเห็น', object: { en: 'the change', th: 'ความเปลี่ยนแปลง', question: 'what' } },
  watch: { forms: ['watch', 'watches', 'watched', 'watched', 'watching'], th: 'ดู', object: { en: 'the show', th: 'รายการ', question: 'what' } },
  haveTime: { forms: ['have', 'has', 'had', 'had', 'having'], th: 'มี', stative: true, object: { en: 'time', th: 'เวลา', question: 'what' } },
} satisfies Record<string, Frame>

export const complements = {
  tired: { en: 'tired', th: 'เหนื่อย', degree: true },
  hungry: { en: 'hungry', th: 'หิว', degree: true },
  ready: { en: 'ready', th: 'พร้อม', degree: true },
  atHome: { en: 'at home', th: 'อยู่บ้าน', degree: false },
} as const

export const sentenceKinds = {
  affirmative: 'บอกเล่า',
  negative: 'ปฏิเสธ',
  yesNo: 'คำถาม Yes/No',
  whSubject: 'คำถาม WH ถามประธาน',
  whObject: 'คำถาม WH ถามกรรม',
} as const
type SentenceKind = keyof typeof sentenceKinds

const modifiers = {
  none: { en: '', th: '' },
  usually: { en: 'usually', th: 'มักจะ' },
  kindOf: { en: 'kind of', th: 'ค่อนข้าง' },
  rightNow: { en: 'right now', th: 'ตอนนี้' },
  yesterday: { en: 'yesterday', th: 'เมื่อวาน' },
  atNine: { en: 'at nine', th: 'ตอนเก้าโมง' },
  yet: { en: 'yet', th: 'ยัง' },
  forHours: { en: 'for hours', th: 'มาหลายชั่วโมง' },
  beforeTheCall: { en: 'before the call', th: 'ก่อนคุยโทรศัพท์' },
  tomorrow: { en: 'tomorrow', th: 'พรุ่งนี้' },
  ifWeHadTime: { en: 'if we had time', th: 'ถ้าเรามีเวลา' },
} as const

type Modifier = keyof typeof modifiers
type Verb = keyof typeof verbFrames
type Complement = keyof typeof complements

export type GrammarInput = {
  subject: Subject
  intention: Intention
  predicate: Verb | Complement
  kind: SentenceKind
  modifier: Modifier
  contract: boolean
}

export const defaultGrammarInput: GrammarInput = {
  subject: 'she', intention: 'habit', predicate: 'likeCoffee', kind: 'affirmative',
  modifier: 'none', contract: false,
}

export type Role = 'subject' | 'auxiliary' | 'verb' | 'object' | 'complement' | 'modifier' | 'connector' | 'subject-auxiliary'
export type Token = { text: string; role: Role }
type Realization = { english: string; thai: string; tokens: Token[]; rationale: string[]; shortAnswers?: [string, string] }
export type Sentence = Realization & {
  contrast?: { intention: Intention; english: string; thai: string; noteTh?: string }
}

const role = (text: string, value: Role): Token => ({ text, role: value })
const isThirdPerson = (subject: Subject) => subject === 'he' || subject === 'she' || subject === 'it'
const be = (subject: Subject, past = false) => {
  if (past) return subject === 'I' || isThirdPerson(subject) ? 'was' : 'were'
  if (subject === 'I') return 'am'
  return isThirdPerson(subject) ? 'is' : 'are'
}

const linkingIntentions = new Set<Intention>(['state', 'pastState'])
const progressiveIntentions = new Set<Intention>(['now', 'pastOngoing', 'duration'])

export function predicateOptions(intention: Intention, kind: SentenceKind, subject: Subject) {
  const askingSubject = kind === 'whSubject'
  if (linkingIntentions.has(intention)) {
    return kind === 'whObject' ? [] : Object.entries(complements).map(([value, item]) => ({
      value: value as Complement, label: `${item.en} · ${item.th}`,
    }))
  }
  return Object.entries<Frame>(verbFrames)
    .filter(([, item]) => !progressiveIntentions.has(intention) || !item.stative)
    .filter(([, item]) => kind !== 'whObject' || item.object)
    .filter(([value]) => value !== 'likeYou' || subject !== 'you' || askingSubject || kind === 'whObject')
    .map(([value, item]) => ({
      value: value as Verb, label: `${[item.forms[0], item.object?.en].filter(Boolean).join(' ')} · ${item.th}${item.object?.th ?? ''}`,
    }))
}

export function modifierOptions(input: Omit<GrammarInput, 'modifier' | 'contract'>) {
  const { intention, kind, predicate } = input
  const isState = Object.hasOwn(complements, predicate)
  const available: Modifier[] = ['none']
  if (intention === 'habit' || intention === 'state') available.push('usually')
  if (isState && complements[predicate as Complement].degree) available.push('kindOf')
  if (intention === 'state' || intention === 'now') available.push('rightNow')
  if (intention === 'past' || intention === 'pastState' || intention === 'pastOngoing') available.push('yesterday', 'atNine')
  if ((intention === 'relevant' || intention === 'past') && (kind === 'negative' || kind === 'yesNo')) available.push('yet')
  if (intention === 'duration') available.push('forHours')
  if (intention === 'earlierPast') available.push('beforeTheCall')
  if (intention === 'future' || intention === 'plan') available.push('tomorrow')
  if (intention === 'would') available.push('ifWeHadTime')
  return available.map((value) => ({
    value,
    label: value === 'none' ? 'ไม่เติมคำขยาย'
      : value === 'yet' && intention === 'past' ? 'yet · ยัง (พบใน American English)'
      : `${modifiers[value].en} · ${modifiers[value].th}`,
  }))
}

export function kindOptions(intention: Intention): SentenceKind[] {
  const keys = Object.keys(sentenceKinds) as SentenceKind[]
  return linkingIntentions.has(intention) ? keys.filter((kind) => kind !== 'whObject') : keys
}

const negativeContractions: Record<string, string> = {
  is: "isn't", are: "aren't", was: "wasn't", were: "weren't", have: "haven't", has: "hasn't", had: "hadn't",
  do: "don't", does: "doesn't", did: "didn't", can: "can't", could: "couldn't", will: "won't",
  would: "wouldn't", should: "shouldn't", must: "mustn't",
}

const modalReason = {
  can: 'Can ใช้พูดถึงความสามารถ',
  could: 'Could ใช้เสนอทางเลือกหรือบอกความเป็นไปได้',
  should: 'Should ใช้แนะนำสิ่งที่เห็นว่าควรทำ',
  must: 'Must ใช้บอกว่าจำเป็นต้องทำ ส่วน must not ใช้ห้ามทำ',
  might: 'Might ใช้บอกความเป็นไปได้โดยเผื่อความไม่แน่ใจ',
  would: 'Would ใช้บอกสิ่งที่จะทำหากสถานการณ์เป็นไปตามที่สมมติ',
}

const subjectSuffix: Record<string, string> = {
  am: "'m", is: "'s", are: "'re", has: "'s", have: "'ve", had: "'d", will: "'ll", would: "'d",
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function phrase(tokens: Token[], question: boolean) {
  return capitalize(tokens.map((token) => token.text).join(' ')) + (question ? '?' : '.')
}

function formsFor(input: GrammarInput, effectiveSubject: Subject, frame?: Frame) {
  const { intention, kind } = input
  const third = isThirdPerson(effectiveSubject)
  const nonSubjectQuestion = kind === 'yesNo' || kind === 'whObject'
  const needsAuxiliary = kind === 'negative' || nonSubjectQuestion
  const [base, thirdForm, past, participle, ongoing] = frame?.forms ?? ['', '', '', '', '']

  switch (intention) {
    case 'state': return { auxiliary: [be(effectiveSubject)], main: '', reason: 'ใช้ be เชื่อมประธานกับสภาพหรือสถานที่ แล้วเลือกรูป am/is/are ให้เข้ากับประธาน' }
    case 'pastState': return { auxiliary: [be(effectiveSubject, true)], main: '', reason: 'ใช้ was/were เพื่อบอกสภาพในอดีต โดยเลือกรูปตามประธาน' }
    case 'habit': return needsAuxiliary
      ? { auxiliary: [third ? 'does' : 'do'], main: base, reason: `${third ? 'Does' : 'Do'} ทำหน้าที่เป็นกริยาช่วย กริยาหลักจึงใช้รูปเดิม ${base}` }
      : { auxiliary: [], main: third ? thirdForm : base, reason: third ? `ประธานเอกพจน์บุรุษที่สามใน present simple ใช้รูป ${thirdForm}` : `ใช้ ${base} ใน present simple กับประธานนี้` }
    case 'past': return needsAuxiliary
      ? { auxiliary: ['did'], main: base, reason: `Did บอกเวลาอดีตแล้ว กริยาหลักจึงใช้รูปเดิม ${base}` }
      : { auxiliary: [], main: past, reason: `เมื่อกริยาหลักบอกอดีตเอง ให้ใช้ V2 คือ ${past}` }
    case 'now': return { auxiliary: [be(effectiveSubject)], main: ongoing, reason: 'ใช้ be + V-ing แสดงเหตุการณ์ที่กำลังดำเนินอยู่' }
    case 'pastOngoing': return { auxiliary: [be(effectiveSubject, true)], main: ongoing, reason: 'ใช้ was/were + V-ing เพื่อให้เห็นว่ากำลังเกิดอะไรขึ้น ณ จุดนั้นในอดีต' }
    case 'relevant': return { auxiliary: [third ? 'has' : 'have'], main: participle, reason: `ใช้ have/has + V3 คือ ${participle} เพื่อเชื่อมเหตุการณ์กับตอนนี้` }
    case 'duration': return { auxiliary: [third ? 'has' : 'have', 'been'], main: ongoing, reason: 'ใช้ have/has + been + V-ing เพื่อเน้นการทำต่อเนื่องมาถึงตอนนี้' }
    case 'earlierPast': return { auxiliary: ['had'], main: participle, reason: `ใช้ had + V3 คือ ${participle} เพื่อมองย้อนหลังจากอีกจุดหนึ่งในอดีต` }
    case 'future': return { auxiliary: ['will'], main: base, reason: 'ใช้ will + V1 เมื่อคาดการณ์หรือตัดสินใจว่าจะทำอะไร' }
    case 'plan': return { auxiliary: [be(effectiveSubject), 'going to'], main: base, reason: 'ใช้ be going to + V1 เพื่อบอกความตั้งใจที่มีอยู่แล้ว' }
    default: return { auxiliary: [intention], main: base, reason: `${modalReason[intention]} ตามด้วย V1 คือ ${base} โดยคงรูปนี้ไว้ทุกประธาน` }
  }
}

function thaiPhrase(input: GrammarInput, frame?: Frame, candidate?: (typeof complements)[Complement]) {
  const { subject, intention, kind, modifier } = input
  const pref = {
    state: '', pastState: '', habit: '', now: 'กำลัง', past: '', pastOngoing: 'กำลัง',
    relevant: '', duration: '', earlierPast: '', future: 'จะ', plan: 'ตั้งใจจะ',
    can: '', could: 'อาจ', should: 'ควร', must: 'ต้อง', might: 'อาจ', would: 'คงจะ',
  }[intention]
  const person = kind === 'whSubject' ? 'ใคร' : thaiSubjects[subject]
  const whoOrWhat = frame?.object?.question === 'who' ? 'ใคร' : 'อะไร'
  const predicate = frame
    ? frame.th + (kind === 'whObject' ? whoOrWhat : frame.object?.th ?? '')
    : candidate?.th ?? ''
  const negative = kind === 'negative'
  const tail = ['rightNow', 'yesterday', 'atNine', 'forHours', 'beforeTheCall', 'tomorrow', 'ifWeHadTime'].includes(modifier)
    ? modifiers[modifier].th : ''
  const degreeOrFrequency = modifier === 'usually' || modifier === 'kindOf' ? modifiers[modifier].th : ''
  const already = intention === 'relevant' || intention === 'earlierPast'
  const duration = intention === 'duration' && modifier !== 'forHours' ? 'มาตลอด' : ''
  const end = kind === 'yesNo' ? (modifier === 'yet' ? 'หรือยัง' : 'ไหม') : ''
  const timeContext = (intention === 'pastState' || intention === 'past' || intention === 'pastOngoing') && !tail && modifier !== 'yet' ? 'ตอนนั้น' : ''
  if (modifier === 'yet' && negative) return person + 'ยังไม่' + predicate
  if (negative && already) return person + 'ยังไม่ได้' + predicate + tail
  const not = negative ? (intention === 'could' || intention === 'might' ? 'จะไม่' : 'ไม่') : ''
  const mustNegation = negative && intention === 'must'
  const shouldNegation = negative && intention === 'should'
  const perfectSuffix = already && modifier !== 'yet' ? 'แล้ว' : ''
  return person + degreeOrFrequency +
    (mustNegation ? 'ห้าม' : shouldNegation ? 'ไม่ควร' : pref + not) + predicate +
    (intention === 'can' ? 'ได้' : '') +
    perfectSuffix + duration + timeContext + tail + end
}

function realize(input: GrammarInput): Realization {
  const { intention, kind, modifier, subject } = input
  const isState = linkingIntentions.has(intention)
  const frame: Frame | undefined = isState ? undefined : verbFrames[input.predicate as Verb]
  const candidate = isState ? complements[input.predicate as Complement] : undefined
  const isQuestion = kind === 'yesNo' || kind === 'whSubject' || kind === 'whObject'
  const inverted = kind === 'yesNo' || kind === 'whObject'
  const isNegative = kind === 'negative'
  const effectiveSubject = kind === 'whSubject' ? 'she' : subject
  const subjectText = kind === 'whSubject' ? 'who' : subject
  const { auxiliary, main, reason } = formsFor(input, effectiveSubject, frame)
  const [finite, ...rest] = auxiliary
  const tokens: Token[] = []
  if (kind === 'whObject' && frame?.object) tokens.push(role(frame.object.question, 'object'))
  const negContracted = isNegative && input.contract && Boolean(negativeContractions[finite])
  const subjectContracted = input.contract && !isQuestion && Boolean(subjectSuffix[finite]) && !negContracted
  if (inverted) tokens.push(role(finite, 'auxiliary'))
  tokens.push(subjectContracted
    ? role(subjectText + subjectSuffix[finite], 'subject-auxiliary')
    : role(subjectText, 'subject'))
  if (finite && !inverted && !subjectContracted) {
    tokens.push(role(negContracted ? negativeContractions[finite] : finite, 'auxiliary'))
  }
  if (isNegative && !negContracted) {
    if (finite === 'can') tokens[tokens.length - 1] = role('cannot', 'auxiliary')
    else tokens.push(role('not', 'modifier'))
  }

  const inMiddle = modifier === 'usually' || modifier === 'kindOf'
  if (inMiddle) tokens.push(role(modifiers[modifier].en, 'modifier'))
  tokens.push(...rest.map((item) => role(item, 'auxiliary')))
  if (main) tokens.push(role(main, 'verb'))
  if (candidate) tokens.push(role(candidate.en, 'complement'))
  if (frame?.object && kind !== 'whObject') tokens.push(role(frame.object.en, 'object'))
  if (modifier === 'ifWeHadTime') {
    tokens.push(role('if', 'connector'), role('we had time', 'modifier'))
  } else if (modifier !== 'none' && !inMiddle) {
    tokens.push(role(modifiers[modifier].en, 'modifier'))
  }

  const rationale = [`เจตนาคือ ${intentions[intention]}`, reason]
  if (inverted) rationale.push(`ในคำถามนี้ให้ย้าย ${finite} ซึ่งเป็นกริยาช่วยตัวแรกมาไว้หน้าประธาน`)
  if (kind === 'whSubject') rationale.push('Who เป็นประธานของคำถาม จึงเรียงแบบประธานตามด้วยกริยา และใช้รูปเอกพจน์ตามปกติ')
  if (kind === 'whObject') rationale.push('คำถามนี้ถามถึงกรรม ย้าย who/what ไปต้นประโยค และยังคงประธานเดิมไว้')
  if (isNegative) rationale.push('เติม not ที่กริยาช่วยตัวแรก รูปย่อรวม not กับกริยาช่วยได้ในหลายกรณี')
  if (modifier === 'usually') rationale.push('Usually มักอยู่หน้ากริยาหลัก หรือหลัง be ที่เป็นกริยาเชื่อม')
  if (modifier === 'kindOf') rationale.push('Kind of อยู่หน้าคำบอกสภาพเพื่อลดน้ำหนัก เป็นรูปที่พบในบทสนทนาแบบกันเอง')
  if (modifier === 'yet') rationale.push('Yet อยู่ท้ายประโยคในตัวอย่างนี้ สื่อถึงสิ่งที่คาดว่าจะเกิดขึ้น')
  if (intention === 'past' && modifier === 'yet') rationale.push('Past simple กับ yet พบได้ในบทสนทนาแบบ American English')
  if (modifier !== 'none' && !inMiddle && modifier !== 'yet') rationale.push('วลีท้ายประโยคเพิ่มกรอบเวลา ระยะเวลา หรือเงื่อนไข')
  if (subjectContracted || negContracted) rationale.push('รูปย่อเปลี่ยนวิธีเขียนและจังหวะพูด โดยยังคงหน้าที่ของคำเดิม')

  const answerSubject = subject === 'I' ? 'you' : subject === 'you' ? 'I' : subject
  const answerAux = finite === 'am' || finite === 'are' || finite === 'is' ? be(answerSubject) :
    finite === 'was' || finite === 'were' ? be(answerSubject, true) : finite
  const noAux = answerAux === 'must'
    ? `${isThirdPerson(answerSubject) ? 'does' : 'do'} not have to`
    : answerAux === 'can' ? 'cannot' : `${answerAux} not`
  const shortAnswers: Realization['shortAnswers'] = kind === 'yesNo'
    ? [`Yes, ${answerSubject} ${answerAux}.`, `No, ${answerSubject} ${noAux}.`]
    : undefined
  return {
    english: phrase(tokens, isQuestion),
    thai: thaiPhrase(input, frame, candidate),
    tokens: tokens.map((token, index) => index === 0 ? { ...token, text: capitalize(token.text) } : token),
    rationale,
    ...(shortAnswers ? { shortAnswers } : {}),
  }
}

const contrasts: Record<Intention, Intention> = {
  state: 'pastState', pastState: 'state', habit: 'past', now: 'habit',
  past: 'relevant', pastOngoing: 'past', relevant: 'past', duration: 'relevant',
  earlierPast: 'relevant', future: 'plan', plan: 'future', can: 'could', could: 'can',
  should: 'must', must: 'should', might: 'future', would: 'future',
}

export function buildSentence(input: GrammarInput): Sentence {
  if (!subjects.includes(input.subject) || !Object.hasOwn(intentions, input.intention) ||
      !Object.hasOwn(sentenceKinds, input.kind) || typeof input.contract !== 'boolean') {
    throw new RangeError('Unsupported subject, intention, sentence kind, or contraction setting')
  }
  if (!predicateOptions(input.intention, input.kind, input.subject).some(({ value }) => value === input.predicate)) {
    throw new RangeError('Predicate does not match the intention or question')
  }
  if (!modifierOptions(input).some(({ value }) => value === input.modifier)) {
    throw new RangeError('Modifier does not match the sentence')
  }
  const result = realize(input)
  const intention = contrasts[input.intention]
  if (!predicateOptions(intention, input.kind, input.subject).some(({ value }) => value === input.predicate)) return result
  const alternate = { ...input, intention }
  if (!modifierOptions(alternate).some(({ value }) => value === input.modifier)) alternate.modifier = 'none'
  const { english, thai } = realize(alternate)
  const noteTh = alternate.modifier === 'yet' && (input.intention === 'past' || intention === 'past')
    ? 'ทั้งสองแบบสื่อความหมายว่าเสร็จแล้วหรือยัง รูป past simple พบได้ในบทสนทนาแบบ American English ส่วน present perfect เน้นความเกี่ยวข้องกับตอนนี้'
    : undefined
  return { ...result, contrast: { intention, english, thai, noteTh } }
}

