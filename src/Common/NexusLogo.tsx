import React from 'react';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}
const NexusLogo = ({ size = 'lg', showTagline = true, className = '' }: NexusLogoProps) => {
  const sizeConfig = {
    sm: {
      iconSize: 'w-8 h-8',
      iconPadding: 'p-2',
      iconText: 'text-lg',
      titleText: 'text-2xl',
      taglineText: 'text-sm',
      spacing: 'mb-2',
      taglineSpacing: 'mb-1'
    },
    md: {
      iconSize: 'w-12 h-12',
      iconPadding: 'p-3',
      iconText: 'text-xl',
      titleText: 'text-3xl',
      taglineText: 'text-base',
      spacing: 'mb-3',
      taglineSpacing: 'mb-2'
    },
    lg: {
      iconSize: 'w-28 h-28',
      iconPadding: 'p-6',
      iconText: 'text-6xl',
      titleText: 'text-5xl',
      taglineText: 'text-lg',
      spacing: 'mb-6',
      taglineSpacing: 'mb-3'
    },
    xl: {
      iconSize: 'w-24 h-24',
      iconPadding: 'p-5',
      iconText: 'text-4xl',
      titleText: 'text-6xl',
      taglineText: 'text-xl',
      spacing: 'mb-8',
      taglineSpacing: 'mb-4'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`text-center ${className}`}>
      {/* Premium N Logo with Multi-Color Gradient */}
      <div className={`mx-auto ${config.iconSize} ${config.spacing} relative group cursor-pointer aspect-square`}>
        {/* Enhanced Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-violet-500/20 via-fuchsia-500/20 to-orange-500/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500" />
        
        {/* Geometric pattern background */}
        <div className="absolute inset-0 rounded-3xl opacity-10 group-hover:opacity-15 transition-opacity duration-500 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: `
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(139, 92, 246, 0.1) 2px, rgba(139, 92, 246, 0.1) 4px),
              repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(34, 211, 238, 0.1) 2px, rgba(34, 211, 238, 0.1) 4px)
            `
          }} />
        </div>
        
        {/* Main logo container - Perfect Square with Large Rounded Corners */}
        <div className="relative w-full h-full rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 overflow-hidden logo-container"
             style={{
               background: 'var(--logo-bg)',
               border: '1px solid var(--logo-border)',
               boxShadow: `
                 0 0 30px rgba(34, 211, 238, 0.3),
                 0 0 60px rgba(139, 92, 246, 0.25),
                 0 0 90px rgba(236, 72, 153, 0.2),
                 inset 0 1px 0 var(--logo-inner-highlight),
                 inset 0 -1px 0 var(--logo-inner-shadow)
               `
             }}>
          
          {/* Sophisticated gradient mesh overlay */}
          <div 
            className="absolute inset-1 rounded-2xl opacity-40"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 60% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)
              `
            }}
          />
          
          {/* Crystal facet effects */}
          <div className="absolute inset-3 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/10 to-transparent rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-violet-400/10 to-transparent rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-pink-400/10 to-transparent rounded-br-xl" />
          </div>
          
          {/* The Bold Geometric N with Multi-Color Gradient */}
          <span 
            className={`${config.iconText} font-black relative z-20 transition-all duration-300 group-hover:scale-110`}
            style={{
              fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
              fontWeight: '900',
              letterSpacing: '0.05em',
              fontStretch: 'expanded',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 25%, #d946ef 50%, #ec4899 75%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))',
              textShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(236, 72, 153, 0.4)',
              WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.1)'
            }}
          >
            N
          </span>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute top-6 right-6 w-1 h-1 bg-violet-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-pink-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-6 right-4 w-1 h-1 bg-orange-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          
          {/* Enhanced inner glow effect */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.1) 0%, transparent 60%),
                radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 60%),
                radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)
              `,
              mixBlendMode: 'overlay'
            }}
          />
          
          {/* Prismatic shine effect overlay */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `
                linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.1) 100%),
                linear-gradient(45deg, transparent 40%, rgba(34, 211, 238, 0.1) 50%, transparent 60%)
              `,
              mixBlendMode: 'overlay'
            }}
          />
        </div>
        
        {/* Enhanced orbit rings system */}
        <div className="absolute inset-0 animate-spin-slow opacity-25">
          <div className="w-full h-full border border-blue-400/50 rounded-full" style={{ borderStyle: 'dashed' }} />
        </div>
        <div className="absolute inset-[-6px] animate-spin-slow opacity-20" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
          <div className="w-full h-full border border-violet-400/40 rounded-full" />
        </div>
        <div className="absolute inset-[-12px] animate-spin-slow opacity-15" style={{ animationDirection: 'normal', animationDuration: '45s' }}>
          <div className="w-full h-full border border-pink-400/30 rounded-full" style={{ borderStyle: 'dotted' }} />
        </div>
        <div className="absolute inset-[-18px] animate-spin-slow opacity-10" style={{ animationDirection: 'reverse', animationDuration: '55s' }}>
          <div className="w-full h-full border border-orange-400/25 rounded-full" />
        </div>
      </div>
      
      {/* Nexus Text with premium typography */}
      <div className="relative">
        <h1 
          className={`${config.titleText} font-black tracking-tight ${config.taglineSpacing} transition-all duration-500 hover:scale-105`}
          style={{
            fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
            background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 25%, #8b5cf6 50%, #ec4899 75%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 4s ease infinite'
          }}
        >
          Nexus
        </h1>
        
        {/* Subtitle glow effect */}
        <div className="absolute inset-0 blur-sm">
          <h1 
            className={`${config.titleText} font-black tracking-tight ${config.taglineSpacing} opacity-20`}
            style={{
              fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
              background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 25%, #8b5cf6 50%, #ec4899 75%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: 'gradient-shift 4s ease infinite'
            }}
          >
            Nexus
          </h1>
        </div>
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <p 
          className={`${config.taglineText} font-medium text-muted-foreground dark:text-gray-300 transition-colors duration-500 hover:text-foreground`}
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Your vibrant campus community
        </p>
      )}
      
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full opacity-40"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animation: `twinkle ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default NexusLogo
