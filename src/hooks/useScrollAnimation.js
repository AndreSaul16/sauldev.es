import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (ref, animationType = 'fadeInUp', delay = 0) => {
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        let ctx = gsap.context(() => {
            if (animationType === 'fadeInUp') {
                gsap.fromTo(element,
                    { opacity: 0, y: 50, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: delay,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            } else if (animationType === 'slideInLeft') {
                gsap.fromTo(element,
                    { opacity: 0, x: -50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        delay: delay,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }, ref);

        return () => ctx.revert();
    }, [ref, animationType, delay]);
};
