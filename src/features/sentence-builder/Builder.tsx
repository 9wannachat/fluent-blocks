import { NativeSelect, NativeSelectOption } from '../../components/ui/native-select'
import { Label } from '../../components/ui/label'
import { useId, useState } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Checkbox } from '../../components/ui/checkbox'
import { Panel, Speak } from '../../components/ui'
import {
  buildSentence, defaultGrammarInput, intentions, kindOptions, modifierOptions,
  predicateOptions, sentenceKinds, subjects,
  type GrammarInput, type Role,
} from '../../domain/grammar'

const roleLabels: Record<Role, { en: string; th: string }> = {
  subject: { en: 'Subject', th: 'ประธาน' },
  auxiliary: { en: 'Auxiliary', th: 'กริยาช่วย / be' },
  verb: { en: 'Main verb', th: 'กริยาหลัก' },
  object: { en: 'Object', th: 'กรรม' },
  complement: { en: 'Complement', th: 'ส่วนเติมเต็ม' },
  modifier: { en: 'Modifier', th: 'คำขยาย' },
  connector: { en: 'Connector', th: 'คำเชื่อม' },
  'subject-auxiliary': { en: 'Subject + auxiliary', th: 'ประธาน + กริยาช่วย' },
}

type SelectOption<T extends string> = { value: T; label: string }

function BuilderSelect<T extends string>({
  label, value, options, onChange,
}: {
  label: string; value: T; options: SelectOption<T>[]; onChange: (value: T) => void
}) {
  return (
    <Label className="stack builder-field">
      <span>{label}</span>
      <NativeSelect value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => <NativeSelectOption key={option.value} value={option.value}>{option.label}</NativeSelectOption>)}
      </NativeSelect>
    </Label>
  )
}

/** Tappable blocks for short option sets. Arrow keys move between options. */
function BuilderChips<T extends string>({
  label, value, options, onChange,
}: {
  label: string; value: T; options: SelectOption<T>[]; onChange: (value: T) => void
}) {
  const id = useId()
  return (
    <div className="stack builder-field builder-chips-field">
      <span id={id} className="builder-field-label">{label}</span>
      <RadioGroupPrimitive.Root className="builder-chips" aria-labelledby={id} value={value}
        onValueChange={(next) => onChange(next as T)} orientation="horizontal">
        {options.map((option) => {
          const [en, th] = option.label.split(' · ')
          return (
            <RadioGroupPrimitive.Item key={option.value} value={option.value} className="builder-chip" aria-label={option.label}>
              <span lang={th ? 'en' : undefined}>{en}</span>{th && <small>{th}</small>}
            </RadioGroupPrimitive.Item>
          )
        })}
      </RadioGroupPrimitive.Root>
    </div>
  )
}

const intentionOptions = (Object.keys(intentions) as GrammarInput['intention'][]).map((value) => ({
  value, label: intentions[value],
}))
const subjectOptions = subjects.map((value) => ({ value, label: value }))

function reconcile(input: GrammarInput, change: Partial<GrammarInput>): GrammarInput {
  const next = { ...input, ...change }
  const kinds = kindOptions(next.intention)
  if (!kinds.includes(next.kind)) next.kind = 'yesNo'
  const predicates = predicateOptions(next.intention, next.kind, next.subject)
  if (!predicates.some(({ value }) => value === next.predicate)) next.predicate = predicates[0].value
  if (!modifierOptions(next).some(({ value }) => value === next.modifier)) next.modifier = 'none'
  return next
}

export function Builder() {
  const [input, setInput] = useState<GrammarInput>(defaultGrammarInput)
  const update = (change: Partial<GrammarInput>) => setInput((previous) => reconcile(previous, change))
  const result = buildSentence(input)
  const kinds = kindOptions(input.intention).map((value) => ({ value, label: sentenceKinds[value] }))

  return (
    <section className="stack builder">
      <header>
        <p>เริ่มจากสิ่งที่อยากสื่อ แล้วดูว่าเหตุใดจึงเลือกคำและเรียงแบบนี้</p>
      </header>
      <Panel className="builder-preview">
        <div className="inline spread">
          <div aria-live="polite" aria-atomic="true">
            <p className="builder-sentence" lang="en">{result.english}</p>
            <p>{result.thai}</p>
          </div>
          <Speak text={result.english} />
        </div>
      </Panel>
      <Panel className="stack builder-controls" aria-label="ตัวเลือกสร้างประโยค">
        <BuilderSelect label="เจตนา" value={input.intention} options={intentionOptions}
          onChange={(intention) => update({ intention })} />
        <BuilderChips label="ชนิดประโยค" value={input.kind} options={kinds}
          onChange={(kind) => update({ kind })} />
        {input.kind === 'whSubject'
          ? <p>ใช้ <strong lang="en">who</strong> เป็นประธาน เพราะกำลังถามว่าใครเป็นคนทำหรืออยู่ในสภาพนั้น</p>
          : <BuilderChips label="ประธาน" value={input.subject} options={subjectOptions}
              onChange={(subject) => update({ subject })} />}
        <BuilderChips label="กริยาหรือส่วนเติมเต็ม" value={input.predicate}
          options={predicateOptions(input.intention, input.kind, input.subject)}
          onChange={(predicate) => update({ predicate })} />
        <BuilderChips label="คำขยาย" value={input.modifier} options={modifierOptions(input)}
          onChange={(modifier) => update({ modifier })} />
        <Label className="builder-toggle">
          <Checkbox checked={input.contract} onCheckedChange={(checked) => update({ contract: checked === true })} />
          <span>แสดงรูปย่อเมื่อใช้ได้</span>
        </Label>
      </Panel>
      <Panel className="stack" aria-labelledby="builder-sentence">
        <h2 id="builder-sentence">หน้าที่ของคำและเหตุผล</h2>
        <ul className="builder-tokens" aria-label="หน้าที่ของคำ">
          {result.tokens.map((token, index) => (
            <li key={index} className={`builder-token role-${token.role}`}>
              <strong lang="en">{token.text}</strong>
              <small>{roleLabels[token.role].th}</small>
            </li>
          ))}
        </ul>
        <p><strong>สูตร</strong> <span lang="en">{result.tokens.map(({ role }) => roleLabels[role].en).join(' + ')}</span></p>
        <h3>เลือกโครงสร้างอย่างไร</h3>
        <ol>
          {result.rationale.map((line) => <li key={line}>{line}</li>)}
        </ol>
        {result.shortAnswers && (
          <div>
            <h3>ตัวอย่างคำตอบสั้น</h3>
            <p lang="en">{result.shortAnswers.join(' / ')}</p>
          </div>
        )}
      </Panel>
      {result.contrast && (
        <Panel className="stack" aria-labelledby="builder-contrast">
          <h2 id="builder-contrast">ลองเปลี่ยนเจตนา</h2>
          <p>{intentions[result.contrast.intention]}</p>
          <p className="builder-sentence" lang="en">{result.contrast.english}</p>
          <p>{result.contrast.thai}</p>
          {result.contrast.noteTh && <p>{result.contrast.noteTh}</p>}
        </Panel>
      )}
    </section>
  )
}
