import { Home, Search, Calendar, User } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { NexusLogo } from "../common/NexusLogo";

interface LeftNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function LeftNav({ activeTab, onTabChange }: LeftNavProps) {
  const navItems = [
    {
      id: "home",
      label: "Feed",
      icon: Home,
    },
    {
      id: "discover", 
      label: "Explore",
      icon: Search,
    },
    {
      id: "events",
      label: "Events", 
      icon: Calendar,
    },
    {
      id: "profile",
      label: "My Org",
      icon: User,
    },
  ];

  return (
    <aside 
      className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40" 
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-20 px-6 py-4 border-b border-sidebar-border">
          <NexusLogo size="sm" showTagline={false} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => onTabChange(item.id)}
                aria-label={`${item.label} - ${isActive ? 'current page' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            <span className="font-bold">nexus</span> v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}