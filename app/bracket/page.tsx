"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, Crown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import * as Constants from "@/lib/constants"

// --- Reusable Components for Bracket ---

const Team = ({
  name,
  logo,
  className,
  textColor,
}: { name?: string; logo?: string; className?: string; textColor?: string }) => (
  <div
    className={cn(
      "flex items-center gap-3 bg-zinc-800/80 border border-zinc-700 p-2 rounded-md shadow-md w-48 h-12",
      className,
    )}
  >
    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0">
      {logo ? (
        <img src={logo || "/placeholder.svg"} alt="logo" className="w-full h-full rounded-full object-cover" />
      ) : (
        "Logo"
      )}
    </div>
    <span
      className={cn(
        "text-sm uppercase font-normal text-zinc-200 truncate",
        name === "Juara" && "text-yellow-400",
        textColor,
      )}
    >
      {name || "Nama Tim"}
    </span>
  </div>
)

const Match = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex flex-col gap-2 px-2", className)}>{children}</div>
)

const Round = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex flex-col justify-around h-full gap-14 py-10", className)}>{children}</div>
)

const BracketColumn = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex flex-col justify-around items-center h-full px-0", className)}>{children}</div>
)

const FinalColumn = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex flex-col justify-center items-center h-full py-80 px-4", className)}>{children}</div>
)

export default function BracketPage() {
  const [zoom, setZoom] = useState(1)
  const bracketRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  const defaultTextColor = "text-white/100"
  const winnerTextColor = "text-orange-400"

  const defaultBorderColor = "border-white/20"
  const winnerBorderColor = "border-yellow-400/100"

  const calculateAndSetZoom = () => {
    if (bracketRef.current && containerRef.current) {
      const bracketWidth = bracketRef.current.scrollWidth
      const containerWidth = containerRef.current.clientWidth

      if (bracketWidth > 0 && containerWidth > 0) {
        const newZoom = Math.min((containerWidth / bracketWidth) * 0.99, 1.2)
        setZoom(newZoom)
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(calculateAndSetZoom, 100)
    window.addEventListener("resize", calculateAndSetZoom)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", calculateAndSetZoom)
    }
  }, [])

  useEffect(() => {
    if (bracketRef.current && containerRef.current) {
      const bracketWidth = bracketRef.current.scrollWidth
      const containerWidth = containerRef.current.clientWidth
      // Center the bracket horizontally
      containerRef.current.scrollLeft = (bracketWidth * zoom - containerWidth) / 2
    }
  }, [zoom])

  return (
    <main
      className="flex min-h-screen w-full flex-col items-center bg-background/80 backdrop-blur-[2px] font-bebas relative overflow-hidden"
      ref={containerRef}
    >
      <header ref={headerRef} className="absolute top-0 left-0 w-full p-4 sm:p-8 z-20 flex items-center">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl sm:text-3xl font-normal tracking-tighter text-foreground">Bagan Turnamen</h1>
      </header>

      <div className="w-full h-full flex items-center justify-center p-4 pt-70 overflow-hidden">
        <div
          ref={bracketRef}
          className="flex justify-center items-stretch text-foreground transition-transform duration-300 ease-in-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* --- LEFT BRACKET --- */}
          <div className="flex items-stretch">
            <Round>
              <Match>
                <Team
                  name={Constants.namaTeam1}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam1}
                />
                <Team
                  name={Constants.namaTeam2}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam2}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.namaTeam3}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam3}
                />
                <Team
                  name={Constants.namaTeam4}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam4}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.namaTeam5}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam5}
                />
                <Team
                  name={Constants.namaTeam6}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam6}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.namaTeam7}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam7}
                />
                <Team
                  name={Constants.namaTeam8}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam8}
                />
              </Match>
            </Round>
            <BracketColumn className="gap-24 py-16 w-6">
              <div className="relative h-16 w-8">
                <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-white/20 translate-y-1/2"></div>
              </div>
              <div className="relative h-16 w-8">
                <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
              <div className="relative h-16 w-8">
                <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
              <div className="relative h-16 w-8">
                <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
            </BracketColumn>
            <BracketColumn className="gap-24 py-16">
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
            </BracketColumn>

            <BracketColumn className="gap-24 py-16">
              <div className="relative h-40 w-8">
                <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
              <div className="relative h-40 w-8">
                <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
            </BracketColumn>

            <BracketColumn className="gap-48 py-28">
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
            </BracketColumn>
          </div>

          <BracketColumn className="h-1/1 gap-0 py-0">
            <div className="relative h-[calc(3/6*100%-14px)] w-8">
              <div className="absolute top-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-white/20"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
              <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-white/20"></div>
              <div className="absolute top-1/2 left-1/2 w-3/4 h-0.5 bg-white/20 -translate-y-1/2"></div>
            </div>
          </BracketColumn>

          {/* --- FINAL --- */}
          <FinalColumn>
            <Match>
              <div className="relative">
                <Crown className="absolute -top-4 -left-3 w-8 h-8 text-orange-400 transform -rotate-45 z-10 animate-burning" />
                <div className="relative p-[2px] rounded-lg animate-burning">
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={winnerTextColor}
                  className={winnerBorderColor}
                  logo={Constants.defaultNamaTeam}
                />
                </div>
              </div>
            </Match>
          </FinalColumn>

          <BracketColumn className="h-1/1 gap-0 py-0">
            <div className="relative h-[calc(3/6*100%-14px)] w-8">
              <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
              <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
              <div className="absolute bottom-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
              <div className="absolute top-1/2 right-1/2 w-3/4 h-0.5 bg-white/20 -translate-y-1/2"></div>
            </div>
          </BracketColumn>

          {/* --- RIGHT BRACKET --- */}
          <div className="flex items-stretch">
            <BracketColumn className="gap-48 py-28">
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
            </BracketColumn>

            <BracketColumn className="gap-24 py-16">
              <div className="relative h-40 w-8">
                <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 right-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
              <div className="relative h-40 w-8">
                <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 right-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
            </BracketColumn>

            <BracketColumn className="gap-24 py-16">
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.defaultNamaTeam}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.defaultLogoTeam}
                />
              </Match>
            </BracketColumn>

            <BracketColumn className="gap-24 py-16 w-6">
              <div className="relative h-16 w-8">
                <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 right-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
              <div className="relative h-16 w-8">
                <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 right-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
              <div className="relative h-16 w-8">
                <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 right-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
              <div className="relative h-16 w-8">
                <div className="absolute top-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-0.5 bg-white/20"></div>
                <div className="absolute top-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute bottom-0 right-1/2 w-0.5 h-1/2 bg-white/20"></div>
                <div className="absolute top-1/2 right-1/2 w-1/2 h-0.5 bg-white/20 -translate-y-1/2"></div>
              </div>
            </BracketColumn>

            <Round>
              <Match>
                <Team
                  name={Constants.namaTeam9}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam9}
                />
                <Team
                  name={Constants.namaTeam10}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam10}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.namaTeam11}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam11}
                />
                <Team
                  name={Constants.namaTeam12}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam12}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.namaTeam13}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam13}
                />
                <Team
                  name={Constants.namaTeam14}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam14}
                />
              </Match>
              <Match>
                <Team
                  name={Constants.namaTeam15}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam15}
                />
                <Team
                  name={Constants.namaTeam16}
                  textColor={defaultTextColor}
                  className={defaultBorderColor}
                  logo={Constants.logoTeam16}
                />
              </Match>
            </Round>
          </div>
        </div>
      </div>

      <div
        ref={controlsRef}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-card/80 backdrop-blur-sm p-2 rounded-lg border border-white/10 shadow-lg"
      >
        <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(0.2, z - 0.1))} className="h-8 w-8">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Slider
          value={[zoom]}
          onValueChange={(value) => setZoom(value[0])}
          min={0.2}
          max={1.5}
          step={0.1}
          className="w-32"
        />
        <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))} className="h-8 w-8">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={calculateAndSetZoom} className="h-8 w-8">
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </main>
  )
}
