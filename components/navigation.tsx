"use client"

import Link from "next/link"

export function Navigation() {
  return (
    <header className="border-b border-border/50 glass-effect backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-start">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg glow-effect overflow-hidden">
            <img src="/xiaoprompt_logo.png" alt="XiaoPrompt Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-foreground">XiaoPrompt</span>
            <span className="text-xs text-muted-foreground font-mono tracking-wider">SUSTAINABLE AI PROMPTS</span>
          </div>
        </Link>
      </div>
    </header>
  )
}
