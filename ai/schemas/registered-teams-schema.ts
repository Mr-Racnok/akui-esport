import { z } from "zod"

export const ParticipantSchema = z.object({
  nickname: z.string(), // Changed to nickname
  gameId: z.string(),
  createdAt: z.string(), // ISO string for date
})

export const RegisteredTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(), // ISO string for date
  participants: z.array(ParticipantSchema),
})

export const RegisteredTeamsResultSchema = z.object({
  success: z.boolean(),
  teams: z.array(RegisteredTeamSchema).optional(),
  error: z.string().optional(),
})

export type Participant = z.infer<typeof ParticipantSchema>
export type RegisteredTeam = z.infer<typeof RegisteredTeamSchema>
export type RegisteredTeamsResult = z.infer<typeof RegisteredTeamsResultSchema>
