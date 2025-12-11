import { FileText, Briefcase, Sparkles } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to create professional documents with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl font-bold text-black">01</div>
                <div className="w-14 h-14 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Create Your Document</h3>
              <p className="text-gray-600 leading-relaxed">
                Start a new document and write your content. Highlight sections where you want AI assistance.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl font-bold text-black">02</div>
                <div className="w-14 h-14 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Add References</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload reference materials like project briefs or requirements. AI uses these to inform suggestions.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="text-5xl font-bold text-black">03</div>
                <div className="w-14 h-14 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Get AI Suggestions</h3>
              <p className="text-gray-600 leading-relaxed">
                AI analyzes your references and provides smart suggestions for highlighted sections while preserving your style.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
