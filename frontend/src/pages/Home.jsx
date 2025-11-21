import BackgroundBlobs from "../components/home/BackgroundBlobs";
import HeroSection from "../components/home/HeroSection";
import DashboardPreview from "../components/home/DashboardPreview";
import TrustedBy from "../components/home/TrustedBy";
import FeatureGrid from "../components/home/FeatureGrid";
import HowItWorks from "../components/home/HowItWorks";
import PricingTeaser from "../components/home/PricingTeaser";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative">
      <BackgroundBlobs />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24">
        
        <div className="grid md:grid-cols-2 gap-12">
          <HeroSection />
          <DashboardPreview />
        </div>

        <TrustedBy />
        <FeatureGrid />
        <HowItWorks />
        <PricingTeaser />
        
      </main>
    </div>
  );
}
