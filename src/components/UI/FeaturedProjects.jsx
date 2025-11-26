import React, { useRef } from 'react';
import { projects } from '../../data';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Phone, Home, Gamepad2, Plane, Satellite, ExternalLink, Github } from 'lucide-react';

// Map icon names to components
const iconMap = {
    Phone,
    Home,
    Gamepad2,
    Plane,
    Satellite
};

const FeaturedProjects = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    useScrollAnimation(titleRef, 'fadeInUp');

    return (
        <section id="featured-projects" ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative z-10">
            <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">
                Proyectos <span className="text-white">Destacados</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
                {projects.map((project, index) => (
                    <ProjectCard key={index} data={project} index={index} />
                ))}
            </div>
        </section>
    );
};

const ProjectCard = ({ data, index }) => {
    const cardRef = useRef(null);
    useScrollAnimation(cardRef, 'fadeInUp', index * 0.1);

    const IconComponent = iconMap[data.icon] || Phone;

    return (
        <div
            ref={cardRef}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-neon-cyan/50 transition-all duration-500 h-full flex flex-col"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="p-8 relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6 text-neon-cyan group-hover:scale-110 transition-transform duration-300 origin-left">
                    <IconComponent size={48} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                    {data.name}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-gray-400 mb-2">
                    {data.fullName}
                </p>

                {/* Category & Year */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-neon-purple bg-neon-purple/10 px-2 py-1 rounded">
                        {data.category}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                        {data.year}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-4 flex-grow">
                    {data.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {data.technologies.slice(0, 4).map((tech, i) => (
                        <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors"
                        >
                            {tech}
                        </span>
                    ))}
                    {data.technologies.length > 4 && (
                        <span className="text-xs px-2 py-1 text-gray-500">
                            +{data.technologies.length - 4}
                        </span>
                    )}
                </div>

                {/* Highlights */}
                <div className="mb-6 space-y-2">
                    {data.highlights.slice(0, 2).map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className="min-w-1 w-1 h-1 rounded-full bg-neon-cyan mt-2" />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {highlight}
                            </p>
                        </div>
                    ))}
                </div>

                {/* GitHub Button */}
                <a
                    href={data.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 hover:from-neon-purple/30 hover:to-neon-cyan/30 border border-white/10 hover:border-neon-cyan/50 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-cyan/20"
                >
                    <Github size={18} className="text-neon-cyan" />
                    <span className="text-sm font-medium text-white">Ver en GitHub</span>
                    <ExternalLink size={14} className="text-gray-400" />
                </a>
            </div>
        </div>
    );
};

export default FeaturedProjects;
