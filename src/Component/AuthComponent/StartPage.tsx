import { useState, useEffect, useRef } from "react";
import { Button } from "../../UI/button";
import { Input } from "../../UI/input";
import { Label } from "../../UI/label";
import { Card, CardContent, CardFooter, CardHeader } from "../../UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../UI/tabs";
import { 
  Eye, 
  EyeOff, 
  Users,
  Music,
  Calendar,
  Camera,
  Trophy,
  Star,
  MapPin,
  Coffee,
  Heart,
  Zap,
  Gamepad2,
  Mic,
  PartyPopper,
  BookOpen,
  GraduationCap,
  Pizza,
  Palette,
  Rocket,
  Globe,
  Lightbulb,
  Crown,
  Diamond,
  Sparkles,
  Film,
  Headphones,
  Car,
  Plane,
  Gift,
  Medal,
  Feather,
  Briefcase,
  PaintBucket,
  TreePine,
  Flame,
  Snowflake,
  Sun
} from "lucide-react";
import NexusLogo from "../../Common/NexusLogo";


interface StartPageProps {
  onLogin: () => void;
}
const StartPage = ({ onLogin }: StartPageProps) => {
   const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);

  // Cursor halo effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseLeave = () => {
      setCursorPosition(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  // Orbiting icons - Inner ring (10 icons)
  const innerRingIcons = [
    { Icon: Music, color: '#ff6b6b', delay: 0 },
    { Icon: Calendar, color: '#4ecdc4', delay: 1 },
    { Icon: Camera, color: '#45b7d1', delay: 2 },
    { Icon: Trophy, color: '#ffd93d', delay: 3 },
    { Icon: Star, color: '#ff9ff3', delay: 4 },
    { Icon: MapPin, color: '#54a0ff', delay: 5 },
    { Icon: Coffee, color: '#ff9f43', delay: 6 },
    { Icon: Heart, color: '#ff6b6b', delay: 7 },
    { Icon: BookOpen, color: '#6c5ce7', delay: 8 },
    { Icon: GraduationCap, color: '#74b9ff', delay: 9 }
  ];

  // Orbiting icons - Outer ring (12 icons)
  const outerRingIcons = [
    { Icon: Gamepad2, color: '#6c5ce7', delay: 0 },
    { Icon: Mic, color: '#fd79a8', delay: 1 },
    { Icon: PartyPopper, color: '#fdcb6e', delay: 2 },
    { Icon: Pizza, color: '#ff7675', delay: 3 },
    { Icon: Palette, color: '#fd79a8', delay: 4 },
    { Icon: Rocket, color: '#00b894', delay: 5 },
    { Icon: Globe, color: '#0984e3', delay: 6 },
    { Icon: Lightbulb, color: '#fdcb6e', delay: 7 },
    { Icon: Briefcase, color: '#8e44ad', delay: 8 },
    { Icon: Film, color: '#e74c3c', delay: 9 },
    { Icon: Headphones, color: '#3498db', delay: 10 },
    { Icon: Gift, color: '#f39c12', delay: 11 }
  ];

  // Static side icons - More student-friendly campus icons
  const sideIcons = [
    // Left side icons
    { Icon: BookOpen, position: { top: '15%', left: '3%' }, color: '#6366f1', size: 'w-6 h-6' },
    { Icon: GraduationCap, position: { top: '25%', left: '5%' }, color: '#8b5cf6', size: 'w-7 h-7' },
    { Icon: Coffee, position: { top: '35%', left: '2%' }, color: '#f59e0b', size: 'w-5 h-5' },
    { Icon: Calendar, position: { top: '45%', left: '4%' }, color: '#10b981', size: 'w-6 h-6' },
    { Icon: Users, position: { top: '55%', left: '3%' }, color: '#06b6d4', size: 'w-6 h-6' },
    { Icon: Trophy, position: { top: '65%', left: '5%' }, color: '#fbbf24', size: 'w-7 h-7' },
    { Icon: Music, position: { top: '75%', left: '2%' }, color: '#f472b6', size: 'w-5 h-5' },
    { Icon: Camera, position: { top: '85%', left: '4%' }, color: '#a78bfa', size: 'w-6 h-6' },
    
    // Right side icons
    { Icon: Lightbulb, position: { top: '12%', right: '3%' }, color: '#fbbf24', size: 'w-6 h-6' },
    { Icon: Rocket, position: { top: '22%', right: '5%' }, color: '#3b82f6', size: 'w-7 h-7' },
    { Icon: Heart, position: { top: '32%', right: '2%' }, color: '#ef4444', size: 'w-5 h-5' },
    { Icon: Globe, position: { top: '42%', right: '4%' }, color: '#059669', size: 'w-6 h-6' },
    { Icon: Zap, position: { top: '52%', right: '3%' }, color: '#f59e0b', size: 'w-6 h-6' },
    { Icon: Gamepad2, position: { top: '62%', right: '5%' }, color: '#8b5cf6', size: 'w-7 h-7' },
    { Icon: Palette, position: { top: '72%', right: '2%' }, color: '#ec4899', size: 'w-5 h-5' },
    { Icon: Mic, position: { top: '82%', right: '4%' }, color: '#06b6d4', size: 'w-6 h-6' },
    
    // Additional scattered icons
    { Icon: Star, position: { top: '8%', left: '12%' }, color: '#fbbf24', size: 'w-5 h-5' },
    { Icon: Sparkles, position: { top: '90%', left: '15%' }, color: '#a78bfa', size: 'w-5 h-5' },
    { Icon: Crown, position: { top: '6%', right: '12%' }, color: '#f59e0b', size: 'w-5 h-5' },
    { Icon: Diamond, position: { top: '92%', right: '15%' }, color: '#06b6d4', size: 'w-5 h-5' },
    { Icon: PartyPopper, position: { bottom: '8%', left: '8%' }, color: '#f472b6', size: 'w-6 h-6' },
    { Icon: Gift, position: { bottom: '6%', right: '8%' }, color: '#10b981', size: 'w-6 h-6' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Theme-Aware Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-950 transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-indigo-100/30 dark:from-background/20 dark:via-transparent dark:to-background/20 transition-colors duration-500" />
      
      {/* Aurora/Flowing Light Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-wave aurora-wave-1" />
        <div className="aurora-wave aurora-wave-2" />
        <div className="aurora-wave aurora-wave-3" />
      </div>

      {/* Dynamic Spotlights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="dynamic-spotlight spotlight-1" />
        <div className="dynamic-spotlight spotlight-2" />
        <div className="dynamic-spotlight spotlight-3" />
      </div>

      {/* Cursor Halo */}
      {cursorPosition && (
        <div
          className="fixed pointer-events-none z-30"
          style={{
            left: cursorPosition.x - 12,
            top: cursorPosition.y - 12,
            width: '24px',
            height: '24px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(34, 211, 238, 0.2) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            mixBlendMode: 'screen'
          }}
        />
      )}

      {/* Static Side Icons - Student Campus Theme */}
      {sideIcons.map(({ Icon, position, color, size }, i) => (
        <div
          key={`side-${i}`}
          className="absolute animate-pulse opacity-30 dark:opacity-50 transition-opacity duration-500"
          style={{
            ...position,
            color,
            filter: `drop-shadow(0 0 3px ${color}30) drop-shadow(0 0 6px ${color}15)`,
          }}
        >
          <Icon className={`${size} floating-pulse-soft`} />
        </div>
      ))}

      {/* Main Content Container - Center positioning for orbiting system */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="relative">
          {/* Inner Ring Orbiting Icons - Softer glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            {innerRingIcons.map(({ Icon, color, delay }, i) => (
              <div
                key={`inner-${i}`}
                className={`absolute animate-orbit-card-inner-${i + 1} opacity-65`}
                style={{
                  color,
                  filter: `drop-shadow(0 0 4px ${color}40) drop-shadow(0 0 8px ${color}20)`,
                }}
              >
                <Icon className="w-6 h-6 soft-icon-glow" />
              </div>
            ))}
          </div>

          {/* Outer Ring Orbiting Icons - Softer glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            {outerRingIcons.map(({ Icon, color, delay }, i) => (
              <div
                key={`outer-${i}`}
                className={`absolute animate-orbit-card-outer-${i + 1} opacity-60`}
                style={{
                  color,
                  filter: `drop-shadow(0 0 4px ${color}40) drop-shadow(0 0 8px ${color}20)`,
                }}
              >
                <Icon className="w-7 h-7 soft-icon-glow" />
              </div>
            ))}
          </div>

          {/* Central Content */}
          <div className="w-full max-w-4xl relative z-20">
            {/* Enhanced Nexus Logo */}
            <div className="mb-8 animate-fade-in">
              <NexusLogo size="lg" showTagline={false} />
            </div>

            {/* Login Card */}
            <div className="transition-all duration-300 ease-out">
              <Card className="premium-glass-card premium-card-glow backdrop-blur-xl bg-card/95 border border-border/50 dark:border-white/10 shadow-2xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/30 border border-border/20 dark:bg-white/5 dark:border-white/10">
                    <TabsTrigger 
                      value="login" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold transition-all duration-300"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold transition-all duration-300"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <TabsContent value="login">
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium text-card-foreground">
                          Username
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          required
                          className="premium-glass-input h-11 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            className="premium-glass-input h-11 pr-10 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted/20"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3">
                      <Button
                        type="submit"
                        className="w-full h-11 premium-gradient-button premium-button-glow"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </CardFooter>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium text-card-foreground">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Alex"
                            required
                            className="premium-glass-input h-10 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium text-card-foreground">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Chen"
                            required
                            className="premium-glass-input h-10 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="alex.chen@university.edu"
                          required
                          className="premium-glass-input h-10 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword" className="text-sm font-medium text-card-foreground">
                          Password
                        </Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          placeholder="••••••••"
                          required
                          className="premium-glass-input h-10 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="academicLevel" className="text-sm font-medium text-card-foreground">
                            Academic Level
                          </Label>
                          <Input
                            id="academicLevel"
                            type="text"
                            placeholder="Undergraduate"
                            required
                            className="premium-glass-input h-10 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="major" className="text-sm font-medium text-card-foreground">
                            Major
                          </Label>
                          <Input
                            id="major"
                            type="text"
                            placeholder="Computer Science"
                            required
                            className="premium-glass-input h-10 text-foreground placeholder:text-muted-foreground bg-input border-border/30 focus:border-primary/50"
                          />
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full h-11 premium-gradient-button premium-button-glow"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Creating account...
                          </div>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage
