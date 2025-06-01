import { useEffect, useState } from 'react';
import { FiMail } from "react-icons/fi";
import { HiOutlineMailOpen } from "react-icons/hi";

// Create a fixed array of particles with consistent properties
const generateParticleProps = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    isMail: Math.random() > 0.5,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 15 + Math.random() * 10,
    size: 22 + Math.random() * 6,
    id: Math.random().toString(36).substring(2, 10),
  }));
};

interface BackgroundIconsProps {
  count?: number;
}

const BackgroundIcons = ({ count = 20 }: BackgroundIconsProps) => {
  const [particles, setParticles] = useState(() => generateParticleProps(count));

  // Only regenerate particles if count changes
  useEffect(() => {
    setParticles(generateParticleProps(count));
  }, [count]);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            animationFillMode: 'both',
            transform: 'translateY(105vh) translateX(0px)',
            fontSize: `${particle.size}px`,
            color: particle.isMail ? '#a78bfa' : '#60a5fa',
          }}
        >
          {particle.isMail ? <FiMail /> : <HiOutlineMailOpen />}
        </div>
      ))}
    </div>
  );
};

export default BackgroundIcons;
