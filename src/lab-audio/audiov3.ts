import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import "jsr:@std/dotenv/load";

const apiKey = Deno.env.get("IA_GOOGLE") || "";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const uploadAudio = async (filePath: string) => {
  try {
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "audio/mp3",
      displayName: filePath,
    });
    console.log(`Archivo subido ${uploadResult.file.name}`);
    return uploadResult.file;
  } catch (error) {
    console.error("Error al subir el archivo", error);
    throw error;
  }
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-002",
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1000,
  responseMimeType: "text/plain",
};

export const processAudioAndChat = async (filePath: string, prompt: string) => {
  try {
    const uploadedfile = await uploadAudio(filePath);

    const chatSession = model.startChat({
      generationConfig,

      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: "audio/mp3",
                fileUri: uploadedfile.uri,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error al procesar el audio", error);
    throw error;
  }
};
