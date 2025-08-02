"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { saveRegistration } from "@/ai/flows/save-registration-flow"
import { getRegisteredTeams } from "@/ai/flows/get-registered-teams-flow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { LoaderCircle } from "lucide-react"

const formSchema = z.object({
  teamName: z.string().min(2, { message: "Nama tim minimal 2 karakter." }),
  gameId: z.string().min(1, { message: "ID Game tidak boleh kosong." }),
  nickname: z.string().min(2, { message: "Nickname minimal 2 karakter." }),
  phoneNumber: z.string().min(10, { message: "Nomor telepon minimal 10 digit." }),
  email: z.string().email({ message: "Email tidak valid." }),
  member2Nickname: z.string().min(2, { message: "Nickname minimal 2 karakter." }),
  member2GameId: z.string().min(1, { message: "ID Game tidak boleh kosong." }),
  member3Nickname: z.string().min(2, { message: "Nickname minimal 2 karakter." }),
  member3GameId: z.string().min(1, { message: "ID Game tidak boleh kosong." }),
  member4Nickname: z.string().min(2, { message: "Nickname minimal 2 karakter." }),
  member4GameId: z.string().min(1, { message: "ID Game tidak boleh kosong." }),
  member5Nickname: z.string().min(2, { message: "Nickname minimal 2 karakter." }),
  member5GameId: z.string().min(1, { message: "ID Game tidak boleh kosong." }),
})

interface RegistrationFormProps {
  onRegistrationSuccess: () => void
  registrationOpenDate: string
  registrationCloseDate: string
  maxTeams: number
  currentTeamCount: number
}

export default function RegistrationForm({
  onRegistrationSuccess,
  registrationOpenDate,
  registrationCloseDate,
  maxTeams,
  currentTeamCount,
}: RegistrationFormProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      gameId: "",
      nickname: "",
      phoneNumber: "",
      email: "",
      member2Nickname: "",
      member2GameId: "",
      member3Nickname: "",
      member3GameId: "",
      member4Nickname: "",
      member4GameId: "",
      member5Nickname: "",
      member5GameId: "",
    },
  })

  const isRegistrationPeriodActive = () => {
    const now = new Date()
    const openDate = new Date(registrationOpenDate)
    const closeDate = new Date(registrationCloseDate)
    return now >= openDate && now < closeDate
  }

  const isQuotaFull = currentTeamCount >= maxTeams

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isRegistrationPeriodActive()) {
      toast({
        title: "Pendaftaran Belum Dibuka atau Sudah Ditutup",
        description: "Anda hanya bisa mendaftar selama periode pendaftaran aktif.",
        variant: "destructive",
      })
      return
    }

    if (isQuotaFull) {
      toast({
        title: "Kuota Penuh",
        description: `Maaf, kuota pendaftaran sudah penuh. Maksimal ${maxTeams} tim.`,
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        // Client-side validation for duplicate nicknames and game IDs
        const allNicknames = [
          values.nickname,
          values.member2Nickname,
          values.member3Nickname,
          values.member4Nickname,
          values.member5Nickname,
        ].filter(Boolean) // Filter out empty strings

        const allGameIds = [
          values.gameId,
          values.member2GameId,
          values.member3GameId,
          values.member4GameId,
          values.member5GameId,
        ].filter(Boolean) // Filter out empty strings

        const hasDuplicateNickname = new Set(allNicknames).size !== allNicknames.length
        const hasDuplicateGameId = new Set(allGameIds).size !== allGameIds.length

        if (hasDuplicateNickname) {
          toast({
            title: "Validasi Gagal",
            description: "Terdapat nickname yang sama di antara anggota tim. Harap gunakan nickname yang unik.",
            variant: "destructive",
          })
          return
        }

        if (hasDuplicateGameId) {
          toast({
            title: "Validasi Gagal",
            description: "Terdapat ID Game yang sama di antara anggota tim. Harap gunakan ID Game yang unik.",
            variant: "destructive",
          })
          return
        }

        // Server-side check for existing team name
        const existingTeamsResult = await getRegisteredTeams()
        if (existingTeamsResult.success && existingTeamsResult.teams) {
          const teamExists = existingTeamsResult.teams.some(
            (team) => team.team_name.toLowerCase() === values.teamName.toLowerCase(),
          )
          if (teamExists) {
            toast({
              title: "Pendaftaran Gagal",
              description: "Nama tim ini sudah terdaftar. Harap gunakan nama tim lain.",
              variant: "destructive",
            })
            return
          }
        } else {
          console.error("Failed to fetch existing teams:", existingTeamsResult.error)
          toast({
            title: "Error",
            description: "Gagal memverifikasi nama tim. Silakan coba lagi.",
            variant: "destructive",
          })
          return
        }

        const result = await saveRegistration(values)

        if (result.success) {
          toast({
            title: "Pendaftaran Berhasil!",
            description: "Tim Anda telah berhasil didaftarkan.",
          })
          form.reset()
          onRegistrationSuccess()
        } else {
          toast({
            title: "Pendaftaran Gagal",
            description: result.error || "Terjadi kesalahan saat mendaftar.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error during registration:", error)
        toast({
          title: "Error",
          description: "Terjadi kesalahan tak terduga. Silakan coba lagi.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="teamName">Nama Tim</Label>
          <Input id="teamName" {...form.register("teamName")} />
          {form.formState.errors.teamName && (
            <p className="text-sm text-red-500">{form.formState.errors.teamName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phoneNumber">Nomor Telepon (WhatsApp)</Label>
          <Input id="phoneNumber" type="tel" {...form.register("phoneNumber")} />
          {form.formState.errors.phoneNumber && (
            <p className="text-sm text-red-500">{form.formState.errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-4">Anggota Tim</h3>

      {/* Member 1 (Captain) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nickname">Nickname (Captain)</Label>
          <Input id="nickname" {...form.register("nickname")} />
          {form.formState.errors.nickname && (
            <p className="text-sm text-red-500">{form.formState.errors.nickname.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="gameId">ID Game (Captain)</Label>
          <Input id="gameId" {...form.register("gameId")} />
          {form.formState.errors.gameId && (
            <p className="text-sm text-red-500">{form.formState.errors.gameId.message}</p>
          )}
        </div>
      </div>

      {/* Member 2 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="member2Nickname">Nickname (Anggota 2)</Label>
          <Input id="member2Nickname" {...form.register("member2Nickname")} />
          {form.formState.errors.member2Nickname && (
            <p className="text-sm text-red-500">{form.formState.errors.member2Nickname.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="member2GameId">ID Game (Anggota 2)</Label>
          <Input id="member2GameId" {...form.register("member2GameId")} />
          {form.formState.errors.member2GameId && (
            <p className="text-sm text-red-500">{form.formState.errors.member2GameId.message}</p>
          )}
        </div>
      </div>

      {/* Member 3 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="member3Nickname">Nickname (Anggota 3)</Label>
          <Input id="member3Nickname" {...form.register("member3Nickname")} />
          {form.formState.errors.member3Nickname && (
            <p className="text-sm text-red-500">{form.formState.errors.member3Nickname.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="member3GameId">ID Game (Anggota 3)</Label>
          <Input id="member3GameId" {...form.register("member3GameId")} />
          {form.formState.errors.member3GameId && (
            <p className="text-sm text-red-500">{form.formState.errors.member3GameId.message}</p>
          )}
        </div>
      </div>

      {/* Member 4 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="member4Nickname">Nickname (Anggota 4)</Label>
          <Input id="member4Nickname" {...form.register("member4Nickname")} />
          {form.formState.errors.member4Nickname && (
            <p className="text-sm text-red-500">{form.formState.errors.member4Nickname.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="member4GameId">ID Game (Anggota 4)</Label>
          <Input id="member4GameId" {...form.register("member4GameId")} />
          {form.formState.errors.member4GameId && (
            <p className="text-sm text-red-500">{form.formState.errors.member4GameId.message}</p>
          )}
        </div>
      </div>

      {/* Member 5 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="member5Nickname">Nickname (Anggota 5)</Label>
          <Input id="member5Nickname" {...form.register("member5Nickname")} />
          {form.formState.errors.member5Nickname && (
            <p className="text-sm text-red-500">{form.formState.errors.member5Nickname.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="member5GameId">ID Game (Anggota 5)</Label>
          <Input id="member5GameId" {...form.register("member5GameId")} />
          {form.formState.errors.member5GameId && (
            <p className="text-sm text-red-500">{form.formState.errors.member5GameId.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !isRegistrationPeriodActive() || isQuotaFull}>
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Mendaftar...
          </>
        ) : isQuotaFull ? (
          "Kuota Penuh"
        ) : (
          "Daftar"
        )}
      </Button>
    </form>
  )
}
