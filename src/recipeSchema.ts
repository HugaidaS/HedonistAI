import {z} from 'zod';

export const RecipeSchema = z.object({
  name: z.string().describe("Name of the recipe"),
  ingredients: z.array(z.object({
    quantity: z.string().describe("Quantity of the ingredient"),
    ingredient: z.string().describe("Ingredient name"),
  })).describe("List of ingredients"),
  steps: z.array(z.string().describe("markdown content to describe the recipe step"))
    .describe("Steps of the recipe"),
});
