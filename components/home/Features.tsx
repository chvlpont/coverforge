import { Sparkles } from 'lucide-react'

export default function Features() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Simple, Yet Powerful
            </h2>
            <p className="text-lg text-dark-100 mb-8">
              Coverforge keeps what makes you unique while adapting to each opportunity.
              Perfect for cover letters, proposals, pitches, or any personalized document.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Selective Customization</h3>
                  <p className="text-dark-100">You control what changes. Highlight specific paragraphs or sentences.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Batch Processing</h3>
                  <p className="text-dark-100">Upload 10 opportunities, get 10 custom documents. All at once.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Your Voice, Enhanced</h3>
                  <p className="text-dark-100">AI matches your writing style while emphasizing relevant skills.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-dark-400">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2">master-letter.txt</span>
                </div>
                <div className="space-y-2 text-dark-100 font-mono text-sm">
                  <p>Dear Hiring Manager,</p>
                  <p className="bg-primary-900/30 border-l-2 border-primary-500 pl-3 py-1">
                    I am excited to apply for [POSITION] at [COMPANY]...
                  </p>
                  <p>With 5 years of experience in software development...</p>
                  <p className="bg-primary-900/30 border-l-2 border-primary-500 pl-3 py-1">
                    My expertise in [RELEVANT_SKILLS] makes me...
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-xs text-accent-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Highlighted sections will be AI-customized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
