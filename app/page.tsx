import Navbar from '@/components/Navbar'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import Features from '@/components/home/Features'
import CTA from '@/components/home/CTA'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}
