'use client'

import { useState } from 'react'
import { getSimpleLogo } from '../../lib/simpleLogos'
import { getAssetIcon } from '../../lib/assetIcons'

interface AssetLogoProps {
  symbol: string
  type: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showFallback?: boolean
  logoPath?: string | null
}

export function AssetLogo({ 
  symbol, 
  type, 
  size = 'md', 
  className = '',
  showFallback = true,
  logoPath = null
}: AssetLogoProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const logoData = getSimpleLogo(symbol, type)
  const iconConfig = getAssetIcon(symbol, type)
  
  // Lista de URLs para tentar em ordem de prioridade
  const getImageUrls = () => {
    const urls = []
    
    // 1. Imagem local baseada no símbolo
    urls.push(`/images/assets/${symbol.toLowerCase()}.png`)
    
    // 2. logoPath se existir
    if (logoPath && typeof logoPath === 'string') {
      if (logoPath.startsWith('/images/assets/')) {
        urls.push(logoPath)
      } else {
        const filename = logoPath.split('/').pop()
        urls.push(`/images/assets/${filename}`)
      }
    }
    
    // 3. URL externa do logoData
    if (logoData.url) {
      urls.push(logoData.url)
    }
    
    return urls
  }
  
  const imageUrls = getImageUrls()
  const currentImageUrl = imageUrls[currentImageIndex]
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  const containerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    // Tentar próxima imagem na lista
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
      setIsLoading(true)
    } else {
      // Todas as imagens falharam, mostrar fallback de ícone
      setIsLoading(false)
    }
  }

  // Se não há mais imagens para tentar e showFallback está ativo
  if (currentImageIndex >= imageUrls.length && showFallback) {
    const IconComponent = iconConfig.icon
    return (
      <div 
        className={`${containerSizeClasses[size]} ${iconConfig.bgColor} rounded-lg flex items-center justify-center ${className}`}
        title={`${symbol} - ${logoData.description}`}
      >
        <IconComponent className={`${sizeClasses[size]} ${iconConfig.color}`} />
      </div>
    )
  }

  // Se não há imagens válidas e não deve mostrar fallback
  if (currentImageIndex >= imageUrls.length) {
    return null
  }

  return (
    <div 
      className={`${containerSizeClasses[size]} rounded-lg overflow-hidden flex items-center justify-center ${className}`}
      title={`${symbol} - ${logoData.description}`}
    >
      {isLoading && (
        <div className={`${sizeClasses[size]} bg-gray-100 rounded animate-pulse`}></div>
      )}
      <img
        key={currentImageIndex} // Force re-render when image changes
        src={currentImageUrl}
        alt={`${symbol} logo`}
        className={`${sizeClasses[size]} object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  )
}

// Componente mais simples apenas com imagem
export function AssetImage({ 
  symbol, 
  type, 
  size = 'md', 
  className = '' 
}: AssetLogoProps) {
  const [imageError, setImageError] = useState(false)
  const logoData = getSimpleLogo(symbol, type)
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (imageError) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-gray-200 rounded-lg flex items-center justify-center shadow-sm ${className}`}
        title={symbol}
      >
        <span className="text-xs font-bold text-gray-600">
          {symbol.slice(0, 2)}
        </span>
      </div>
    )
  }

  return (
    <img
      src={logoData.url}
      alt={`${symbol} logo`}
      className={`${sizeClasses[size]} object-contain rounded-lg shadow-sm p-1 ${className}`}
      onError={() => setImageError(true)}
      title={`${symbol} - ${logoData.description}`}
      loading="lazy"
    />
  )
}