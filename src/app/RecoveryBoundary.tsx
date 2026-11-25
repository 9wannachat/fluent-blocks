import { Button } from '../components/ui/button'
import { Component, type ReactNode } from 'react'

export class RecoveryBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return <main className="main stack">
      <h1>เปิดแอปไม่สำเร็จ</h1>
      <p>ลองโหลดใหม่ หรือปิดแท็บ Fluent Blocks อื่นก่อน หากเบราว์เซอร์ปิดกั้นพื้นที่จัดเก็บ ให้เปิดสิทธิ์ในเบราว์เซอร์เดิมแล้วลองอีกครั้ง</p>
      <div className="actions"><Button type="button" onClick={() => window.location.reload()}>โหลดใหม่</Button></div>
    </main>
  }
}
