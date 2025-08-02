import { AuthDialog } from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { Cloud, Shield, Zap, Globe } from "lucide-react";
import stormBackground from "@/assets/storm-background.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Storm Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${stormBackground})` }}
      >
        <div className="absolute inset-0 bg-storm-dark/60" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-storm-light" />
            <span className="text-2xl font-bold text-storm-light">STORME</span>
          </div>
          <AuthDialog />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-storm-light tracking-tight">
              STORME
            </h1>
            <p className="text-xl md:text-2xl text-storm-primary font-medium">
              Decentralized File Storage • Powered by the Storm
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card/40 backdrop-blur-sm p-6 rounded-lg border border-border/30">
              <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Blockchain Metadata</h3>
              <p className="text-sm text-muted-foreground">
                File metadata stored immutably on Ethereum blockchain for permanent provenance and ownership verification
              </p>
            </div>
            
            <div className="bg-card/40 backdrop-blur-sm p-6 rounded-lg border border-border/30">
              <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cryptographic Proof</h3>
              <p className="text-sm text-muted-foreground">
                Ethereum smart contracts provide tamper-proof records and enable trustless file verification
              </p>
            </div>
            
            <div className="bg-card/40 backdrop-blur-sm p-6 rounded-lg border border-border/30">
              <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Decentralized Ownership</h3>
              <p className="text-sm text-muted-foreground">
                True ownership with blockchain-backed rights, no single point of failure or censorship
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <AuthDialog />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-storm-muted">
        <p>&copy; 2024 Storme. Decentralized file storage for the future.</p>
      </footer>
    </div>
  );
}