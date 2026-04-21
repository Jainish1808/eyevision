import React from 'react'

export const CursorDot = () => (
  <div
    id="cursor-dot"
    className="fixed w-1.5 h-1.5 bg-accent-primary rounded-full pointer-events-none z-99999 will-change-transform"
    style={{ top: 0, left: 0 }}
  />
)

export const CursorRing = () => (
  <div
    id="cursor-ring"
    className="fixed w-9 h-9 border-1.5 border-opacity-35 border-accent-primary rounded-full pointer-events-none z-99998 will-change-transform"
    style={{ top: 0, left: 0, borderColor: 'rgba(26,26,26,0.35)' }}
  />
)

export const CursorLabel = () => (
  <div
    className="cursor-label fixed text-xs font-bold text-accent-primary pointer-events-none z-99997 opacity-0"
    style={{
      top: 0,
      left: 0,
      transform: 'translate(-50%, -50%)'
    }}
  />
)

export const Cursor = () => {
  const hideNativeCursor = () => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = '@media (pointer: fine) { * { cursor: none !important; } }'
      document.head.appendChild(style)
    }
  }

  React.useEffect(() => {
    hideNativeCursor()
  }, [])

  return (
    <>
      <CursorDot />
      <CursorRing />
      <CursorLabel />
    </>
  )
}
