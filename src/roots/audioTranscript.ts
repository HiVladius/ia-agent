import { MultipartReader } from "https://deno.land/std@0.114.0/mime/multipart.ts";
import { Buffer } from "node:buffer";
import { processAudioAndChat } from "../lab-audio/audiov3.ts";
import { BUSSINES_CONTEXT } from "../helpers/contextIA.ts";
import { quickStart } from "../lab-speech/speech.ts";
import { Context } from "hono";
import { Chunk } from "../interface/speechInterface.ts";

export const getConversationIA = async (c: Context) => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks: Chunk[] = [];

  mediaRecorder.ondataavailable = async (event) => {
    const chunk: Chunk = {
      data: new Uint8Array(await event.data.arrayBuffer()),
      done: false,
    };
    chunks.push(chunk);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks.map((chunk) => chunk.data));
    const reader = new FileReader();
    reader.onload = async () => {
      const buffer = Buffer.from(reader.result as ArrayBuffer);
      const prompt = `${BUSSINES_CONTEXT}`; // Prompt para usar en el modelo
      const response = await processAudioAndChat(buffer.toString(), prompt);
      await quickStart(response);
    };
    reader.readAsArrayBuffer(blob);
  };

  return c.text("Solicitud GET recibida", 200);
};

export const handleConversationIA = async (c: Context) => {
  const contentType = c.req.header("content-type");
  if (!contentType) {
    return c.text("Bad Request", 400);
  }

  const boundary = contentType.split("boundary=")[1];
  const reader = new MultipartReader(c.req, boundary);
  const form = await reader.readForm();
  const file = form.files("audio");

  if (file) {
    const fileContent = await Deno.readFile(file[0]?.filename);
    const prompt = `${BUSSINES_CONTEXT}`; // Prompt para usar en el modelo

    const fileContentString = new TextDecoder().decode(fileContent);
    const response = await processAudioAndChat(fileContentString, prompt);

    await quickStart(response);

    return c.text("Archivo procesado correctamente", 200);
  } else {
    return c.text("No se proporcionó archivo", 400);
  }
};



//Codigo base de Gemini, y textToSpeech
export const audioTranscript = async () => {
  try {
    
    const path = "./src/audio/IA_example_MP3.mp3"; // Path es el archivo de audio a procesar
    console.log("path", path);
    
    const prompt = `${BUSSINES_CONTEXT}`; // Prompt to be used in the model

    console.log("iniciando procesamiento de audio...");

    const response = await processAudioAndChat(path, prompt);

    console.log("Respuesta de modelo:\n", response);

    await quickStart(response);

  } catch (error) {
    console.error("Error al procesar el audio", error);
    Deno.exit(1);
  }
};


