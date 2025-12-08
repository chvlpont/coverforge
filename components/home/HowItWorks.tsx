import { FileText, Briefcase, Sparkles } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to generate tailored documents for any purpose - cover letters, proposals, pitches, and more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-500 transition-all hover:shadow-lg">
              <div className="text-5xl font-bold text-gray-200 mb-4">01</div>
              <div className="w-14 h-14 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Master Document</h3>
              <p className="text-gray-600 leading-relaxed">
                Write one comprehensive document. Highlight the sections you want AI to customize for each opportunity.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-500 transition-all hover:shadow-lg">
              <div className="text-5xl font-bold text-gray-200 mb-4">02</div>
              <div className="w-14 h-14 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Your Targets</h3>
              <p className="text-gray-600 leading-relaxed">
                Paste job postings, project briefs, or client requirements. Our AI analyzes each opportunity.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-primary-500 transition-all hover:shadow-lg">
              <div className="text-5xl font-bold text-gray-200 mb-4">03</div>
              <div className="w-14 h-14 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Custom Versions</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive tailored documents for each opportunity. Only highlighted sections are AI-modified, keeping your authentic voice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
