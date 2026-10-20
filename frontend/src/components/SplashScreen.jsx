import { ShieldCheck } from "lucide-react";

export default function SplashScreen() {
  return (
    <main className="splash-screen" aria-label="Loading FraudShield 360" aria-live="polite">
      <div className="splash-glow splash-glow-left" />
      <div className="splash-glow splash-glow-right" />

      <section className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-ring splash-ring-outer" />
          <div className="splash-ring splash-ring-inner" />
          <img
            src="/fraudshield-logo.svg"
            alt="FraudShield 360"
            className="splash-logo"
          />
        </div>

        <div className="splash-brand">
          <p className="splash-eyebrow">
            <ShieldCheck size={15} />
            Digital safety intelligence
          </p>
          <h1>
            FraudShield<span>360</span>
          </h1>
          <p className="splash-tagline">
            Detect the deception. Defend your digital world.
          </p>
        </div>

        <div className="splash-loader" role="status">
          <div className="splash-loader-track">
            <div className="splash-loader-progress" />
          </div>
          <span>Securing your experience</span>
        </div>
      </section>

      <p className="splash-footer">AI-assisted scam and phishing protection</p>
    </main>
  );
}
