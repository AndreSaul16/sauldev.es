import React, { useRef } from 'react';
import { achievements } from '../../data';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Trophy } from 'lucide-react';

const Projects = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    useScrollAnimation(titleRef, 'fadeInUp');

    return (
        <section id="projects" ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative z-10">
            <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">
                Logros & <span className="text-white">Proyectos</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
                {achievements.map((item, index) => (
                    <ProjectCard key={index} data={item} index={index} />
                ))}
            </div>
        </section>
    );
};

const ProjectCard = ({ data, index }) => {
    const cardRef = useRef(null);
    useScrollAnimation(cardRef, 'fadeInUp', index * 0.1);

    return (
        <div
            ref={cardRef}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-neon-cyan/50 transition-all duration-500 h-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="mb-6 text-neon-cyan group-hover:scale-110 transition-transform duration-300 origin-left">
                    <Trophy size={40} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                    {data.title}
                </h3>

                <span className="text-sm font-mono text-neon-purple mb-4 block">
                    {data.year}
                </span>

                <p className="text-gray-300 leading-relaxed flex-grow">
                    {data.description}
                </p>
            </div>
        </div>
    );
};

export default Projects;
