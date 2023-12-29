import axios from "axios";
import Handlebars from 'handlebars';
import fs from 'fs/promises';

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
 const updatedContent = compiledTemplate(botData);

 // Escribir el contenido actualizado en README.md
 await fs.writeFile('./README.md', updatedContent, 'utf8');

 // Actualiza el estado del bot
 await isBotActive("DaniDeDos");

 // Leer el estado del bot de nuevo
 const botStatusAfterUpdate = await fs.readFile('./status.json', 'utf8');
 const botDataAfterUpdate = JSON.parse(botStatusAfterUpdate);

 // Renderiza la plantilla con los datos del bot
 const updatedContentAfterUpdate = compiledTemplate(botDataAfterUpdate);

 // Escribe el contenido actualizado en README.md
 await fs.writeFile('./README.md', updatedContentAfterUpdate, 'utf8');

 // Actualiza README.md con la última fecha de actividad
 await updateReadme();
}


async function isBotActive(username) {
 const response = await axios.get(`https://api.github.com/users/${username}/events`);
 let botActive = false;
 if (response.data && response.data.length > 0) {
 botActive = true;
 }
 // Actualizar el estado del bot en el archivo status.json
 await fs.writeFile("./status.json", JSON.stringify({ botStatus: botActive }), { encoding: "utf-8" });
}

const getLastActivityDate = async (username) => {
 const response = await axios.get(`https://api.github.com/users/${username}/events`);
 if (response.data && response.data.length > 0) {
 // Find the latest event that is a PushEvent
 const latestPushEvent = response.data.find(event => event.type === 'PushEvent');
 if (latestPushEvent) {
 return new Date(latestPushEvent.created_at).toLocaleString();
 } else {
 throw new Error("No PushEvent found for this user");
 }
 } else {
 throw new Error("No events found for this user");
 }
};

async function updateReadme() {
 try {
 const lastActivityDate = await getLastActivityDate("DaniDeDos");
 let content = await fs.readFile("./README.md", { encoding: "utf-8" });
 const regex = /<p align="right"><i>ultima coneccion<\/i> : <b>(.*?)<\/b><\/p>/;
 const match = content.match(regex);
 if (match) {
 const updatedContent = content.replace(regex, `<p align="right"><i>ultima coneccion</i> : <b>${lastActivityDate}</b></p>`);
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
