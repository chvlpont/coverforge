export default function Loader() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo/Icon */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-20 h-20 border-4 border-primary-900/30 border-t-primary-500 rounded-full animate-spin"></div>

          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl font-bold text-white">Coverforge</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}
