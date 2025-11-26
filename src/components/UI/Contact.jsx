import React, { useRef } from 'react';
import { profile } from '../../data';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Send } from 'lucide-react';

const Contact = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const formRef = useRef(null);

    useScrollAnimation(titleRef, 'fadeInUp');
    useScrollAnimation(formRef, 'fadeInUp', 0.2);

    return (
        <section id="contact" ref={sectionRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative z-10">
            <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-8 text-white text-center">
                ¿Listo para <span className="text-neon-cyan">Colaborar?</span>
            </h2>

            <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl">
                Estoy buscando nuevas oportunidades para aportar mi experiencia en IA y Desarrollo Cloud. ¡Hablemos!
            </p>

            <div ref={formRef} className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                        <input
                            type="text"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
                        <textarea
                            rows="4"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                            placeholder="¿En qué estás pensando?"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <span>Enviar Mensaje</span>
                        <Send size={20} />
                    </button>
                </form>

                <div className="mt-8 flex justify-center gap-6">
                    {profile.socials.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-neon-cyan transition-colors"
                        >
                            <social.icon size={24} />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact;
