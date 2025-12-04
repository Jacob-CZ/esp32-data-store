"use client"

import { useState } from "react"

type InsertState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success"; id: number }
	| { status: "error"; message: string }

function buildPayload() {
	const now = new Date()
	return {
		latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
		longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
		hour: now.getHours(),
		minute: now.getMinutes(),
		second: now.getSeconds(),
	}
}

export default function TestInsertPage() {
	const [state, setState] = useState<InsertState>({ status: "idle" })

	const handleInsert = async () => {
		setState({ status: "loading" })
		try {
			const payload = buildPayload()
			const res = await fetch("/api/gps", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})

			if (!res.ok) {
				const text = await res.text()
				throw new Error(text || "Request failed")
			}

			const json = await res.json()
			setState({ status: "success", id: json.data?.id })
		} catch (error) {
			setState({ status: "error", message: (error as Error).message })
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<div className="max-w-md w-full rounded-lg border border-gray-200 bg-white shadow p-6 space-y-4">
				<h1 className="text-xl font-semibold">Test GPS Insert</h1>
				<p className="text-sm text-gray-600">
					Click the button to send a sample GPS point to /api/gps.
					Payload uses current time and a random jitter around San
					Francisco.
				</p>
				<button
					onClick={handleInsert}
					disabled={state.status === "loading"}
					className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
				>
					{state.status === "loading"
						? "Sending..."
						: "Insert Test Point"}
				</button>
				{state.status === "success" && (
					<div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded p-2">
						Inserted row id: {state.id ?? "(unknown)"}
					</div>
				)}
				{state.status === "error" && (
					<div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded p-2">
						Failed: {state.message}
					</div>
				)}
			</div>
		</div>
	)
}
