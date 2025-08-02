import Image from "next/image"
import { cn } from "@/lib/utils"

interface TeamProps {
  name?: string
  logo?: string
  className?: string
  textColor?: string
}

export const Team = ({ name, logo, className, textColor }: TeamProps) => (
  <div
    className={cn(
      "flex gap-3 border p-2 rounded-md shadow-md w-48 bg-transparent border-transparent items-center flex-col justify-center h-[148px]",
      className,
    )}
  >
    <div className="rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0 overflow-hidden w-16 h-16">
      {logo ? (
        <Image
          src={logo || "/placeholder.svg"}
          alt="logo"
          width={32}
          height={32}
          className="w-full h-full rounded-full object-cover"
        />
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
