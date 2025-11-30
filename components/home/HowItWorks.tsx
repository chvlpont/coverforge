import { FileText, Briefcase, Sparkles } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="py-24 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-dark-100 max-w-2xl mx-auto">
            Three simple steps to generate tailored documents for any purpose - cover letters, proposals, pitches, and more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-700 transition-all">
              <div className="text-5xl font-bold text-dark-800 mb-4">01</div>
              <div className="w-14 h-14 rounded-lg bg-primary-900/50 text-primary-400 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Upload Master Document</h3>
              <p className="text-dark-100 leading-relaxed">
                Write one comprehensive document. Highlight the sections you want AI to customize for each opportunity.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-700 transition-all">
              <div className="text-5xl font-bold text-dark-800 mb-4">02</div>
              <div className="w-14 h-14 rounded-lg bg-primary-900/50 text-primary-400 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Add Your Targets</h3>
              <p className="text-dark-100 leading-relaxed">
                Paste job postings, project briefs, or client requirements. Our AI analyzes each opportunity.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-8 hover:border-primary-700 transition-all">
              <div className="text-5xl font-bold text-dark-800 mb-4">03</div>
              <div className="w-14 h-14 rounded-lg bg-primary-900/50 text-primary-400 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Custom Versions</h3>
              <p className="text-dark-100 leading-relaxed">
                Receive tailored documents for each opportunity. Only highlighted sections are AI-modified, keeping your authentic voice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
