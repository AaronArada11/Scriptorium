
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import {
  FileText,
  Upload,
  MessageSquare,
  Settings,
  Users,
  Search,
  MoreVertical,
  File,
  Image as ImageIcon,
  FileSpreadsheet,
  Clock,
  UserPlus,
  Edit,
  Bot,
  Plus,
  Home,
  FolderOpen
} from "lucide-react";

export default function DashboardPage () {


    return (
        <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="size-6 text-primary" />
              <span className="font-bold">Scriptorium</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">Marketing Team Workspace</span>
          </div>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Button variant="outline" size="sm">
              <Users className="size-4 mr-2" />
              Invite
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    ) 
}
