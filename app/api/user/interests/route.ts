import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "user-1", interests } = body

    if (!interests || !Array.isArray(interests)) {
      return NextResponse.json({ error: "Invalid interests data" }, { status: 400 })
    }

    // In production, save to database
    // For now, just validate and return success
    console.log(`Saving interests for user ${userId}:`, interests)

    return NextResponse.json({
      success: true,
      message: "Interests saved successfully",
      interests,
    })
  } catch (error) {
    console.error("Save interests error:", error)
    return NextResponse.json({ error: "Failed to save interests" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user-1"

    // Mock interests data - in production, fetch from database
    const userInterests = ["Learning", "Tech", "Cooking", "Motivation"]

    return NextResponse.json({
      interests: userInterests,
      userId,
    })
  } catch (error) {
    console.error("Get interests error:", error)
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 })
  }
}
