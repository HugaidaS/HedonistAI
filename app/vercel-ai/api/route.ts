import { NextResponse } from "next/server";
import {generateObject} from "ai";
import { RecipeSchema } from "@/src/recipeSchema";
import {createGoogleGenerativeAI, google} from "@ai-sdk/google";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // OpenAI example
  // const modelName = "gpt-4o-2024-08-06";
  // const { object } = await generateText({
  //   model: openai(modelName, { structuredOutputs: true }),
  //   schema: RecipeSchema,
  //   prompt: `Recipe for ${prompt || "chocolate brownies"}`,
  // });

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const {object} = await generateObject({
    // @ts-ignore
    model: google('gemini-1.5-pro-latest', {
      structuredOutputs: true,
    }),
    schema: RecipeSchema,
    prompt: `Recipe for ${prompt || "chocolate brownies"} with image from the google, be polite and respectful`,
  });

  return NextResponse.json(object);
}
