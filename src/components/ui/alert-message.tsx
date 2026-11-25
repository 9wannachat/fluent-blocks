import type { ReactNode } from 'react'
import { Alert, AlertDescription } from './alert'

export function AlertMessage({ children, status = false, className = "" }: { children: ReactNode; status?: boolean; className?: string }) {
  return <Alert role={status ? 'status' : 'alert'} className={`feedback ${className}`}><AlertDescription>{children}</AlertDescription></Alert>
}
