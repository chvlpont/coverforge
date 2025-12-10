import React from 'react'

export default function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="px-10 py-4 bg-black text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl border-2 border-white/20 cursor-pointer"
      {...props}
    >
      {children}
    </button>
  )
}