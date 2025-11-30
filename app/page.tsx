import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import Features from '@/components/home/Features'
import CTA from '@/components/home/CTA'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
    </div>
  )
}
