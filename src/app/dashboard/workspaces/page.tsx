"use client"

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Plus,
  Users,
  Settings,
  Clock,
  Folder,
  TrendingUp,
  MessageSquare,
  Search,
  ChevronRight,
  Sparkles,
  Building2,
  Crown,
  UserPlus,
  Calendar
} from "lucide-react";

export default function DashboardPage() {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false)
  const workspaces = useQuery(api.workspaces.getWorkspaces)
  const workspaceMembers = useQuery(api.members.getUserMemberships)

  const teams = workspaces?.filter(ws => ws != null).map((ws, index) => ({
    id: ws._id,
    name: ws.name,
    description: ws.description || "",
    role: workspaceMembers?.find(m => m.workspaceId === ws._id)?.role || "Viewer",
    members: 0, // TODO: query member count
    files: 0,   // TODO: query file count  
    documents: 0,
    lastActivity: "Just now",
    color: ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-amber-500"][index % 4],
    icon: ws.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  })) || []
    const recentActivity = [
    { id: 1, team: "Marketing Team", action: "uploaded new brand guidelines", user: "Sarah Chen", time: "2 hours ago", icon: FileText },
    { id: 2, team: "Product Development", action: "created product roadmap", user: "Mike Johnson", time: "5 hours ago", icon: FileText },
    { id: 3, team: "Sales Team", action: "invited 3 new members", user: "Emily Davis", time: "1 day ago", icon: UserPlus },
    { id: 4, team: "Marketing Team", action: "asked AI about Q1 priorities", user: "David Kim", time: "1 day ago", icon: MessageSquare },
  ];

  // Quick stats
  const stats = [
    { label: "Total Teams", value: "4", icon: Building2, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Documents", value: "150", icon: FileText, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/30" },
    { label: "Team Members", value: "40", icon: Users, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/30" },
    { label: "Active Today", value: "28", icon: TrendingUp, color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/30" },
  ];

  const handleCreateTeam = () => {
    // In a real app, this would create the team
    console.log("Creating team:", teamName, teamDescription);
    setIsCreateTeamOpen(false);
    setTeamName("");
    setTeamDescription("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="size-6 text-primary" />
              <span className="font-bold text-xl">Scriptorium</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search teams, files..." className="pl-9 w-64" />
            </div>
            <DarkModeToggle />
            <Button variant="outline" size="sm">
              <Settings className="size-4" />
            </Button>
            <UserButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your teams and recent activity.
            </p>
          </div>
          <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="size-5" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Team</DialogTitle>
                <DialogDescription>
                  Set up a collaborative workspace for your team. You can invite members after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="e.g., Marketing Team"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Input
                    id="team-description"
                    placeholder="What's this team for?"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} disabled={!teamName.trim() || isCreating}>
                  {isCreating ? 'Creating...' : 'Create Team'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`size-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Teams Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Teams</h2>
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <Link key={team.id} href={`/workspace/${team.id}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className={`size-12 ${team.color}`}>
                          <AvatarFallback className="text-primary bg-[#edf2f9] font-bold">
                            {team.icon}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription>{team.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        {team.role === "Owner" && <Crown className="size-3" />}
                        {team.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="font-semibold">{team.members}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Files</p>
                        <p className="font-semibold">{team.files}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Docs</p>
                        <p className="font-semibold">{team.documents}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>Active {team.lastActivity}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across all your teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span>
                          {" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{activity.team}</Badge>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Folder className="size-4 mr-2" />
                  Browse All Files
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="size-4 mr-2" />
                  Recent Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="size-4 mr-2" />
                  Team Directory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="size-4 mr-2" />
                  Activity Calendar
                </Button>
              </CardContent>
            </Card>

            {/* AI Tip */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <CardTitle className="text-lg">AI Tip</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ask the AI assistant to summarize activity across all your teams or find specific information in any workspace.
                </p>
                <Button variant="default" size="sm" className="w-full mt-4">
                  <MessageSquare className="size-4 mr-2" />
                  Try AI Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
