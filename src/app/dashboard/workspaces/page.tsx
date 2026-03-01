'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import TextType from '@/components/TextType'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from 'next/link'


export default function DashboardPage () {
    const workspaces = useQuery(api.workspaces.getWorkspaces)
    const createWorkspace = useMutation(api.workspaces.createWorkspace)

    return (
        <div className='min-h-screen bg-background'>
            <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24'>
                <div className='text-center max-w-4xl mx-auto'>
                    <h1 className='text-5xl md:text-7xl font-bold mb-6'>
                        Your Team's{" "}
                        <span className='text-primary'>
                        <TextType 
                            text={["Workspace", "Collaboration Tool", "AI Assistant", "Knowledge Hub"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor
                            cursorCharacter="_"
                            />
                        </span>
                    </h1>
                    <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
                        Scriptorium is a collaborative workspace where teams upload files, 
                        create documents, and leverage AI to unlock insights from their collective knowledge.
                    </p>
                    <div className='flex gap-4 justify-center flex-wrap'>
                        <Link href="/workspace/demo">
                            <Button size="lg" className="text-lg px-8">
                                Try Demo Workspace
                                <ArrowRight className="ml-2 size-5" />
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline" className='text-lg px-8'>
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>

                
            </section>
        </div>
    )
}