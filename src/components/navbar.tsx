"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Shield, Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      } else {
        setUser(null)
        router.push("/")
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-black bg-black">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">BreakMeIfYouCan</span>
          </Link>


          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-black hover:text-gray-600"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <UserIcon className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="border-black text-black hover:bg-black hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-black hover:text-gray-600"
                  onClick={() => router.push("/auth/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => router.push("/auth/signup")}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/features"
                className="block px-3 py-2 text-base font-medium text-black hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 text-base font-medium text-black hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="block px-3 py-2 text-base font-medium text-black hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </Link>
              
              {/* Mobile Auth */}
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-black"
                      onClick={() => {
                        router.push("/dashboard")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Dashboard
                    </Button>
                    <div className="px-3 py-2 text-sm text-gray-600 flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {user.email}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-black text-black hover:bg-black hover:text-white"
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-black"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button 
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      onClick={() => {
                        router.push("/auth/login")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
