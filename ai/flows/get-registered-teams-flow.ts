"use server"

import type { RegisteredTeamsResult } from "@/ai/schemas/registered-teams-schema"
import { createSupabaseServerClient } from "@/lib/supabase"

export async function getRegisteredTeams(): Promise<RegisteredTeamsResult> {
  const supabase = createSupabaseServerClient()

  try {
    // Fetch teams and their participants using a single query with foreign table join
    const { data: teamsData, error } = await supabase
      .from("teams")
      .select(
        `
          id,
          name,
          logo_url,
          created_at,
          participants (
            nickname,
            game_id,
            created_at
          )
        `,
      )
      .order("created_at", { ascending: true })
      .order("created_at", { foreignTable: "participants", ascending: true }) // Order participants within each team

    if (error) throw error

    const formattedTeams = teamsData.map((team) => ({
      id: team.id,
      name: team.name,
      logoUrl: team.logo_url,
      createdAt: team.created_at,
      participants: team.participants.map((p: any) => ({
        nickname: p.nickname,
        gameId: p.game_id,
        createdAt: p.created_at,
      })),
    }))

    return {
      success: true,
      teams: formattedTeams,
    }
  } catch (error) {
    console.error("Failed to fetch registered teams from Supabase:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return {
      success: false,
      error: errorMessage,
    }
  }
}
