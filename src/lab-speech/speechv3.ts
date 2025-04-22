import speech from "@google-cloud/speech";

const client = new speech.SpeechClient();

export const speechV3 = async () => {

    const gsUrl = "gs://transcription_ia/generated_workspace_file.json";

    const audio = {
        uri: gsUrl,
    }

    const config = {
        encondig: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "es-MX",
    }

    const request = {
        audio: audio,
        config: config,
    }
    const [response] = await client.recognize(request);
    

    const transcript = response.results
        ?.map(results => results.alternatives?.[0].transcript)
        .join("\n");

        console.log(`Transcription: ${transcript}`);

};

