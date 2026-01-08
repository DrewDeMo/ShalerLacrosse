import { useState } from 'react';

/**
 * TeamLogo Component
 * Displays team logo with fallback to team initials
 * Supports three sizes: small (48px), default (64px), large (80px)
 */
export default function TeamLogo({
    logoUrl,
    teamName,
    size = 'default',
    className = '',
    primaryColor = '#003B5C' // Default to Titans navy
}) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const sizeClasses = {
        small: 'w-12 h-12 text-base',
        default: 'w-16 h-16 text-xl',
        large: 'w-20 h-20 text-2xl'
    };

    const containerSize = sizeClasses[size] || sizeClasses.default;

    // Generate team initials from team name
    const getInitials = () => {
        if (!teamName) return '?';

        const words = teamName.trim().split(' ');
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        // Take first letter of first two words
        return words
            .slice(0, 2)
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    // If no logo or image failed to load, show initials fallback
    if (!logoUrl || imageError) {
        return (
            <div
                className={`${containerSize} ${className} rounded-full flex items-center justify-center font-bebas relative overflow-hidden`}
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25)`,
                    border: `2px solid ${primaryColor}30`
                }}
                title={teamName || 'Team'}
            >
                <span
                    className="font-bold relative z-10"
                    style={{ color: primaryColor }}
                >
                    {getInitials()}
                </span>
                {/* Subtle gradient overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${primaryColor}, transparent)`
                    }}
                />
            </div>
        );
    }

    return (
        <div className={`${containerSize} ${className} relative`}>
            {/* Loading skeleton */}
            {imageLoading && (
                <div
                    className="absolute inset-0 rounded-lg animate-pulse bg-gray-200"
                    style={{
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                    }}
                />
            )}

            {/* Team logo image */}
            <img
                src={logoUrl}
                alt={`${teamName || 'Team'} logo`}
                className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                loading="lazy"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                }}
            />
        </div>
    );
}
