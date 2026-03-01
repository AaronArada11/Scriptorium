'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function UserSync() {
  const { user, isLoaded } = useUser()
  const storeUser = useMutation(api.users.storeUser)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (isLoaded && user && !synced) {
      // Sync user to Convex on login
      storeUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || user.username || user.firstName || 'Anonymous',
      }).then(() => {
        setSynced(true)
      }).catch((error) => {
        console.error('Failed to sync user:', error)
      })
    }
  }, [user, isLoaded, synced, storeUser])

  // This component doesn't render anything
  return null
}
