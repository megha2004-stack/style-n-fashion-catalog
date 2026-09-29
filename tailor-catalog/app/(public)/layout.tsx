import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/layout/ParticleBackground";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ParticleBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}