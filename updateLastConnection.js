import axios from "axios";
import fs from 'fs/promises';

export async function updateLastConnection(username) {
 try {
  const lastActivityDate = await getLastActivityDate(username);
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

  // Actualiza el estado del bot
  let botStatus = "Offline";
  if (lastActivityDate) {
    botStatus = "Online";
  }
  content = await fs.readFile("./README.md", { encoding: "utf-8" });
  const regex = /<p>Bot activo: .*?<\/p>/;
  const match = content.match(regex);
  if (match) {
    const updatedContent = content.replace(regex, `<p>Bot activo: ${botStatus}</p>`);
    await fs.writeFile("./README.md", updatedContent, { encoding: "utf-8" });
    console.log("Actualizado readme.md con éxito");
  } else {
    console.error("No se pudo encontrar la línea que contiene el estado del bot");
  }
 } catch (error) {
  console.error("Ocurrió un error:", error);
 }
}

async function getLastActivityDate(username) {
 const response = await axios.get(`https://api.github.com/users/${username}/events`);
 if (response.data && response.data.length > 0) {
  const latestPushEvent = response.data.find(event => event.type === 'PushEvent');
  if (latestPushEvent) {
    return new Date(latestPushEvent.created_at).toLocaleString();
  } else {
    throw new Error("No PushEvent found for this user");
  }
 } else {
  throw new Error("No events found for this user");
 }
}
