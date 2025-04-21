import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';
import PhotoFiltersEffectsSection from '../components/PhotoFiltersEffectsSection';

import PricingSection from '../components/PricingSection'
import AIImageGeneratorHero from '../components/AIImageGeneratorHero'
import Faq from '../components/Faq.jsx'

export default function Home() {
  return (
    <div className="landing-container">
      <Header />
      <MainContent />
      <AIImageGeneratorHero />
      <PhotoFiltersEffectsSection />
   
      <PricingSection />
    <Faq />
      <Footer />
    </div>
  );
}