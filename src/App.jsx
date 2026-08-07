import { SiteProvider, useSite } from "./lib/SiteContext";
import ProgressBar from "./components/layout/ProgressBar";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import CTABanner from "./components/layout/CTABanner";
import HomePage from "./components/pages/HomePage";
import ServicesPage from "./components/pages/ServicesPage";
import WorkPage from "./components/pages/WorkPage";
import ContactPage from "./components/pages/ContactPage";

function Shell() {
  const { page } = useSite();

  return (
    <div
      style={{
        background: "#0B0710",
        color: "#F4F0FA",
        fontFamily: "'JetBrains Mono', monospace",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <ProgressBar />
      <Nav />
      {page === "home" && <HomePage />}
      {page === "services" && <ServicesPage />}
      {page === "work" && <WorkPage />}
      {page === "contact" && <ContactPage />}
      {page !== "contact" && page !== "services" && <CTABanner />}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Shell />
    </SiteProvider>
  );
}
