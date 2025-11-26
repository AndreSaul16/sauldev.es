import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { certifications } from '../../data';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const Skills = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    useScrollAnimation(titleRef, 'fadeInUp');

    // Tecnologías principales con iconos Devicon
    const technologies = [
        { name: "Java", icon: "devicon-java-plain" },
        { name: "Python", icon: "devicon-python-plain" },
        { name: "JavaScript", icon: "devicon-javascript-plain" },
        { name: "SQL", icon: "devicon-mysql-plain" },
        { name: "Azure", icon: "devicon-azure-plain" },
        { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
        { name: "GCP", icon: "devicon-googlecloud-plain" },
        { name: "Git", icon: "devicon-git-plain" },
        { name: "Linux", icon: "devicon-linux-plain" }
    ];

    return (
        <section id="skills" ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative z-10">
            {/* Infinite Marquee de tecnologías */}
            <div className="w-full mb-20 overflow-hidden">
                <div className="relative">
                    {/* Gradient overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-deep-space to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-deep-space to-transparent z-10" />

                    <div className="marquee-container flex">
                        <div className="marquee-content flex gap-8 animate-marquee-reverse">
                            {/* Repetimos 3 veces para hacer el loop seamless */}
                            {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                                <div
                                    key={index}
                                    className="relative group cursor-pointer flex-shrink-0"
                                    title={tech.name}
                                >
                                    <i className={`${tech.icon} text-5xl text-white/70 hover:text-white hover:scale-125 transition-all duration-300`}></i>

                                    {/* Tooltip on hover */}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                        <span className="text-xs text-white/90 bg-deep-space/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">
                                            {tech.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple text-center">
                Certificaciones Profesionales
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full">
                {certifications.map((cert, index) => (
                    <BadgeCard key={index} certification={cert} index={index} />
                ))}
            </div>
        </section>
    );
};

const BadgeCard = ({ certification, index }) => {
    const cardRef = useRef(null);

    useScrollAnimation(cardRef, 'fadeInUp', index * 0.05);

    // Mouse position for glow effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientX - top);
    };

    // Background glow effect
    const background = useMotionTemplate`radial-gradient(
        600px circle at ${mouseX}px ${mouseY}px,
        rgba(14, 165, 233, 0.15),
        rgba(168, 85, 247, 0.08) 40%,
        transparent 60%
    )`;

    return (
        <motion.div
            ref={cardRef}
            className="relative group"
            initial={{ opacity: 0, y: 50 }}
            onMouseMove={handleMouseMove}
        >
            <a
                href={certification.credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer"
            >
                {/* Card container */}
                <div className="relative bg-deep-space/40 backdrop-blur-xl border border-white/10 group-hover:border-neon-cyan/50 rounded-2xl p-6 transition-colors duration-300">
                    {/* Subtle inner glow that follows mouse */}
                    <motion.div
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                        style={{ background }}
                    />

                    {/* Badge image container */}
                    <div className="relative aspect-square w-full mb-4 flex items-center justify-center">
                        <img
                            src={certification.image}
                            alt={certification.name}
                            className="w-full h-full object-contain drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all duration-500"
                            loading="lazy"
                        />
                    </div>

                    {/* Certification info */}
                    <div className="relative text-center space-y-2">
                        <h3 className="text-sm font-semibold text-white/90 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
                            {certification.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <span className="px-2 py-1 bg-white/5 rounded-md border border-white/5 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/30 transition-all duration-300">
                                {certification.issuer}
                            </span>
                            <span className="px-2 py-1 bg-white/5 rounded-md border border-white/5 group-hover:bg-neon-purple/10 group-hover:border-neon-purple/30 transition-all duration-300">
                                {certification.year}
                            </span>
                        </div>

                        {/* Verification hint */}
                        <p className="text-xs text-gray-500 group-hover:text-neon-cyan/70 transition-colors duration-300 mt-2">
                            Click para verificar en Credly
                        </p>
                    </div>
                </div>
            </a>
        </motion.div>
    );
};

export default Skills;
