import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { openai_completion } from "../openai-api.js"; // Adjust the path as needed

Deno.test("openai_completion returns a predefined response for a specific prompt", async () => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    console.error("Please set the OPENAI_API_KEY environment variable.");
    return;
  }

  const userMessage = "Translate 'Hello, World!' to French.";
  const systemMessage = "You are a translator that only responds with direct translations.";
  const expectedResponse = "Bonjour, le monde!";

  const result = await openai_completion(apiKey, userMessage, systemMessage);

  if (result) {
    assertEquals(result.choices[0].message.content.trim(), expectedResponse, "Response does not match expected translation.");
  } else {
    console.error("No result returned. Check your API key and network connection.");
  }
});

Deno.test("openai_completion handles invalid API key gracefully and returns no response", async () => {
  const invalidApiKey = "invalid-key";

  const userMessage = "Translate 'Hello, World!' to French.";
  const systemMessage = "You are a translator that only responds with direct translations.";

  const result = await openai_completion(invalidApiKey, userMessage, systemMessage);

  // Ensure no result is returned when there's an error
  assertEquals(result, undefined, "Expected undefined result due to invalid API key.");
});

