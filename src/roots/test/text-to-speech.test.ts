import { expect } from "jsr:@std/expect";
import { textToSpeech } from "../text-to-speech.ts";

Deno.test("textToSpeech function tests", async (t) => {
  await t.step(
    "should return an audio response when valid text is provided",
    async () => {
      const mockCtx = {
        req: {
          json: async () => ({ text: "Hello world" }),
        },
      };

      const response = await textToSpeech(mockCtx as any);
      expect(response instanceof Response).toBe(true);
      expect(response.headers.get("Content-Type")).toBe("audio/mp3");
    },
  );

  await t.step(
    "should return 500 error when text processing fails",
    async () => {
      const mockCtx = {
        req: {
          json: async () => {
            throw new Error("Failed to parse JSON");
          },
        },
      };

      const response = await textToSpeech(mockCtx as any);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Error interno del servidor");
    },
  );

  Deno.exit();
});
