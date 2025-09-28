"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

// Intersection Observer Hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}

// Debounce Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle Hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now())

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = Date.now()
      }
    }) as T,
    [callback, delay]
  )
}

// Performance Monitoring Hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<{
    loadTime?: number
    renderTime?: number
    memoryUsage?: number
  }>({})

  const measureRender = useCallback((componentName: string) => {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      const renderTime = end - start
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
      }))
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
      }
    }
  }, [])

  const measureLoad = useCallback((resourceName: string) => {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      const loadTime = end - start
      
      setMetrics(prev => ({
        ...prev,
        loadTime,
      }))
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${resourceName} load time: ${loadTime.toFixed(2)}ms`)
      }
    }
  }, [])

  // Monitor memory usage (if available)
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
        }))
      }

      updateMemoryUsage()
      const interval = setInterval(updateMemoryUsage, 5000)

      return () => clearInterval(interval)
    }
  }, [])

  return {
    metrics,
    measureRender,
    measureLoad,
  }
}

// Virtual Scrolling Hook
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    )

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex,
      items: items.slice(
        Math.max(0, startIndex - overscan),
        endIndex + 1
      ),
    }
  }, [items, itemHeight, containerHeight, scrollTop, overscan])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleItems.startIndex * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  }
}

// Image Preloading Hook
export function useImagePreload(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const preloadImages = async () => {
      const promises = urls.map(url => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image()
          
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, url]))
            resolve()
          }
          
          img.onerror = () => {
            setFailedImages(prev => new Set([...prev, url]))
            reject(new Error(`Failed to load image: ${url}`))
          }
          
          img.src = url
        })
      })

      try {
        await Promise.allSettled(promises)
      } catch (error) {
        console.warn('Some images failed to preload:', error)
      }
    }

    if (urls.length > 0) {
      preloadImages()
    }
  }, [urls])

  return {
    loadedImages: Array.from(loadedImages),
    failedImages: Array.from(failedImages),
    isLoaded: (url: string) => loadedImages.has(url),
    hasFailed: (url: string) => failedImages.has(url),
  }
}

// Bundle Size Monitoring Hook
export function useBundleSize() {
  const [bundleSize, setBundleSize] = useState<{
    js?: number
    css?: number
    total?: number
  }>({})

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const measureBundleSize = () => {
        const scripts = Array.from(document.querySelectorAll('script[src]'))
        const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        
        let jsSize = 0
        let cssSize = 0

        // Estimate script sizes (this is approximate)
        scripts.forEach(script => {
          const src = script.getAttribute('src')
          if (src && src.includes('_next/static')) {
            jsSize += 50 // Approximate KB per script
          }
        })

        // Estimate stylesheet sizes
        stylesheets.forEach(link => {
          const href = link.getAttribute('href')
          if (href && href.includes('_next/static')) {
            cssSize += 10 // Approximate KB per stylesheet
          }
        })

        setBundleSize({
          js: jsSize,
          css: cssSize,
          total: jsSize + cssSize,
        })
      }

      // Measure after initial load
      setTimeout(measureBundleSize, 1000)
    }
  }, [])

  return bundleSize
}

// Web Vitals Hook
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    lcp?: number
    fid?: number
    cls?: number
    fcp?: number
    ttfb?: number
  }>({})

  useEffect(() => {
    // This would typically use a library like web-vitals
    // For now, we'll create a placeholder implementation
    
    const measureVitals = () => {
      // Simulate vitals measurement
      if (process.env.NODE_ENV === 'development') {
        setVitals({
          lcp: Math.random() * 2000 + 1000, // 1-3 seconds
          fid: Math.random() * 100, // 0-100ms
          cls: Math.random() * 0.1, // 0-0.1
          fcp: Math.random() * 1500 + 500, // 0.5-2 seconds
          ttfb: Math.random() * 500 + 100, // 100-600ms
        })
      }
    }

    // Measure vitals after page load
    setTimeout(measureVitals, 2000)
  }, [])

  return vitals
}

// Missing import fix
import { useMemo } from 'react'
