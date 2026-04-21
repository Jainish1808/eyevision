import React from 'react'

export function Cursor() {
  return (
    <>
      <div id="cursor-dot" />
      <div id="cursor-ring" />
      <div className="cursor-crosshair">
        <span className="ch-h" />
        <span className="ch-v" />
      </div>
      <div className="cursor-label" />
    </>
  )
}

export default Cursor
