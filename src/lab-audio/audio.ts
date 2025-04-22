// Make sure to include these imports:
import { FileState, GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Path } from "@david/path";

const fileManager = new GoogleAIFileManager(Deno.env.get("IA_GOOGLE") || "");

const mediaPath = new Path("media");

const uploadResult = await fileManager.uploadFile(
  `${mediaPath}/samplesmall.mp3`,
  {
    mimeType: "audio/mp3",
    displayName: "Audio sample",
  },
);

let file = await fileManager.getFile(uploadResult.file.name);
while (file.state === FileState.PROCESSING) {
  Deno.stdout.write(new TextEncoder().encode(".")); // Print a dot to the console
  // Sleep for 10 seconds
  await new Promise((resolve) => setTimeout(resolve, 10_000));
  // Fetch the file from the API again
  file = await fileManager.getFile(uploadResult.file.name);
}

if (file.state === FileState.FAILED) {
  throw new Error("Audio processing failed.");
}

// View the response.
console.log(
  `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
);

const genAI = new GoogleGenerativeAI(Deno.env.get("IA_GOOGLE") || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent([
  "Tell me about this audio clip.",
  {
    fileData: {
      fileUri: uploadResult.file.uri,
      mimeType: uploadResult.file.mimeType,
    },
  },
]);
console.log(result.response.text());
