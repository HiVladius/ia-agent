import { quickStart } from "../lab-speech/speech.ts";
import { Context } from "hono";

export const textToSpeech: (req: Context )=> Promise<Response> = async (req) => {
  try {
    const { text } = await req.req.json();
    const audioFilePath = await quickStart(text);
    const audioData = await Deno.readFile(audioFilePath);
    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mp3",
      },
    });
  } catch (error) {
    console.error("Error al generar el audio:", error);
    return req.json({ error: "Error al generar el audio" }, 500);
  }
};
