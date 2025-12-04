import { NextResponse } from "next/server"
import { query } from "@/lib/db"

type GpsDataRow = {
	id: number
	latitude: number
	longitude: number
	recordedAt: Date
	createdAt: Date
}

const requiredParams = [
	"latitude",
	"longitude",
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
]

export async function GET(request: Request) {
	try {
		const url = new URL(request.url)
		const params = url.searchParams

		const hasAllInsertParams = requiredParams.every((key) =>
			params.has(key)
		)

		if (hasAllInsertParams) {
			const latitude = Number(params.get("latitude"))
			const longitude = Number(params.get("longitude"))
			const year = Number(params.get("year"))
			const month = Number(params.get("month"))
			const day = Number(params.get("day"))
			const hour = Number(params.get("hour"))
			const minute = Number(params.get("minute"))
			const second = Number(params.get("second"))

			const numbers = [
				latitude,
				longitude,
				year,
				month,
				day,
				hour,
				minute,
				second,
			]

			if (numbers.some((n) => Number.isNaN(n))) {
				return NextResponse.json(
					{
						success: false,
						error: "Invalid numeric query parameters",
					},
					{ status: 400 }
				)
			}

			const recordedAt = new Date(
				year,
				month - 1,
				day,
				hour,
				minute,
				second
			)

			const insertSql = `
      INSERT INTO "GpsData" ("latitude", "longitude", "recordedAt")
      VALUES ($1, $2, $3)
      RETURNING *;
    `

			const insertResult = await query<GpsDataRow>(insertSql, [
				latitude,
				longitude,
				recordedAt,
			])

			const data = insertResult.rows[0]
			return NextResponse.json({ success: true, data }, { status: 201 })
		}

		// Fallback: list latest points
		const selectSql = `
      SELECT *
      FROM "GpsData"
      ORDER BY "recordedAt" DESC
      LIMIT 100;
    `

		const result = await query<GpsDataRow>(selectSql)
		return NextResponse.json(result.rows)
	} catch (error) {
		console.error("Error handling GPS request:", error)
		return NextResponse.json(
			{ success: false, error: "Failed to handle request" },
			{ status: 500 }
		)
	}
}
