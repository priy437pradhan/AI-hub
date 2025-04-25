import MainContent from '../components/MainContent';
import AIImageGeneratorHero from '../components/AIImageGeneratorHero'
import PhotoFiltersEffectsSection from '../components/PhotoFiltersEffectsSection';
import PhotoEditorHero from '../components/PhotoEditorHero';
import PricingSection from '../components/PricingSection'
import Faq from '../components/Faq.jsx'
import Header from '../components/Header';
import Footer from '../components/Footer';
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