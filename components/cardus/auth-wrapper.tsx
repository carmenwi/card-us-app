'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { loadUser } from '@/lib/auth'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    
    // Skip auth check if on login page
    if (pathname === '/login') return

    const user = loadUser()
    if (!user) {
      router.push('/login')
    }
  }, [pathname, router])

  // Don't render anything until hydrated to avoid mismatch
  if (!isHydrated) {
    return <>{children}</>
  }

  // Check auth after hydration
  if (pathname !== '/login') {
    const user = loadUser()
    if (!user) {
      return null
    }
  }

  return <>{children}</>
}
