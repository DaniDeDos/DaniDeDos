import axios from "axios";
import fs from 'fs/promises';

import { updateBotStatus } from './updateBotStatus.js';
import { updateLastConnection } from './updateLastConnection.js';

async function main() {
 // Actualiza README.md con la última fecha de actividad
 await updateLastConnection("DaniDeDos");
 // Actualiza el estado del bot
 await updateBotStatus("Online");
}

async function readFile() {
   try {
       const data = await fs.readFile('./README.md', 'utf8');
       // procesar los datos aquí
   } catch (err) {
       console.error(`Error reading file: ${err}`);
   }
}

readFile();
function generateProgressBar(percentage) {
   const progressBarCapacity = 30;
   const passedProgressBarIndex = parseInt(percentage * progressBarCapacity);
   const progressBar = '█'.repeat(passedProgressBarIndex) + ' '.repeat(progressBarCapacity - passedProgressBarIndex);
   return `{ ${progressBar} }`;
}


async function writeFile(data) {
   try {
       await fs.writeFile('./README.md', data, 'utf8');
       console.log('File updated successfully');
   } catch (err) {
       console.error(`Error writing file: ${err}`);
   }
}

writeFile(updatedData);



main();
