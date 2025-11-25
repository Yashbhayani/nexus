import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Default placeholder images for different contexts
const DEFAULT_IMAGES = {
  event: 'https://images.unsplash.com/photo-1634155938686-24a26c55d71a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBhdWRpZW5jZXxlbnwxfHx8fDE3NjM4MzUyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  organization: 'https://images.unsplash.com/photo-1580849279061-0179c4ebf14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBncm91cCUyMHBlb3BsZXxlbnwxfHx8fDE3NjM3NTM4ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  post: 'https://images.unsplash.com/photo-1646038572815-43fe759e459b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwcHVycGxlfGVufDF8fHx8MTc2Mzc4Mzc5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  banner: 'https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNjM4NjE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  default: 'https://images.unsplash.com/photo-1646038572815-43fe759e459b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwcHVycGxlfGVufDF8fHx8MTc2Mzc4Mzc5MXww&ixlib=rb-4.1.0&q=80&w=1080'
}

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'event' | 'organization' | 'post' | 'banner' | 'default';
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, fallbackType = 'default', ...rest } = props

  // Use default image if src is empty, null, or undefined
  const imageSrc = src || DEFAULT_IMAGES[fallbackType]

  // Use fallback image if there was an error or no source provided
  const shouldUseFallback = didError || !src

  return shouldUseFallback ? (
    <img 
      src={DEFAULT_IMAGES[fallbackType]} 
      alt={alt || 'Placeholder image'} 
      className={className} 
      style={style} 
      {...rest}
      onError={() => {
        // If even the fallback fails, show the error SVG (handled by outer logic)
      }}
    />
  ) : (
    <img src={imageSrc} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}