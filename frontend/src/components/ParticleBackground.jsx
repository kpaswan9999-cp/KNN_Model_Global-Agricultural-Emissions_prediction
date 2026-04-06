import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-[1] pointer-events-none"
          options={{
            fullScreen: { enable: false },
            background: {
              color: { value: "transparent" },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: { enable: false },
                onHover: { enable: true, mode: "grab" },
                resize: true,
              },
              modes: {
                grab: { distance: 150, links: { opacity: 0.5 } },
              },
            },
            particles: {
              color: { value: "#10b981" },
              links: {
                color: "#10b981",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1.5,
                straight: false,
              },
              number: {
                density: { enable: true, area: 800 },
                value: 60,
              },
              opacity: { value: 0.4 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
        />
      )}
    </>
  );
}
