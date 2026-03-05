'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import DashboardPage from './dashboard/workspaces/page'
import LandingPage from '@/app/marketing/page'

export default function Home() {
  return (
    <>
      <Authenticated>
        <DashboardPage />
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </>
  )
}