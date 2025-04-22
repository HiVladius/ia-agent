import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts";

import { FileNameOptions } from "../interface/speechInterface.ts";

const outDir = "./src/lab-speech/audios-file";

export const getUniqueFileName = async (options: FileNameOptions): Promise<string> => {
  
  let counter = 1;
  
  let fileName = `${outDir}/${options.baseName}.${options.extension}`;

  while (await exists(fileName)) {
    fileName = `${outDir}/${options.baseName}_${counter}.${options.extension}`;
    counter++;
  }
  return fileName;
};
