import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from './button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'

export function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return <Collapsible className="disclosure">
    <CollapsibleTrigger asChild><Button type="button" variant="ghost">{title}<ChevronDown aria-hidden="true" /></Button></CollapsibleTrigger>
    <CollapsibleContent className="disclosure-content">{children}</CollapsibleContent>
  </Collapsible>
}
