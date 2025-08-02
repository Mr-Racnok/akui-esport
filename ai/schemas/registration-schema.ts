import { z } from "zod"

export const RegistrationDataSchema = z.object({
  teamName: z.string().min(3, "Nama tim minimal 3 karakter").max(50, "Nama tim maksimal 50 karakter"),
  logoUrl: z.string().url("URL logo tidak valid").optional().or(z.literal("")),
  participantNickname1: z.string().min(3, "Nickname minimal 3 karakter").max(50, "Nickname maksimal 50 karakter"), // Changed to nickname
  gameId1: z.string().min(5, "ID Game minimal 5 karakter").max(20, "ID Game maksimal 20 karakter"),
  participantNickname2: z.string().min(3, "Nickname minimal 3 karakter").max(50, "Nickname maksimal 50 karakter"), // Changed to nickname
  gameId2: z.string().min(5, "ID Game minimal 5 karakter").max(20, "ID Game maksimal 20 karakter"),
  participantNickname3: z.string().min(3, "Nickname minimal 3 karakter").max(50, "Nickname maksimal 50 karakter"), // Changed to nickname
  gameId3: z.string().min(5, "ID Game minimal 5 karakter").max(20, "ID Game maksimal 20 karakter"),
  participantNickname4: z.string().min(3, "Nickname minimal 3 karakter").max(50, "Nickname maksimal 50 karakter"), // Changed to nickname
  gameId4: z.string().min(5, "ID Game minimal 5 karakter").max(20, "ID Game maksimal 20 karakter"),
  participantNickname5: z.string().min(3, "Nickname minimal 3 karakter").max(50, "Nickname maksimal 50 karakter"), // Changed to nickname
  gameId5: z.string().min(5, "ID Game minimal 5 karakter").max(20, "ID Game maksimal 20 karakter"),
})

export type RegistrationData = z.infer<typeof RegistrationDataSchema>

export const RegistrationResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
  teamNumber: z.number().optional(),
})

export type RegistrationResult = z.infer<typeof RegistrationResultSchema>
