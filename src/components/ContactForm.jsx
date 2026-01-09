import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

// Icon components
const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const EnvelopeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

const TagIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);

const ChatIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function ContactForm() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

    useEffect(() => {
        if (!sectionRef.current || !titleRef.current || !formRef.current) return;

        gsap.set(titleRef.current, { opacity: 0, y: 30 });
        gsap.set(formRef.current, { opacity: 0, y: 50 });

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const tl = gsap.timeline();
                tl.to(titleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                })
                    .to(formRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    }, '-=0.4');
            }
        });

        return () => trigger.kill();
    }, []);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : '';
            case 'phone':
                // Phone is optional, but if provided should be valid
                if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
                    return 'Please enter a valid phone number';
                }
                return '';
            case 'subject':
                return value.trim().length < 3 ? 'Subject must be at least 3 characters' : '';
            case 'message':
                return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'phone') { // Phone is optional
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTouched({
                name: true,
                email: true,
                subject: true,
                message: true
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Here you would integrate with your email service
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Send to email (you can use Formspree, EmailJS, or your backend)
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                setErrors({});
                setTouched({});
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubmitStatus(null);
    };

    // If form submitted successfully, show success message
    if (submitStatus === 'success') {
        return (
            <section ref={sectionRef} id="contact" className="relative py-20 lg:py-24 px-6 lg:px-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-off-white via-white to-slate-50" />

                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #061649 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <div className="text-green-600 mb-6">
                        <CheckCircleIcon />
                    </div>
                    <h2 className="font-bebas text-5xl md:text-6xl tracking-wide leading-none text-navy mb-4">
                        MESSAGE <span className="text-red">SENT!</span>
                    </h2>
                    <p className="text-navy/60 mb-8 text-lg">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 bg-red hover:bg-red/90 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm"
                    >
                        Send Another Message
                    </button>
                </div>
            </section>
        );
    }

    // If form submission failed, show error message
    if (submitStatus === 'error') {
        return (
            <section ref={sectionRef} id="contact" className="relative py-20 lg:py-24 px-6 lg:px-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-off-white via-white to-slate-50" />

                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #061649 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <div className="text-red mb-6">
                        <XCircleIcon />
                    </div>
                    <h2 className="font-bebas text-5xl md:text-6xl tracking-wide leading-none text-navy mb-4">
                        SOMETHING WENT <span className="text-red">WRONG</span>
                    </h2>
                    <p className="text-navy/60 mb-4 text-lg">
                        We couldn't send your message. Please try again or email us directly.
                    </p>
                    <p className="text-navy/80 mb-8">
                        <a href="mailto:ShalerAreaLacrosse@gmail.com" className="underline hover:text-red transition-colors">
                            ShalerAreaLacrosse@gmail.com
                        </a>
                    </p>
                    <button
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 bg-red hover:bg-red/90 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id="contact" className="relative py-20 lg:py-24 px-6 lg:px-12 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-off-white via-white to-slate-50" />

            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #061649 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red/[0.02] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-navy/[0.03] rounded-full blur-[80px]" />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-red/10 border border-red/20 px-4 py-2 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-red tracking-[0.2em] uppercase">Get In Touch</span>
                    </div>
                    <h2 className="font-bebas text-5xl md:text-6xl tracking-wide leading-none text-navy">
                        CONTACT <span className="text-red">US</span>
                    </h2>
                    <p className="text-navy/50 text-sm mt-4 max-w-2xl mx-auto">
                        Have questions about our program? Interested in joining the team? We'd love to hear from you.
                    </p>
                </div>

                {/* Contact Form */}
                <div ref={formRef}>
                    <div
                        className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-navy/5"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(6, 22, 73, 0.1)'
                        }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name and Email Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">
                                        Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                                            <UserIcon />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${errors.name && touched.name
                                                    ? 'border-red bg-red/5 focus:border-red'
                                                    : 'border-navy/10 bg-slate-50 focus:border-red focus:bg-white'
                                                }`}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    {errors.name && touched.name && (
                                        <p className="mt-1 text-xs text-red">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                                            <EnvelopeIcon />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${errors.email && touched.email
                                                    ? 'border-red bg-red/5 focus:border-red'
                                                    : 'border-navy/10 bg-slate-50 focus:border-red focus:bg-white'
                                                }`}
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    {errors.email && touched.email && (
                                        <p className="mt-1 text-xs text-red">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone and Subject Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">
                                        Phone <span className="text-navy/40 text-xs">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                                            <PhoneIcon />
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${errors.phone && touched.phone
                                                    ? 'border-red bg-red/5 focus:border-red'
                                                    : 'border-navy/10 bg-slate-50 focus:border-red focus:bg-white'
                                                }`}
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>
                                    {errors.phone && touched.phone && (
                                        <p className="mt-1 text-xs text-red">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">
                                        Subject *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                                            <TagIcon />
                                        </div>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${errors.subject && touched.subject
                                                    ? 'border-red bg-red/5 focus:border-red'
                                                    : 'border-navy/10 bg-slate-50 focus:border-red focus:bg-white'
                                                }`}
                                            placeholder="What's this about?"
                                        />
                                    </div>
                                    {errors.subject && touched.subject && (
                                        <p className="mt-1 text-xs text-red">{errors.subject}</p>
                                    )}
                                </div>
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-navy mb-2 uppercase tracking-wider">
                                    Message *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-4 text-navy/40">
                                        <ChatIcon />
                                    </div>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        rows="6"
                                        className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none resize-none ${errors.message && touched.message
                                                ? 'border-red bg-red/5 focus:border-red'
                                                : 'border-navy/10 bg-slate-50 focus:border-red focus:bg-white'
                                            }`}
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>
                                {errors.message && touched.message && (
                                    <p className="mt-1 text-xs text-red">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                                <p className="text-xs text-navy/50">
                                    * Required fields - We typically respond within 24 hours
                                </p>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        group relative px-8 py-4 rounded-lg font-bold uppercase tracking-wider text-sm
                                        transition-all duration-300 overflow-hidden
                                        ${isSubmitting
                                            ? 'bg-navy/50 cursor-not-allowed'
                                            : 'bg-red hover:bg-red/90 hover:shadow-lg hover:shadow-red/30'
                                        }
                                    `}
                                >
                                    <span className="relative z-10 text-white flex items-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                    {/* Button shine effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom decorative element */}
                <div className="flex justify-center mt-16">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red/20" />
                        <div className="w-3 h-3 rounded-full bg-red/40" />
                        <div className="w-2 h-2 rounded-full bg-red/20" />
                    </div>
                </div>
            </div>
        </section>
    );
}
