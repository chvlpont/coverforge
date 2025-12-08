import Button from '@/components/Button'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Ready to Save Time?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Stop rewriting the same document over and over. Start working smarter.
        </p>
        <Button>Get Started Free</Button>
      </div>
    </section>
  )
}
