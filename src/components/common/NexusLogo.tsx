import React from 'react';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function NexusLogo({ size = 'lg', showTagline = true, className = '' }: NexusLogoProps) {
  const sizeConfig = {
    sm: {
      iconSize: 'w-8 h-8',
      iconText: 'text-lg',
      titleText: 'text-xl',
      taglineText: 'text-xs',
      spacing: 'mb-1',
      taglineSpacing: 'mb-1'
    },
    md: {
      iconSize: 'w-12 h-12',
      iconText: 'text-2xl',
      titleText: 'text-3xl',
      taglineText: 'text-sm',
      spacing: 'mb-2',
      taglineSpacing: 'mb-1'
    },
    lg: {
      iconSize: 'w-20 h-20',
      iconText: 'text-5xl',
      titleText: 'text-5xl',
      taglineText: 'text-lg',
      spacing: 'mb-4',
      taglineSpacing: 'mb-2'
    },
    xl: {
      iconSize: 'w-24 h-24',
      iconText: 'text-6xl',
      titleText: 'text-6xl',
      taglineText: 'text-xl',
      spacing: 'mb-6',
      taglineSpacing: 'mb-3'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`text-center ${className}`}>
      {/* Simple Logo Icon */}
      <div className={`mx-auto ${config.iconSize} ${config.spacing} flex items-center justify-center`}>
        {/* Logo Container */}
        <div 
          className="relative w-full h-full rounded-2xl flex items-center justify-center"
          style={{
            background: 'var(--logo-bg)',
            border: '1px solid var(--logo-border)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* The N Letter */}
          <span 
            className={`${config.iconText} font-black relative`}
            style={{
              fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            N
          </span>
        </div>
      </div>
      
      {/* Nexus Text */}
      <div className="relative">
        <h1 
          className={`${config.titleText} font-black tracking-tight ${config.taglineSpacing}`}
          style={{
            fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
            background: 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Nexus
        </h1>
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <p 
          className={`${config.taglineText} font-medium text-muted-foreground dark:text-gray-300`}
          style={{
            fontFamily: '"Inter", system-ui, sans-serif'
          }}
        >
          Your vibrant campus community
        </p>
      )}
    </div>
  );
}
