export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-sm border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Coverforge
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-dark-100 hover:text-white font-semibold transition-colors">
              Log In
            </button>
            <button className="px-6 py-2 bg-white hover:bg-gray-100 text-black rounded-lg font-bold transition-all">
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
