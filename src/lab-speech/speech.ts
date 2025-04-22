import { ensureDir } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { getUniqueFileName } from "../helpers/uniqueFileName.ts";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import key from "../../gen-lang-client.json" with { type: "json" };

const outDir = "./src/lab-speech/audios-file";
const client = new TextToSpeechClient({ credentials: key });

export const quickStart = async (text: string): Promise<string> => {
  const [response] = await client.synthesizeSpeech({
    input: { text: text },
    voice: { languageCode: "es-MX", ssmlGender: "MALE" },
    audioConfig: { audioEncoding: "MP3" },
  });

  const audioContent = response.audioContent as Uint8Array;

  await ensureDir(outDir);

  //* Funcion para obtener un nombre unico para el archivo

  const fileName = await getUniqueFileName({
    baseName: "output",
    extension: "mp3",
  });

  await Deno.writeFile(fileName, audioContent);
  console.log(`Audio content written to file: ${fileName}`);
  return fileName;
};
