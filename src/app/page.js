import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import TestimonialSection from '../components/TestimonialSection'
import PricingSection from '../components/PricingSection'
import AIImageGeneratorHero from '../components/AIImageGeneratorHero'

export default function Home() {
  return (
    <div className="landing-container">
      <Header />
      <MainContent />
      <AIImageGeneratorHero />
      <TestimonialSection />
      <PricingSection />

      <Footer />
    </div>
  );
}