import "jsr:@std/dotenv/load";

// URL del endpoint de transcripción de OpenAI
const OPENAI_AUDIO_ENDPOINT = "https://api.openai.com/v1/audio/transcriptions";

// Get OpenAI API key from environment variables
// You must set IA_OPENIA2 environment variable with your OpenAI API key
const OPENAI_API_KEY = Deno.env.get("IA_OPENIA2");

// Validar si la clave API está configurada
if (!OPENAI_API_KEY) {
  console.error("Error: Falta la clave API de OpenAI.");
  Deno.exit(1);
}

async function transcribeAudio(audioFile: Uint8Array): Promise<Response> {
  try {
    const formData = new FormData();
    formData.append("file", new Blob([audioFile]), "audio.mp3");
    formData.append("model", "tts-1"); // Modelo recomendado por OpenAI

    const response = await fetch(OPENAI_AUDIO_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("Error en la API de OpenAI:", await response.text());
      return new Response("Error al procesar el audio", { status: 500 });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al comunicarse con OpenAI:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}

/**
 * Manejo principal de solicitudes del servidor.
 * @param req Solicitud HTTP recibida.
 * @returns Respuesta HTTP según la ruta y método.
 */
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === "/transcribe-audio" && req.method === "POST") {
    try {
      const contentType = req.headers.get("Content-Type") || "";

      if (!contentType.includes("multipart/form-data")) {
        return new Response("Se esperaba 'multipart/form-data'", {
          status: 400,
        });
      }

      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return new Response("Falta el archivo de audio", { status: 400 });
      }

      const audioBuffer = new Uint8Array(await file.arrayBuffer());
      return await transcribeAudio(audioBuffer);
    } catch (error) {
      console.error("Error procesando la solicitud:", error);
      return new Response("Solicitud inválida", { status: 400 });
    }
  }

  return new Response("Ruta no encontrada", { status: 404 });
}