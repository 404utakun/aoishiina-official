'use client';

import { useRef, useState } from 'react';
import OceanCanvas, { WaveIntensity } from './OceanCanvas';
import TopNav from './TopNav';
import HeroSilhouetteStage from './HeroSilhouetteStage';
import ProfileAndSchedule from './ProfileAndSchedule';
import OceanBottleAndNotify from './OceanBottleAndNotify';
import Footer from './Footer';

export default function ShiinaDebutClient() {
  const [waveIntensity, setWaveIntensity] = useState<WaveIntensity>('calm');
  const [burstTrigger, setBurstTrigger] = useState(0);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerBubbleBurst = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const handleFocusNotify = () => {
    const section = document.getElementById('notify-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 350);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#eef4ff] via-[#f7faff] to-[#e4ecff]">
      <OceanCanvas intensity={waveIntensity} burstTrigger={burstTrigger} />

      <TopNav onFocusNotify={handleFocusNotify} />

      <main>
        <HeroSilhouetteStage
          onFocusNotify={handleFocusNotify}
          onTriggerBubbleBurst={handleTriggerBubbleBurst}
        />

        <ProfileAndSchedule />

        <OceanBottleAndNotify
          emailInputRef={emailInputRef}
          onTriggerBubbleBurst={handleTriggerBubbleBurst}
        />
      </main>

      <Footer
        waveIntensity={waveIntensity}
        onChangeWaveIntensity={setWaveIntensity}
        onTriggerBubbleBurst={handleTriggerBubbleBurst}
      />
    </div>
  );
}
