import Button from '@/components/Button'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
          Ready to Save Time?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Stop rewriting the same document over and over. Start working smarter.
        </p>
        <Button className="cursor-pointer rounded-full px-8 py-4 bg-black text-white font-semibold hover:bg-gray-800 transition-all">
          Get Started Free
        </Button>
      </div>
    </section>
  )
}
