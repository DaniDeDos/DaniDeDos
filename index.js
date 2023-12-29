import axios from "axios";
import fs from 'fs/promises';

import { updateBotStatus } from './updateBotStatus.js';
import { updateLastConnection } from './updateLastConnection.js';

async function updateBotStatus(status) {
 const data = { botStatus: status };
 await fs.writeFile('./status.json', JSON.stringify(data));

 // Leer el contenido de README.md
 let content = await fs.readFile("./README.md", { encoding: "utf-8" });

 // Buscar la URL de la imagen del escudo y reemplazar el valor de "botStatus"
 const regex = /https:\/\/img\.shields\.io\/badge\/GitHub%20Action%20Status-([^-\/]*)-brightgreen\?style=flat&logo=githubactions&logoColor=%23ffffff&labelColor=%23181717&color=%232088FF/;
 const updatedUrl = content.replace(regex, `https://img.shields.io/badge/GitHub%20Action%20Status-${status}-brightgreen?style=flat&logo=githubactions&logoColor=%23ffffff&labelColor=%23181717&color=%232088FF`);

 // Escribir el contenido actualizado de nuevo a README.md
 await fs.writeFile("./README.md", updatedUrl, { encoding: "utf-8" });
}

async function main() {
 // Actualiza README.md con la última fecha de actividad
 await updateLastConnection("DaniDeDos");
 // Actualiza el estado del bot
 await updateBotStatus("Online");
}

main();
