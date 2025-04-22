import { Context } from "hono";

import { protos } from "@google-cloud/text-to-speech";

export interface FileNameOptions {
  baseName: string;
  extension: string;
}

//! Audio Transcription

export interface Chunk {
  data: Uint8Array;
  done: boolean;
}

export interface AudioFile extends Context {
  name: string;
  type: "audio/wav" | "audio/mp3" | "audio/mpeg" | "audio/ogg";
  size: number;
  data: Blob;
}


export type SsmlVoiceGender =
protos.google.cloud.texttospeech.v1.SsmlVoiceGender
  | "SSML_VOICE_GENDER_UNSPECIFIED"
  | "MALE"
  | "FEMALE"
  | "NEUTRAL";



export interface AudioConfig {
  text?: string;
  gender?: string;
  ssmlGender?: SsmlVoiceGender;
  audioData?: string; // Add this line
  lanbguageCode?: string;
  
}