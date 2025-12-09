export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-10 py-4 bg-black text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl border-2 border-white/20 cursor-pointer">
      {children}
    </button>
  )
}
