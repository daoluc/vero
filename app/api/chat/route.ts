import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
	try {
		const { message } = await req.json();

		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [{ role: "user", content: message }],
		});

		return NextResponse.json({
			message: completion.choices[0].message.content,
		});
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: "Failed to process your request" },
			{ status: 500 }
		);
	}
}
