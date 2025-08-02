"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { List, LoaderCircle, CalendarDays } from "lucide-react"
import CountdownTimer from "@/components/ui/countdown-timer"
import RegistrationForm from "@/components/ui/registration-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getRegisteredTeams } from "@/ai/flows/get-registered-teams-flow"
import ScheduleTimeline from "@/components/schedule-timeline" // Import the new schedule timeline component

export default function Home() {
  const registrationOpenDate = "2025-08-10T07:00:00" // Tanggal pendaftaran dibuka
  const registrationCloseDate = "2025-08-10T17:00:00" // Tanggal pendaftaran ditutup
  const [registeredTeamCount, setRegisteredTeamCount] = useState<number | null>(null)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isRegistrationPeriodActive, setIsRegistrationPeriodActive] = useState(false)
  const [isQuotaFullDialogOpen, setIsQuotaFullDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const maxTeams = 16

  // Function to fetch team count
  const fetchTeamCount = async () => {
    console.log("HomePage: Fetching team count...")
    try {
      const result = await getRegisteredTeams()
      console.log("HomePage: getRegisteredTeams returned:", result)
      if (result.success && result.teams) {
        setRegisteredTeamCount(result.teams.length)
        console.log("HomePage: Team count updated to:", result.teams.length)
      } else {
        console.error("HomePage: Failed to fetch team count:", result.error)
        setRegisteredTeamCount(0)
      }
    } catch (error) {
      console.error("HomePage: Error fetching team count:", error)
      setRegisteredTeamCount(0)
    }
  }

  // Effect to check registration period status
  useEffect(() => {
    const checkRegistrationPeriod = () => {
      const now = new Date()
      const openDate = new Date(registrationOpenDate)
      const closeDate = new Date(registrationCloseDate)
      setIsRegistrationPeriodActive(now >= openDate && now < closeDate)
    }

    checkRegistrationPeriod() // Check immediately on mount
    const interval = setInterval(checkRegistrationPeriod, 1000) // Check every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [registrationOpenDate, registrationCloseDate])

  // Fetch initial team count on mount
  useEffect(() => {
    fetchTeamCount()
  }, [])

  const handleRegistrationSuccess = () => {
    setIsRegisterDialogOpen(false) // Close the dialog
    fetchTeamCount() // Re-fetch count after successful registration
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background/80 backdrop-blur-[2px] p-4 md:p-8 font-body">
      {/* Logo MLBB dan AKUI - Diposisikan fixed di pojok kiri atas */}
      <div className="fixed top-0 left-0 z-50 flex items-center gap-4 p-4">
        <Image src="/MLBB.png" alt="MLBB Logo" width={120} height={120} className="object-contain" />
        <div className="flex gap-1">
          <div className="w-0.5 h-8 bg-white/30"></div>
          <div className="w-0.5 h-8 bg-white/30"></div>
        </div>
        <Image src="/Akui12.png" alt="AKUI Logo" width={90} height={90} className="object-contain" />
      </div>

      <div className="w-full max-w-7xl space-y-6 text-center flex flex-col items-center relative pb-20">
        <header className="pt-28">
          <h1
            className="text-5xl font-bold tracking-wide text-white sm:text-7xl font-jersey animate-flicker-white"
            style={{ animationDelay: "0.5s" }}
          >
            AKUI
          </h1>
          <h1
            className="text-5xl font-bold tracking-wide text-red-500 sm:text-6xl font-jersey animate-flicker-red"
            style={{ animationDelay: "0s" }}
          >
            MLBB E-SPORT
          </h1>
        </header>

        <div className="w-full max-w-lg mx-auto space-y-4">
          <CountdownTimer registrationOpenDate={registrationOpenDate} registrationCloseDate={registrationCloseDate} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="font-bold"
                  disabled={!isRegistrationPeriodActive}
                  onClick={async () => {
                    if (registeredTeamCount !== null && registeredTeamCount >= maxTeams) {
                      setIsQuotaFullDialogOpen(true)
                      return
                    }
                    setIsRegisterDialogOpen(true)
                  }}
                >
                  Register
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-headline">Form Pendaftaran</DialogTitle>
                </DialogHeader>
                <RegistrationForm
                  onRegistrationSuccess={handleRegistrationSuccess}
                  registrationOpenDate={registrationOpenDate}
                  registrationCloseDate={registrationCloseDate}
                  maxTeams={maxTeams}
                  currentTeamCount={registeredTeamCount || 0}
                />
              </DialogContent>
            </Dialog>
            <Link href="/bracket">
              <Button
                variant="outline"
                size="lg"
                className="font-bold hover:bg-gray-500/80 hover:text-white"
              >
                Bracket
              </Button>
            </Link>
            <Link href="/registered-team">
              <Button
                variant="outline"
                size="lg"
                className="font-bold hover:bg-gray-500/80 hover:text-white bg-transparent"
              >
                <List className="mr-2" />
                Registered Team
                {registeredTeamCount !== null ? (
                  <span className="ml-1">
                    ({registeredTeamCount} / {maxTeams})
                  </span>
                ) : (
                  <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </Link>
          </div>
          
          {/* Jadwal Pertandingan Button and Dialog */}
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="font-bold hover:bg-gray-500/80 hover:text-white bg-transparent"
              >
                <CalendarDays className="mr-2" />
                Jadwal Pertandingan
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-4xl h-[80vh] max-h-[90vh] overflow-y-auto flex flex-col">
              <DialogHeader>
                <DialogTitle>Jadwal Pertandingan</DialogTitle>
                <DialogDescription>Berikut adalah jadwal pertandingan yang akan datang.</DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-grow w-full rounded-md border p-4">
                <ScheduleTimeline />
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" className="text-black">
                    Tutup
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-muted-foreground">
                Syarat dan Ketentuan
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[80vw] h-[50vh] max-w-none overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Syarat dan Ketentuan</DialogTitle>
                <DialogDescription>Harap baca syarat dan ketentuan berikut dengan seksama.</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-full w-full rounded-md border p-4">
                <p className="text-sm text-left">
                  <strong>Syarat pendaftaran: </strong>
                </p>
                <p className="text-sm text-left">
                  1. Memiliki nama tim sendiri dan bersifat unique(tidak sama dengan tim lain).
                </p>
                <p className="text-sm text-left">
                  2. Memiliki 5 anggota dalam 1 tim (jika ada anggota yang tidak bisa hadir, maka boleh digantikan orang
                  lain yang belum terdaftar di tim lain).
                </p>
                <p className="text-sm text-left">
                  3. ID Mobile Legends harus valid dan tidak sedang dalam sanksi dari Moonton.
                </p>
                <br />
                <p className="text-sm text-left">
                  <strong>Persyaratan Pemain:</strong>
                </p>
                <p className="text-sm text-left">
                  1. Anggota tim harus merupakan karyawan daripada PT AKUI / PT OBI Jombang.
                </p>
                <br />
                <p className="text-sm text-left">
                  <strong>3. Jadwal Pertandingan:</strong> Jadwal akan diumumkan setelah pendaftaran ditutup. Tim
                  diharapkan untuk hadir 15 menit sebelum pertandingan dimulai.
                </p>
                <br />
                <p className="text-sm text-left">
                  <strong>4. Peraturan Pertandingan:</strong> Pertandingan akan menggunakan mode Custom Draft Pick.
                  Dilarang menggunakan cheat, bug, atau program ilegal lainnya.
                </p>
                <br />
                <p className="text-sm text-left">
                  <strong>5. Hadiah:</strong> Total hadiah sebesar Rp 10.000,00 akan dibagikan kepada 2 tim teratas.
                </p>
                <br />
                <p className="text-sm text-left">
                  <strong>6. Fair Play:</strong> Sportivitas adalah kunci. Perilaku tidak sportif, termasuk toxic chat,
                  akan dikenakan sanksi.
                </p>
                <br />
                <p className="text-sm text-left">
                  <strong>7. Diskualifikasi:</strong> Panitia berhak mendiskualifikasi tim yang melanggar peraturan yang
                  telah ditetapkan.
                </p>
                <br />
                <p className="text-sm text-left">
                  <strong>8. Keputusan Panitia:</strong> Keputusan panitia adalah mutlak dan tidak dapat diganggu gugat.
                </p>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" className="text-black">
                    Agree
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Quota Full Dialog */}
      <Dialog open={isQuotaFullDialogOpen} onOpenChange={setIsQuotaFullDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-headline text-destructive">Kuota Penuh!</DialogTitle>
            <DialogDescription className="text-center">
              Maaf, kuota pendaftaran sudah penuh. Maksimal {maxTeams} tim yang dapat mendaftar.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-primary">
              {registeredTeamCount} / {maxTeams}
            </div>
            <div className="text-sm text-muted-foreground">Tim Terdaftar</div>
          </div>
          <DialogFooter className="justify-center">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
