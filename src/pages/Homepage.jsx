import MainContent from '../Homepage/MainContent';
import AIImageGeneratorHero from '../Homepage/AIImageGeneratorHero'
import PhotoFiltersEffectsSection from '../Homepage/PhotoFiltersEffectsSection';
import PhotoEditorHero from '../Homepage/PhotoEditorHero';
import PricingSection from '../Homepage/PricingSection'
import Faq from '../Homepage/Faq.jsx'
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
export default function Homepage() {
  return (
    <div>
       <Header />
      <MainContent />
      <AIImageGeneratorHero />
      <PhotoFiltersEffectsSection />
      <PhotoEditorHero />
      <PricingSection />
      <Faq />
      <Footer />
    </div>
    
  );
}