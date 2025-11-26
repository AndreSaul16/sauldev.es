import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { profile } from '../../data';

const Hero = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(titleRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        )
            .fromTo(subtitleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, delay: -0.5, ease: "power3.out" }
            );
    }, []);

    return (
        <section className="h-screen w-full flex flex-col justify-center items-center relative z-10 pointer-events-none">
            <div className="text-center pointer-events-auto">
                <h1 ref={titleRef} className="text-7xl md:text-9xl font-bold tracking-tighter mb-4">
                    <span className="text-white">Software </span>
                    <p></p>
                    <span className="text-neon-cyan">Inteligente en la nube</span>
                </h1>
                <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-300 font-light tracking-widest uppercase">
                    {profile.name}
                </p>
            </div>

            <div className="absolute bottom-10 animate-bounce">
                <p className="text-sm text-gray-500">Scroll to explore</p>
            </div>
        </section>
    );
};

export default Hero;
