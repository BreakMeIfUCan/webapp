import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Target, ArrowRight, Play, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-8 px-4 py-2 text-sm font-medium">
            <Shield className="mr-2 h-4 w-4" />
            AI Security Platform
          </Badge>
          
          {/* Main Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
            Break your AI models
            <span className="block text-muted-foreground">before hackers do</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
            The only AI red team platform that finds vulnerabilities, simulates attacks, 
            and provides defense recommendations. Secure your AI before it's too late.
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 py-4 text-lg font-semibold">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          
          {/* Feature Cards */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card">
                  <Shield className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Find Vulnerabilities</h3>
                <p className="mt-3 text-muted-foreground">
                  Discover security flaws, bias, and backdoors in your AI models with our comprehensive scanning engine.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card">
                  <Zap className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Run Attack Simulations</h3>
                <p className="mt-3 text-muted-foreground">
                  Execute real-world attacks safely in our sandbox environment. Test adversarial examples and prompt injections.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card">
                  <Target className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">Deploy Securely</h3>
                <p className="mt-3 text-muted-foreground">
                  Get actionable defense recommendations and deploy your AI models with confidence using our security toolkit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}