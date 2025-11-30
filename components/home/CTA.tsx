import Button from '@/components/Button'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Save Time?
        </h2>
        <p className="text-xl text-dark-100 mb-8">
          Stop rewriting the same document over and over. Start working smarter.
        </p>
        <Button>Get Started Free</Button>
      </div>
    </section>
  )
}
