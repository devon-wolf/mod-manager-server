const request = require('superagent');

// base URL for Nexus API
const URL = 'api.nexusmods.com';
const token = process.env.NEXUS_API_KEY;

async function getAllGames() {
  const response = await request.get(`${URL}/v1/games.json`)
    .set({ apikey: token });

  return response.body;
}

async function getGameByDomain(domain) {
  const response = await request.get(`${URL}/v1/games/${domain}.json`)
    .set({ apikey: token });

  return response.body;
}

async function getModByID(domain, id) {
  const response = await request.get(`${URL}/v1/games/${domain}/mods/${id}.json`)
    .set({ apikey: token });

  return response.body;
}

async function getModFileList(domain, id) {
  const response = await request.get(`${URL}/v1/games/${domain}/mods/${id}/files.json`)
    .set({ apikey: token });

  return response.body;
}

async function getModFileDetails(domain, id, fileID) {
  const response = await request.get(`${URL}/v1/games/${domain}/mods/${id}/files/${fileID}.json`)
    .set({ apikey: token });

  return response.body;
}

// there are additional circumstances to consider here, probably don't use yet
async function getModDownloadLink(domain, id, fileID) {
  const response = await request.get(`${URL}/v1/games/${domain}/mods/${id}/files/${fileID}/download_link.json`)
    .set({ apikey: token });

  return response.body;
}

module.exports = {
  getAllGames,
  getGameByDomain,
  getModByID,
  getModFileList,
  getModFileDetails,
  getModDownloadLink
};