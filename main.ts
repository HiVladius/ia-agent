// import * as denon from "https://deno.land/x/denon@2.5.0/mod.ts";
import { Hono } from "hono";
import {cors} from "hono/cors"
import { textToSpeech } from "./src/roots/text-to-speech.ts";
import {
  getConversationIA,
  handleConversationIA,
} from "./src/roots/audioTranscript.ts";



const app = new Hono();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST"],
  allowHeaders: ["Content-Type"],
}))

//* Text to speech endpoint
app.post("/text-speech", textToSpeech);

//* Audio transcript endpoint
app.get("/conversationIA", getConversationIA);
app.post("/conversationIA", handleConversationIA);

Deno.serve({ port: 3000 }, app.fetch);
