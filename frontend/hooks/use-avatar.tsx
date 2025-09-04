'use client'

import { useState, useEffect } from 'react'

export function useAvatar(src?: string) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!src) {
      setHasError(false)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setHasError(false)

    const img = new Image()
    
    img.onload = () => {
      setIsLoading(false)
      setHasError(false)
    }
    
    img.onerror = () => {
      setIsLoading(false)
      setHasError(true)
    }
    
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  const shouldShowFallback = !src || hasError || isLoading

  return {
    hasError,
    isLoading,
    shouldShowFallback
  }
}