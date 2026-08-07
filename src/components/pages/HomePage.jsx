import Hero from "../home/Hero";
import Stats from "../home/Stats";
import ServicesPreview from "../home/ServicesPreview";
import ReelStrip from "../home/ReelStrip";
import Process from "../home/Process";
import Clients from "../home/Clients";
import FAQ from "../home/FAQ";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Stats />
      <ServicesPreview />
      <ReelStrip />
      <Process />
      <Clients />
      <FAQ />
    </div>
  );
}
