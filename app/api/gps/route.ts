import { NextResponse } from "next/server"
import { query } from "@/lib/db"

type GpsDataRow = {
	id: number
	latitude: number
	longitude: number
	recordedAt: Date
	createdAt: Date
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		console.log("Received GPS payload:", body)

		// Construct recordedAt date from payload fields
		// Payload: { year, month, day, hour, minute, second, ... }
		// Note: Month in Date constructor is 0-indexed (0-11), but GPS usually gives 1-12.
		// Assuming GPS gives 1-12, we subtract 1.
		const recordedAt = new Date(
			body.year,
			body.month - 1,
			body.day,
			body.hour,

			body.minute,
			body.second
		)
		console.log("Constructed Date:", recordedAt)

		const insertSql = `
      INSERT INTO "GpsData" ("latitude", "longitude", "recordedAt")
      VALUES ($1, $2, $3)
      RETURNING *;
    `

		const insertResult = await query<GpsDataRow>(insertSql, [
			body.latitude,
			body.longitude,
			recordedAt,
		])

		const data = insertResult.rows[0]

		return NextResponse.json({ success: true, data }, { status: 201 })
	} catch (error) {
		console.error("Error saving GPS data:", error)
		return NextResponse.json(
			{ success: false, error: "Failed to save data" },
			{ status: 500 }
		)
	}
}

export async function GET() {
	try {
		const selectSql = `
      SELECT *
      FROM "GpsData"
      ORDER BY "recordedAt" DESC
      LIMIT 100;
    `

		const result = await query<GpsDataRow>(selectSql)
		return NextResponse.json(result.rows)
	} catch (error) {
		console.error("Error fetching GPS data:", error)
		return NextResponse.json(
			{ success: false, error: "Failed to fetch data" },
			{ status: 500 }
		)
	}
}
