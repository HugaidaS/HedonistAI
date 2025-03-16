import {z} from 'zod';
import {SchemaType} from "@google/generative-ai";

export const RecipeSchema = z.object({
  name: z.string().describe("Name of the recipe"),
  ingredients: z.array(z.object({
    quantity: z.string().describe("Quantity of the ingredient"),
    ingredient: z.string().describe("Ingredient name"),
  })).describe("List of ingredients"),
  steps: z.array(z.string().describe("markdown content to describe the recipe step"))
    .describe("Steps of the recipe"),
});


export const RecipeSchemaGemini = {
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
