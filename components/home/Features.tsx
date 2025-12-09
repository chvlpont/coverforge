import { Sparkles } from 'lucide-react'

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Simple, Yet Powerful
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Coverforge keeps what makes you unique while adapting to each opportunity.
              Perfect for cover letters, proposals, pitches, or any personalized document.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Selective Customization</h3>
                  <p className="text-gray-600">You control what changes. Highlight specific paragraphs or sentences.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Batch Processing</h3>
                  <p className="text-gray-600">Upload 10 opportunities, get 10 custom documents. All at once.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-pink-500 mt-2"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Voice, Enhanced</h3>
                  <p className="text-gray-600">AI matches your writing style while emphasizing relevant skills.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2">project-proposal.txt</span>
                </div>
                <div className="space-y-2 text-gray-700 font-mono text-sm">
                  <p>Dear [CLIENT_NAME],</p>
                  <p className="bg-primary-50 border-l-2 border-primary-500 pl-3 py-1">
                    We propose a [PROJECT_TYPE] solution that addresses your [SPECIFIC_NEED]...
                  </p>
                  <p>Our team has successfully delivered 50+ projects...</p>
                  <p className="bg-primary-50 border-l-2 border-primary-500 pl-3 py-1">
                    This approach will leverage [RELEVANT_TECHNOLOGIES] to achieve...
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-xs text-primary-600">
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
