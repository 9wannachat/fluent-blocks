import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Label } from '../../components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { AlertMessage } from '../../components/ui/alert-message'
import { useId, useRef, useState } from 'react'
import { CircleCheck, CircleX, Info } from 'lucide-react'
import type { Exercise as ExerciseData } from '../../domain/content'
import { getAnswerFeedback, matchesAnswer } from '../../domain/feedback'
import { recordAttempt } from '../../storage'
import { Speak } from '../../components/ui'

export function Exercise({ item, objective, onAnswer }: {
  item: ExerciseData
  objective: string
  onAnswer?: (answer: string, correct: boolean) => void
}) {
  const [response, setResponse] = useState('')
  const [ordered, setOrdered] = useState<number[]>([])
  const [result, setResult] = useState<boolean | null>(null)
  const [checkedAnswer, setCheckedAnswer] = useState('')
  const [misses, setMisses] = useState(0)
  const [hint, setHint] = useState(false)
  const [reveal, setReveal] = useState(false)
  const [locked, setLocked] = useState(false)
  const [assessed, setAssessed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [emptyNote, setEmptyNote] = useState(false)
  const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const noteId = useId()
  const open = item.kind === 'speaking' || item.kind === 'conversation' || item.kind === 'expand'
  const ordering = item.kind === 'order' && !!item.options
  const answer = ordering ? ordered.map((index) => item.options?.[index]).join(' ') : response
  const specific = getAnswerFeedback(checkedAnswer, item.feedback)
  const comparable = item.kind === 'translate' || item.kind === 'transform' || item.kind === 'repair'
  const [needsComparison, setNeedsComparison] = useState(false)
  const canAssess = open || needsComparison
  const helpAvailable = misses > 0 || locked
  const invalid = result === false && answer === checkedAnswer

  async function check() {
    const correct = matchesAnswer(answer, item.answers)
    setSaving(true)
    setError('')
    try {
      const unsignedVariant = comparable && !item.options && !getAnswerFeedback(answer, item.feedback) && !correct
      const graded = !open && !unsignedVariant
      if (graded) await recordAttempt({ exerciseId: item.id, objectiveId: objective, outcome: correct ? 'correct' : 'incorrect' })
      setCheckedAnswer(answer)
      setNeedsComparison(unsignedVariant)
      setResult(graded ? correct : null)
      // A wrong graded answer stays editable so the learner can fix it in place.
      if (!graded || correct) setLocked(true)
      else setMisses((count) => count + 1)
      if (graded) onAnswer?.(answer, correct)
    } catch {
      setError('บันทึกคำตอบไม่ได้ ลองอีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  async function assess() {
    setSaving(true)
    try {
      await recordAttempt({ exerciseId: item.id, objectiveId: objective, outcome: 'self-assessed' })
      setAssessed(true)
    } catch {
      setError('บันทึกการประเมินตนเองไม่ได้ ลองอีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  function showAnswer() {
    setReveal(true)
    setLocked(true)
  }

  function reset() {
    setResponse('')
    setOrdered([])
    setResult(null)
    setCheckedAnswer('')
    setMisses(0)
    setHint(false)
    setReveal(false)
    setLocked(false)
    setAssessed(false)
    setNeedsComparison(false)
    setError('')
    setEmptyNote(false)
  }

  function submit() {
    if (saving || locked) return
    if (!answer.trim()) {
      setEmptyNote(true)
      field.current?.focus()
      return
    }
    setEmptyNote(false)
    void check()
  }

  function edit(value: string) {
    setResponse(value)
    if (value.trim()) setEmptyNote(false)
  }

  const fieldProps = {
    ref: field,
    value: response,
    disabled: locked,
    'aria-invalid': invalid || undefined,
    'aria-describedby': emptyNote ? noteId : undefined,
    onChange: (event: { target: { value: string } }) => edit(event.target.value),
  }
  const revealLabel = canAssess ? 'ดูตัวอย่างและประเมินตนเอง' : result === true ? 'ดูคำอธิบาย' : 'ดูเฉลย'
  const wrongMessage = specific ?? (misses > 1
    ? 'เปิดคำใบ้ หรือดูเฉลยพร้อมคำอธิบายได้เลย'
    : 'แก้คำตอบแล้วตรวจอีกครั้ง หรือเปิดคำใบ้ก่อน')

  return <form className="exercise stack" onSubmit={(event) => { event.preventDefault(); submit() }}>
    <p><strong>{item.prompt}</strong></p>
    {ordering ? <div className="stack">
      <div className="inline wrap" aria-label="ลำดับคำที่เลือก">
        {ordered.map((index) => <Button type="button" variant="outline" key={index} disabled={locked} onClick={() => { setOrdered(ordered.filter((item) => item !== index)) }}>{item.options?.[index]} ×</Button>)}
      </div>
      <div className="inline wrap">{item.options?.map((option, index) => <Button type="button" variant="outline" key={index} disabled={locked || ordered.includes(index)} onClick={() => { setOrdered([...ordered, index]); setEmptyNote(false) }}>{option}</Button>)}</div>
    </div> : item.options ? <RadioGroup disabled={locked} className="choices" aria-label="ตัวเลือกคำตอบ" aria-invalid={invalid || undefined} name={item.id} value={response} onValueChange={edit}>
      {item.options.map((option) => <Label className="choice" key={option}><RadioGroupItem value={option} /><span>{option}</span></Label>)}
    </RadioGroup> : open
      ? <Label>คำตอบของคุณ<Textarea rows={3} {...fieldProps} /></Label>
      : <Label>คำตอบของคุณ<Input className="answer-input" type="text" lang="en" enterKeyHint="done" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} {...fieldProps} /></Label>}
    {emptyNote && <p className="field-note" id={noteId} role="status">{item.options ? 'เลือกคำตอบก่อนตรวจ' : 'พิมพ์คำตอบก่อนตรวจ'}</p>}
    <div className="actions">
      {locked
        ? <Button type="button" variant="outline" onClick={reset} disabled={saving}>ลองใหม่</Button>
        : <Button type="submit" disabled={saving}>{open ? 'ส่งคำตอบของฉัน' : misses ? 'ตรวจอีกครั้ง' : 'ตรวจคำตอบ'}</Button>}
      {helpAvailable && item.hint && <Button type="button" variant="outline" onClick={() => setHint(!hint)} aria-expanded={hint}>คำใบ้</Button>}
      {helpAvailable && !reveal && <Button type="button" variant="outline" onClick={showAnswer}>{revealLabel}</Button>}
    </div>
    {result !== null && <Alert role="status" className={`feedback result ${result ? 'good' : 'bad'}`}>
      {result ? <CircleCheck aria-hidden="true" /> : <CircleX aria-hidden="true" />}
      <AlertTitle>{result ? 'ถูกต้อง' : misses > 1 ? `ยังไม่ถูก (ครั้งที่ ${misses})` : 'ยังไม่ถูก'}</AlertTitle>
      {!result && <AlertDescription>{wrongMessage}</AlertDescription>}
    </Alert>}
    {needsComparison && <Alert role="status" className="feedback result compare">
      <Info aria-hidden="true" />
      <AlertTitle>ต่างจากคำตอบตัวอย่าง</AlertTitle>
      <AlertDescription>ลองเทียบกับเจตนาและโครงสร้างที่ฝึก แล้วประเมินความเหมาะสมด้วยตัวเอง</AlertDescription>
    </Alert>}
    {hint && <p className="feedback">{item.hint}</p>}
    {reveal && <div className="stack feedback">
      {item.answers.map((variant) => <div className="inline" key={variant}><strong lang="en">{variant}</strong><Speak text={variant} /></div>)}
      <p>{item.explanation}</p>
      {canAssess && <><p>เช็กด้วยตัวเองว่าใจความชัด กริยาช่วยเหมาะกับเจตนา เรียงคำได้ และเชื่อมความคิดลื่นไหล</p><Button type="button" disabled={assessed || saving} onClick={() => void assess()}>{assessed ? 'ประเมินตนเองแล้ว' : 'บันทึกว่าประเมินตนเองแล้ว'}</Button></>}
    </div>}
    {error && <AlertMessage>{error}</AlertMessage>}
  </form>
}
