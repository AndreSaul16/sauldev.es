import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { profile } from '../../data';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const About = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const cardRef = useRef(null);

    useScrollAnimation(textRef, 'fadeInUp');

    // Mouse position for effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Card dimensions for tilt calculation
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;

        mouseX.set(x);
        mouseY.set(y);

        // Update dimensions if needed
        if (dimensions.width !== width || dimensions.height !== height) {
            setDimensions({ width, height });
        }
    };

    const handleMouseLeave = () => {
        mouseX.set(dimensions.width / 2);
        mouseY.set(dimensions.height / 2);
    };

    // Tilt effect calculations
    const rotateX = useTransform(
        mouseY,
        [0, dimensions.height],
        [8, -8],
        { clamp: true }
    );

    const rotateY = useTransform(
        mouseX,
        [0, dimensions.width],
        [-8, 8],
        { clamp: true }
    );

    // Enhanced background glow effect
    const background = useMotionTemplate`radial-gradient(
        800px circle at ${mouseX}px ${mouseY}px,
        rgba(14, 165, 233, 0.25),
        rgba(168, 85, 247, 0.15) 40%,
        transparent 70%
    )`;

    return (
        <section id="about" ref={sectionRef} className="min-h-screen w-full flex items-center justify-center py-20 px-6 relative z-10">
            <motion.div
                ref={cardRef}
                className="max-w-4xl mx-auto bg-deep-space/50 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl relative group overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    transformStyle: "preserve-3d",
                    perspective: 1000,
                }}
                animate={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                }}
                whileHover={{ scale: 1.02 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Mouse following background effect behind the card */}
                <motion.div
                    className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 blur-xl"
                    style={{ background, zIndex: -1 }}
                />

                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 text-center">
                    Sobre Mí
                </h2>

                <div ref={textRef} className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
                    <p className="text-justify">
                        Soy <span className="text-neon-cyan font-semibold">{profile.name}</span>, un {profile.role} especializado en <span className="text-neon-purple font-semibold">{profile.subRole}</span>.
                    </p>
                    <p className="text-justify">
                        {profile.description}
                    </p>
                    <p className="text-justify">
                        Transformo tecnología compleja en ventajas competitivas. Diseño arquitecturas escalables y experiencias de usuario inmersivas, potenciadas por Inteligencia Artificial para automatizar procesos y acelerar el crecimiento de tu negocio.
                    </p>

                    <div className="pt-8 flex flex-wrap gap-4 justify-center">
                        {profile.socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan rounded-full transition-all duration-300 group/social"
                            >
                                <social.icon size={20} className="group-hover/social:text-neon-cyan" />
                                <span>{social.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default About;
