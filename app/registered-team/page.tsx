"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, LoaderCircle, Users } from "lucide-react"
import { getRegisteredTeams } from "@/ai/flows/get-registered-teams-flow"
import type { RegisteredTeam } from "@/ai/schemas/registered-teams-schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RegisteredTeamPage() {
  const [teams, setTeams] = useState<RegisteredTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true)
        const result = await getRegisteredTeams()
        if (result.success) {
          setTeams(result.teams || [])
        } else {
          setError(result.error || "Gagal memuat data tim.")
        }
      } catch (err) {
        setError("Terjadi kesalahan pada server.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background/80 backdrop-blur-[2px] font-bebas relative p-4 sm:p-8">
      <header className="w-full max-w-7xl mx-auto flex items-center mb-8">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl sm:text-3xl font-normal tracking-tighter text-foreground">Tim Terdaftar</h1>
      </header>

      {loading && (
        <div className="flex items-center justify-center flex-grow text-lg font-body">
          <LoaderCircle className="mr-2 h-6 w-6 animate-spin" />
          Memuat Tim...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center flex-grow text-lg text-destructive font-body">{error}</div>
      )}

      {!loading && !error && teams.length === 0 && (
        <div className="flex items-center justify-center flex-grow text-lg text-muted-foreground font-body">
          Belum ada tim yang terdaftar.
        </div>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <Card key={team.id} className="bg-card/50 backdrop-blur-sm border-white/10 p-2 flex flex-col">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button disabled={!team.logoUrl} className="disabled:cursor-not-allowed">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-sm text-muted-foreground overflow-hidden flex-shrink-0",
                            !team.logoUrl && "bg-muted/50",
                          )}
                        >
                          {team.logoUrl ? (
                            <Image
                              src={team.logoUrl || "/placeholder.svg"}
                              alt={`${team.name} logo`}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Users className="w-6 h-6" />
                          )}
                        </div>
                      </button>
                    </DialogTrigger>
                    {team.logoUrl && (
                      <DialogContent className="p-0 bg-transparent border-0 w-full max-w-md h-auto">
                        <Image
                          src={team.logoUrl || "/placeholder.svg"}
                          alt={`${team.name} logo`}
                          width={512}
                          height={512}
                          className="rounded-lg object-contain w-full h-full"
                        />
                      </DialogContent>
                    )}
                  </Dialog>
                  <div className="flex flex-col flex-1 truncate">
                    <CardTitle className="text-sm font-normal text-left text-muted-foreground">
                      Tim {index + 1}
                    </CardTitle>
                    <span className="text-2xl uppercase font-normal text-left truncate">{team.name}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-2 p-0 flex-grow">
                <Table className="text-sm font-body">
                  <TableHeader>
                    <TableRow className="border-b-white/10">
                      <TableHead className="h-8 px-3 font-body text-xs">Nickname</TableHead>
                      <TableHead className="h-8 px-3 font-body text-xs text-right">ID Game</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.participants.map((participant) => (
                      <TableRow key={participant.gameId} className="border-b-0">
                        <TableCell className="py-1.5 px-3 truncate" title={participant.nickname}>
                          {participant.nickname}
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-muted-foreground text-right">
                          {participant.gameId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
