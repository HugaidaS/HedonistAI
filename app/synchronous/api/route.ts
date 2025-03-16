// import { RecipeSchema } from "@/src/recipeSchema";
// import OpenAI from "openai";
// import {zodResponseFormat} from 'openai/helpers/zod'
import {GoogleGenerativeAI, SchemaType} from "@google/generative-ai";
import { NextResponse } from "next/server";
import {RecipeSchemaGemini} from "@/src/recipeSchema";

const modelName = "gpt-4o-2024-08-06";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // const client = new OpenAI();
  // const response = await client.chat.completions.create({
  //   model: modelName,
  //   messages: [
  //     {
  //       role: "user",
  //       content: `Recipe for ${prompt || "chocolate brownies"}`,
  //     },
  //   ],
  //   response_format: zodResponseFormat(RecipeSchema, 'recipeSchema'),
  // })


  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig: {
      responseSchema: RecipeSchemaGemini, responseMimeType: "application/json",
    }});
  const result = await model.generateContent(prompt);

  return NextResponse.json(JSON.parse(result.response.text() || ''));
}
