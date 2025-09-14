import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SettingsIcon, UserIcon, LogOutIcon, CpuIcon } from "@/components/icons"

export function DashboardHeader() {
  return (
    <header className="border-b border-border/50 glass-effect backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg glow-effect overflow-hidden">
              <img src="/xiaoprompt_logo.png" alt="XiaoPrompt Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-foreground">XiaoPrompt</span>
              <span className="text-xs text-muted-foreground font-mono tracking-wider">AI EFFICIENCY PLATFORM</span>
            </div>
          </div>
          
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200"
            >
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass-effect border-border/50" align="end" forceMount>
            <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-colors">
              <UserIcon className="mr-3 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-colors">
              <SettingsIcon className="mr-3 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOutIcon className="mr-3 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
