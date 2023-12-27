const axios = require("axios");
const fs = require("fs").promises;

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

updateReadme();
