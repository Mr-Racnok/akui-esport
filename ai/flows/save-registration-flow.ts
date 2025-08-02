"use server"

import type { RegistrationData, RegistrationResult } from "@/ai/schemas/registration-schema"
import { createSupabaseServerClient } from "@/lib/supabase"

export async function saveRegistration(input: RegistrationData): Promise<RegistrationResult> {
  console.log("saveRegistration: Starting registration process for team:", input.teamName)
  const supabase = createSupabaseServerClient()

  // Define registration dates directly in the server action for security
  const registrationOpenDate = new Date("2025-08-10T07:00:00")
  const registrationCloseDate = new Date("2025-08-10T17:00:00") // 10 Agustus 2025, 17:00 WIB
  const now = new Date()

  // Server-side validation for registration window
  if (now < registrationOpenDate) {
    console.warn("saveRegistration: Attempted early registration.")
    return {
      success: false,
      message: "Pendaftaran gagal.",
      error: "Pendaftaran belum dibuka. Silakan coba lagi setelah tanggal " + registrationOpenDate.toLocaleString(),
    }
  }
  if (now >= registrationCloseDate) {
    console.warn("saveRegistration: Attempted late registration.")
    return {
      success: false,
      message: "Pendaftaran gagal.",
      error: "Pendaftaran telah ditutup pada " + registrationCloseDate.toLocaleString(),
    }
  }

  try {
    // 1. Check for duplicate team name
    console.log("saveRegistration: Checking for duplicate team name...")
    const { count: teamCount, error: teamCountError } = await supabase
      .from("teams")
      .select("id", { count: "exact" })
      .eq("name", input.teamName)

    if (teamCountError) {
      console.error("saveRegistration: Error checking team name:", teamCountError)
      throw teamCountError
    }
    if (teamCount && teamCount > 0) {
      console.log("saveRegistration: Duplicate team name found.")
      return {
        success: false,
        message: "Pendaftaran gagal.",
        error: `Nama tim "${input.teamName}" sudah terdaftar.`,
      }
    }
    console.log("saveRegistration: Team name check complete.")

    // 2. Check for duplicate game IDs (Optimized to one query)
    const gameIds = [input.gameId1, input.gameId2, input.gameId3, input.gameId4, input.gameId5]
    console.log("saveRegistration: Checking for duplicate game IDs:", gameIds)
    const { data: existingParticipants, error: existingParticipantsError } = await supabase
      .from("participants")
      .select("game_id")
      .in("game_id", gameIds)

    if (existingParticipantsError) {
      console.error("saveRegistration: Error checking game IDs:", existingParticipantsError)
      throw existingParticipantsError
    }
    if (existingParticipants && existingParticipants.length > 0) {
      const duplicatedId = existingParticipants[0].game_id
      console.log("saveRegistration: Duplicate game ID found:", duplicatedId)
      return {
        success: false,
        message: "Pendaftaran gagal.",
        error: `ID Game "${duplicatedId}" sudah terdaftar.`,
      }
    }
    console.log("saveRegistration: Game ID check complete.")

    // Get current team count for the new team's number
    console.log("saveRegistration: Getting current total teams count...")
    const { count: currentTotalTeams, error: totalTeamsError } = await supabase
      .from("teams")
      .select("id", { count: "exact" })
    if (totalTeamsError) {
      console.error("saveRegistration: Error getting total teams count:", totalTeamsError)
      throw totalTeamsError
    }
    const newTeamNumber = (currentTotalTeams || 0) + 1
    console.log("saveRegistration: Current total teams:", currentTotalTeams, "New team number:", newTeamNumber)

    // 3. Insert the team
    console.log("saveRegistration: Inserting team data...")
    const { data: teamData, error: teamInsertError } = await supabase
      .from("teams")
      .insert({
        name: input.teamName,
        logo_url: input.logoUrl || null,
      })
      .select()

    if (teamInsertError) {
      console.error("saveRegistration: Error inserting team:", teamInsertError)
      throw teamInsertError
    }
    if (!teamData || teamData.length === 0) {
      console.error("saveRegistration: Failed to insert team data, no data returned.")
      throw new Error("Failed to insert team data.")
    }
    const teamId = teamData[0].id
    console.log("saveRegistration: Team inserted with ID:", teamId)

    // 4. Prepare participants data for batch insert
    const participantsToInsert = [
      { team_id: teamId, nickname: input.participantNickname1, game_id: input.gameId1 },
      { team_id: teamId, nickname: input.participantNickname2, game_id: input.gameId2 },
      { team_id: teamId, nickname: input.participantNickname3, game_id: input.gameId3 },
      { team_id: teamId, nickname: input.participantNickname4, game_id: input.gameId4 },
      { team_id: teamId, nickname: input.participantNickname5, game_id: input.gameId5 },
    ]
    console.log("saveRegistration: Prepared participants for insert:", participantsToInsert)

    // 5. Insert participants
    console.log("saveRegistration: Inserting participants...")
    const { error: participantsInsertError } = await supabase.from("participants").insert(participantsToInsert)

    if (participantsInsertError) {
      console.error("saveRegistration: Error inserting participants:", participantsInsertError)
      throw participantsInsertError
    }
    console.log("saveRegistration: Participants inserted successfully.")

    console.log("saveRegistration: Registration process completed successfully.")
    return {
      success: true,
      message: "Pendaftaran berhasil disimpan ke Supabase.",
      teamNumber: newTeamNumber,
    }
  } catch (error) {
    console.error("saveRegistration: Caught error during registration:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return {
      success: false,
      message: "Pendaftaran gagal disimpan.",
      error: errorMessage,
    }
  }
}
