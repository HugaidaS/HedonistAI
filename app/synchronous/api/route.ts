// import { RecipeSchema } from "@/src/recipeSchema";
// import OpenAI from "openai";
// import {zodResponseFormat} from 'openai/helpers/zod'
import {GoogleGenerativeAI, SchemaType} from "@google/generative-ai";
import { NextResponse } from "next/server";

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

  const recipeResponseSchema = {
    type:  "object" as SchemaType.OBJECT,
    properties: {
      name: {
        type: 'string' as SchemaType.STRING,
        description: "Name of the recipe"
      },
      ingredients: {
        type: 'array' as SchemaType.ARRAY,
        description: "List of ingredients",
        items: {
          type: 'object' as SchemaType.OBJECT,
          properties: {
            quantity: {
              type: 'string' as SchemaType.STRING,
              description: "Quantity of the ingredient"
            },
            ingredient: {
              type: 'string' as SchemaType.STRING,
              description: "Ingredient name"
            }
          },
          required: ["quantity", "ingredient"]
        }
      },
      steps: {
        type: 'array' as SchemaType.ARRAY,
        description: "Steps of the recipe",
        items: {
          type: 'string' as SchemaType.STRING,
          description: "markdown content to describe the recipe step"
        }
      }
    },
    required: ["name", "ingredients", "steps"]
  };

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig: {
      responseSchema: recipeResponseSchema, responseMimeType: "application/json",
    }});
  const result = await model.generateContent(prompt);

  return NextResponse.json(JSON.parse(result.response.text() || ''));
}
