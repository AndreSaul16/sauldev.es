import React, { useRef } from 'react';
import { education } from '../../data';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const Experience = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    useScrollAnimation(titleRef, 'fadeInUp');

    return (
        <section id="experience" ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative z-10">
            <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple text-center">
                Formación Académica
            </h2>

            <div className="max-w-5xl w-full space-y-8">
                {education.map((edu, index) => (
                    <EducationCard key={index} data={edu} index={index} />
                ))}
            </div>
        </section>
    );
};

const EducationCard = ({ data, index }) => {
    const cardRef = useRef(null);

    useScrollAnimation(cardRef, 'fadeInUp', index * 0.1);

    return (
        <div
            ref={cardRef}
            className="group relative bg-deep-space/40 backdrop-blur-xl border border-white/10 hover:border-neon-cyan/50 rounded-2xl p-8 transition-all duration-500"
        >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors duration-300">
                            {data.degree}
                        </h3>
                        <h4 className="text-lg text-gray-400 mt-2">{data.school}</h4>
                    </div>
                    <span className="text-sm md:text-base text-neon-purple font-mono bg-neon-purple/10 px-4 py-2 rounded-full border border-neon-purple/30 whitespace-nowrap">
                        {data.period}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                    {data.description}
                </p>

                {/* Highlights */}
                {data.highlights && (
                    <div className="mb-6">
                        <h5 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">Aspectos Destacados</h5>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {data.highlights.map((highlight, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                    <span className="text-neon-cyan mt-1 flex-shrink-0">▹</span>
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Technologies */}
                {data.technologies && (
                    <div>
                        <h5 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wider">Tecnologías Principales</h5>
                        <div className="flex flex-wrap gap-2">
                            {data.technologies.map((tech, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-xs font-medium bg-white/5 text-white/90 rounded-full border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Experience;
