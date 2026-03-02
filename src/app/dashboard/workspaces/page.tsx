'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import TextType from '@/components/TextType'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  BotMessageSquare, 
  Lock, 
  ClockFading, 
  Cloud,
  CheckCircle,
  ArrowRight,
  Upload,
  MessageSquare,
  AppWindowMac,
  Play
} from "lucide-react";

const features = [
    {
      icon: AppWindowMac,
      title: "Team Workspaces",
      description: "Create shared workspaces where your team can collaborate seamlessly on documents and projects."
    },
    {
      icon: BotMessageSquare,
      title: "AI Assistant",
      description: "Intelligent AI that understands your entire workspace by indexing all uploaded files and documents."
    },
    {
      icon: Upload,
      title: "Shared File Library",
      description: "Upload PDFs, documents, datasets, and images accessible to all workspace members."
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Edit documents together with live updates and see changes as they happen."
    },
    {
      icon: Lock,
      title: "Role-Based Permissions",
      description: "Control access with owner, editor, and viewer roles for enhanced security."
    },
    {
      icon: ClockFading,
      title: "Activity Timeline",
      description: "Track all edits, uploads, invites, and AI actions in a comprehensive activity feed."
    }
  ];

  const demoVideos = [
    {
      title: "Getting Started",
      description: "Learn how to create your first workspace and invite team members",
      duration: "2:30"
    },
    {
      title: "AI Assistant",
      description: "Discover how to leverage AI to analyze your documents and files",
      duration: "3:15"
    },
    {
      title: "Collaboration",
      description: "See how real-time collaboration works in Scriptorium",
      duration: "2:45"
    }
  ];

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
                            cursorCharacter="|"
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

                <div>
                    <div className='mt-16 rounded-lg shadow-2xl overflow-hidden border border-border'>
                        <div className='bg-[#232C33] px-4 py-3 flex items-center gap-2'>
                            <div className='size-3 rounded-full bg-red-500'></div>
                            <div className='size-3 rounded-full bg-yellow-500'></div>
                            <div className='size-3 rounded-full bg-green-500'></div>
                        </div>
                    </div>
                    <div className="bg-card p-8 grid md:grid-cols-2 gap-6">
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="size-5 text-primary" />
                                <span className="font-semibold">Documents</span>
                            </div>
                            <div className='space-y-2'>
                                {["Research Notes.pdf","Reaserch Methods.docx","Revised.pptx"].map((file) => (
                                <div key={file} className='flex items-center gap-2 p-2 bg-muted rounded'>
                                    <FileText className='size-4 text-muted-foreground' />
                                    <span className='text-sm'>{file}</span>
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <BotMessageSquare className="size-5 text-primary" />
                                <span className="font-semibold">AI Assistant</span>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-primary/10 p-3 rounded text-sm">
                                What are the key insights from our Research Notes?
                                </div>
                                <div className="bg-muted p-3 rounded text-sm">
                                Based on your Research Notes document, the three main priorities are...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Video Demos Section */}
      <section className="bg-card py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              See Scriptorium in Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Watch quick demos of our most powerful features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {demoVideos.map((video, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {/* Video placeholder - replace with actual video embed */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="size-8 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  {/* Thumbnail text */}
                  <div className="text-6xl font-bold text-primary/20">
                    {index + 1}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription className='p-2.5'>{video.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Want to add your own demo videos? Replace the placeholders above with embedded YouTube or Vimeo videos
            </p>
            <code className="text-xs bg-muted px-3 py-1 rounded">
              {'<iframe src="https://www.youtube.com/embed/VIDEO_ID" ... />'}
            </code>
          </div>
        </div>
      </section>

            {/*Feature Section*/}
            <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                Everything you need to collaborate
                </h2>
                <p className="text-xl text-muted-foreground">
                Powerful features designed for modern teams
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature) => (
                <Card key={feature.title} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                    <div className="size-12 bg-[#CCDAD1] rounded-lg flex items-center justify-center mb-4 ">
                        <feature.icon className="size-6 text-[#788585]" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className='p-2.5'>{feature.description}</CardDescription>
                    </CardHeader>
                </Card>
                ))}
            </div>
            </div>
        </section>
        </div>
    )
}