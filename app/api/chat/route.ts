import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model: openai("gpt-4o"),
		system:
			"You are a helpful assistant that can search the internal knowledge base for relevant information. If you use information from the internal knowledge base, you must provide the file_name with the source link next to the information.",
		messages,
		tools: {
			internal_search: tool({
				description:
					"Search internal knowledge base for relevant information",
				parameters: z.object({
					query: z
						.string()
						.describe("The search query to find relevant information"),
				}),
				execute: async ({ query }) => {
					try {
						const response = await fetch(
							"http://3.142.140.162:8000/internal_search",
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({ query }),
							}
						);

						if (!response.ok) {
							throw new Error("Internal search failed");
						}

						const results = await response.json();
						// console.log(
						// 	"Internal search results:",
						// 	JSON.stringify(results, null, 2)
						// );
						return JSON.stringify(results, null, 2);
					} catch (error) {
						console.error("Internal search error:", error);
						return "Internal search failed. Please try again.";
					}
				},
			}),
		},
	});

	return result.toDataStreamResponse();
}
