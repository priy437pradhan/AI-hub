import MainContent from '../components/MainContent';
import AIImageGeneratorHero from '../components/AIImageGeneratorHero'
import PhotoFiltersEffectsSection from '../components/PhotoFiltersEffectsSection';
import PhotoEditorHero from '../components/PhotoEditorHero';
import PricingSection from '../components/PricingSection'
import Faq from '../components/Faq.jsx'
export default function Homepage() {
  return (
    <div>
      
      <MainContent />
      <AIImageGeneratorHero />
      <PhotoFiltersEffectsSection />
      <PhotoEditorHero />
      <PricingSection />
      <Faq />

    </div>
    
  );
}