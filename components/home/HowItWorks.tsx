import { FileText, Briefcase, Sparkles } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to create professional documents with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-500 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl font-bold text-gray-900">01</div>
                <div className="w-14 h-14 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Document</h3>
              <p className="text-gray-600 leading-relaxed">
                Start a new document and write your content. Highlight sections where you want AI assistance.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-500 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl font-bold text-gray-900">02</div>
                <div className="w-14 h-14 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Briefcase className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add References</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload reference materials like project briefs or requirements. AI uses these to inform suggestions.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-500 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl font-bold text-gray-900">03</div>
                <div className="w-14 h-14 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get AI Suggestions</h3>
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
