"use client"

import { useState, useEffect } from "react"
import { Home, Brain, Plus, Settings, LogOut, Shield, User as UserIcon, ChevronRight, Target } from "lucide-react"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Test Results",
      url: "/dashboard/results",
      icon: Target,
    },
    {
      title: "Create Test",
      url: "/dashboard/create",
      icon: Brain,
    }
  ]
}

// User Profile Component
function UserProfile({ user, isLoading, handleLogout }: {
  user: User | null
  isLoading: boolean
  handleLogout: () => void
}) {
  const getUserDisplayName = () => {
    if (!user) return "User"
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
    }
    return user.email?.split('@')[0] || "User"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase()
    }
    return user.email?.[0]?.toUpperCase() || "U"
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <div className="h-4 bg-muted animate-pulse rounded w-20 mb-1" />
          <div className="h-3 bg-muted animate-pulse rounded w-32" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <UserIcon className="h-4 w-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Not signed in</span>
          <span className="truncate text-xs text-muted-foreground">
            Please sign in to continue
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
        <AvatarFallback className="rounded-lg">
          {getUserInitials()}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{getUserDisplayName()}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Main Sidebar Component
function AppSidebar({ user, isLoading, handleLogout }: {
  user: User | null
  isLoading: boolean
  handleLogout: () => void
}) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">BreakMeIfYouCan</span>
            <span className="truncate text-xs text-muted-foreground">
              Model Testing Platform
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname === item.url}
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserProfile 
              user={user} 
              isLoading={isLoading} 
              handleLogout={handleLogout} 
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// Main Dashboard Sidebar Component
export function DashboardSidebar() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    const result = await supabase.auth.signOut()
    if (result.error) {
      console.error('Logout error:', result.error)
    } else {
      setUser(null)
      router.push("/auth/login")
    }
  }

  return <AppSidebar user={user} isLoading={isLoading} handleLogout={handleLogout} />
}
 
