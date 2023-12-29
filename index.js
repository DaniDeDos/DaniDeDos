// archivo index.js

import axios from "axios";
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import { isBotActive } from './botStatusUpdater.js';
import { updateLastConnection } from './updateLastConnection.js';


async function main() {
 // Agrega un manejador de eventos para el evento 'exit'
 process.on('exit', () => {
 setBotActiveState(false);
 });

 // Agrega un manejador de eventos para el evento 'uncaughtException'
 process.on('uncaughtException', () => {
 setBotActiveState(false);
 });

 // Leer el archivo de plantilla
 const template = await fs.readFile('./README.md.tpl', 'utf8');

 // Compilar la plantilla
 const compiledTemplate = Handlebars.compile(template);

 // Leer el estado del bot
 const botStatus = await fs.readFile('./status.json', 'utf8');
 const botData = JSON.parse(botStatus);

 // Renderizar la plantilla con los datos del bot
 const data = { botStatus: botData.botStatus };
 const initialContent = compiledTemplate(data);

 // Escribir el contenido inicial en README.md
 await fs.writeFile('./README.md', initialContent, 'utf8');

 // Actualiza el estado del bot
 await isBotActive("DaniDeDos");

 // Leer el estado del bot de nuevo
 const botStatusAfterUpdate = await fs.readFile('./status.json', 'utf8');
 const botDataAfterUpdate = JSON.parse(botStatusAfterUpdate);

 // Renderiza la plantilla con los datos del bot
 const finalContent = compiledTemplate(botDataAfterUpdate);

 // Escribe el contenido final en README.md
 await fs.writeFile('./README.md', finalContent, 'utf8');

 // Actualiza README.md con la última fecha de actividad
 await updateLastConnection("DaniDeDos");
}

async function updateReadme() {
 try {
 const lastActivityDate = await getLastActivityDate("DaniDeDos");
 let content = await fs.readFile("./README.md", { encoding: "utf-8" });
 const regex = /<p align="right"><i>ultima coneccion<\/i> : <b>(.*?)<\/b><\/p>/;
 const match = content.match(regex);
 if (match) {
 const updatedLine = `<p align="right"><i>ultima coneccion</i> : <b>${lastActivityDate}</b></p>`;
 const updatedContent = content.replace(regex, updatedLine);
 await fs.writeFile("./README.md", updatedContent, { encoding: "utf-8" });
 console.log("Actualizado readme.md con éxito");
 } else {
 console.error("No se pudo encontrar la línea que contiene la última actividad");
 }
 } catch (error) {
 console.error("Ocurrió un error:", error);
 }
}


async function setBotActiveState(state) {
 const botStatus = JSON.parse(await fs.readFile('./status.json', 'utf8'));
 botStatus.botStatus = state;
 await fs.writeFile('./status.json', JSON.stringify(botStatus), 'utf8');
}



main();
