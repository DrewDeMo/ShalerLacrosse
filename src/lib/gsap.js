import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Export everything for use in components
export { gsap, ScrollTrigger, useGSAP };

// Custom ease curves for athletic feel
export const athleticEase = {
    // Explosive start, smooth finish - like a shot
    explosive: 'power4.out',
    // Smooth and controlled - like a cradle
    smooth: 'power2.inOut',
    // Bouncy energy - for playful elements
    bounce: 'elastic.out(1, 0.5)',
    // Sharp and precise - for stats/numbers
    sharp: 'power3.out',
    // Dramatic reveal - for headlines
    dramatic: 'expo.out',
};

// Reusable animation presets
export const heroAnimations = {
    // Split text character reveal
    splitTextReveal: (element, options = {}) => {
        const chars = element.querySelectorAll('.char');
        return gsap.fromTo(
            chars,
            {
                opacity: 0,
                y: 100,
                rotateX: -90,
            },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: options.duration || 0.8,
                stagger: options.stagger || 0.03,
                ease: athleticEase.dramatic,
                ...options,
            }
        );
    },

    // Fade slide up
    fadeSlideUp: (element, options = {}) => {
        return gsap.fromTo(
            element,
            {
                opacity: 0,
                y: 60,
            },
            {
                opacity: 1,
                y: 0,
                duration: options.duration || 1,
                ease: athleticEase.explosive,
                ...options,
            }
        );
    },

    // Scale pop in
    scalePop: (element, options = {}) => {
        return gsap.fromTo(
            element,
            {
                opacity: 0,
                scale: 0.8,
            },
            {
                opacity: 1,
                scale: 1,
                duration: options.duration || 0.6,
                ease: athleticEase.bounce,
                ...options,
            }
        );
    },

    // Counter animation
    countUp: (element, endValue, options = {}) => {
        const obj = { value: 0 };
        return gsap.to(obj, {
            value: endValue,
            duration: options.duration || 2,
            ease: athleticEase.sharp,
            onUpdate: () => {
                element.textContent = Math.round(obj.value);
            },
            ...options,
        });
    },

    // Floating animation for background elements
    float: (element, options = {}) => {
        return gsap.to(element, {
            y: options.y || -20,
            x: options.x || 10,
            rotation: options.rotation || 5,
            duration: options.duration || 4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            ...options,
        });
    },

    // Parallax scroll effect
    parallaxScroll: (element, options = {}) => {
        return gsap.to(element, {
            y: options.y || 100,
            ease: 'none',
            scrollTrigger: {
                trigger: options.trigger || element,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
            ...options,
        });
    },

    // Glow pulse animation
    glowPulse: (element, options = {}) => {
        return gsap.to(element, {
            opacity: options.maxOpacity || 0.6,
            scale: options.maxScale || 1.1,
            duration: options.duration || 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            ...options,
        });
    },
};

// Mouse parallax utility
export const createMouseParallax = (container, elements, intensity = 0.05) => {
    const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        elements.forEach((el, index) => {
            const depth = (index + 1) * intensity;
            gsap.to(el, {
                x: mouseX * depth,
                y: mouseY * depth,
                duration: 0.5,
                ease: 'power2.out',
            });
        });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
        container.removeEventListener('mousemove', handleMouseMove);
    };
};

// ScrollTrigger defaults for consistent behavior
ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
});
