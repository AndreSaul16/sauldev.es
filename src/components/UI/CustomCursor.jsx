import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
            });
            gsap.to(followerRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
            });
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <div className="hidden md:block pointer-events-none fixed top-0 left-0 z-[9999]">
            <div
                ref={cursorRef}
                className="w-3 h-3 bg-neon-cyan rounded-full absolute -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
            <div
                ref={followerRef}
                className="w-8 h-8 border border-neon-purple rounded-full absolute -translate-x-1/2 -translate-y-1/2 opacity-50"
            />
        </div>
    );
};

export default CustomCursor;
