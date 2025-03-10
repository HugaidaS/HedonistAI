// import { RecipeSchema } from "@/src/recipeSchema";
// import OpenAI from "openai";
// import {zodResponseFormat} from 'openai/helpers/zod'
import { NextResponse } from "next/server";
import {GoogleGenerativeAI} from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai";

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
  //   stream: true,
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

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig: {
    responseSchema: recipeResponseSchema, responseMimeType: "application/json",
    }});
  const response = await model.generateContentStream(prompt);

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response.stream) {
        const content  = chunk.text() || '';
        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    }
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    }
  })

}
