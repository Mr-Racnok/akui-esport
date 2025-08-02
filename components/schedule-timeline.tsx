import { Team } from "@/components/team" // Import the new Team component
import { cn } from "@/lib/utils"
import * as Constants from "@/lib/constants"

interface ScheduleTimelineProps {
  className?: string
}

export default function ScheduleTimeline({ className }: ScheduleTimelineProps) {
  const defaultTeamName = "Nama Tim Placeholder Baru"
  const defaultLogo = "/path/to/new-placeholder-logo.png" // Using a new placeholder logo

  return (
    <div className={cn("p-6 text-foreground", className)}>
      <h2 className="text-md font-bold mb-8 text-center sm:text-left">Babak Penyisihan</h2>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600 ml-0"></div>

        {/* Timeline Item 1 */}
        <div className="mb-12 relative">
          <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 size-8 rounded-full border-2 bg-gray-800 flex justify-center text-sm items-center flex-col text-red-700 leading-7 mx-0 ml-[-15px] border-gray-500 mt-2.5"></div>
          <h3 className="text-sm font-semibold mb-0 ml-2.5 pt-[-10px] pt-[-16px] mt-0">19 Agustus 2025 Sesi 1</h3>
          <div className="flex items-center gap-4 ml-4 justify-start">
            <Team name={Constants.namaTeam1} logo={Constants.logoTeam1} />
            <span className="text-lg font-bold text-gray-400">VS</span>
            <Team name={Constants.namaTeam2} logo={Constants.logoTeam2} />
          </div>
        </div>

        {/* Timeline Item 2 */}
        <div className="mb-12 relative">
          <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 size-8 rounded-full border-2 bg-gray-800 flex justify-center text-sm items-center flex-col text-red-700 leading-7 mx-0 ml-[-15px] border-gray-500 mt-2.5"></div>
          <h3 className="text-sm font-semibold mb-0 ml-2.5 pt-[-10px] pt-[-16px] mt-0">19 Agustus 2025 Sesi 2</h3>
          <div className="flex items-center gap-4 ml-4">
            <Team name={Constants.namaTeam3} logo={Constants.logoTeam3} />
            <span className="text-lg font-bold text-gray-400">VS</span>
            <Team name={Constants.namaTeam4} logo={Constants.logoTeam4} />
          </div>
        </div>

        {/* Add more timeline items as needed */}
      </div>
    </div>
  )
}
