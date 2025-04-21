import Header from '../components/Header';
import MainContent from '../components/MainContent';
import AIImageGeneratorHero from '../components/AIImageGeneratorHero'
import PhotoFiltersEffectsSection from '../components/PhotoFiltersEffectsSection';
import PhotoEditorHero from '../components/PhotoEditorHero';
import PricingSection from '../components/PricingSection'
import Faq from '../components/Faq.jsx'
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="landing-container">
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