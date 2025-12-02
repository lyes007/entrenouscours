import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  // We don't throw here to avoid crashing build; the API route will validate.
  console.warn(
    "[OPENAI] OPENAI_API_KEY is not set. The chat assistant will not work until it is configured.",
  );
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


