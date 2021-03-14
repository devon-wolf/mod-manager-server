require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const { 
  getGameByDomain, 
  getModByID, 
  getModFileList, 
  getModFileDetails
} = require('../lib/utils/api-utils');

const {
  gameSample,
  modSample,
  fileSample
} = require('../data/sample-data');


// tests only check properties that are likely to be stable (IDs and names, in contrast to, for example, download count)
test('returns a game object from the API', async() => {
  const data = await getGameByDomain('stardewvalley');

  expect(data.id).toEqual(gameSample.id);
  expect(data.name).toEqual(gameSample.name);
  expect(data.domain_name).toEqual(gameSample.domain_name);
});

test('returns a mod object from the API', async() => {
  const data = await getModByID('stardewvalley', 2400);
  
  expect(data.uid).toEqual(modSample.uid);
  expect(data.game_id).toEqual(modSample.game_id);
  expect(data.mod_id).toEqual(modSample.mod_id);
  expect(data.name).toEqual(modSample.name);
  expect(data.domain_name).toEqual(modSample.domain_name);
  expect(data.uid).toEqual(modSample.uid);
});

// tests for the general shape of the file object
test('returns a file list for a mod from the API', async() => {
  const data = await getModFileList('stardewvalley', 2400);

  expect(Array.isArray(data.files)).toEqual(true);
  expect(Array.isArray(data.file_updates)).toEqual(true);
  expect(Array.isArray(data.fake_property)).toEqual(false);

});

test('returns a file object from the API', async() => {
  const data = await getModFileDetails('stardewvalley', 2400, 9622);
	
  expect(data).toEqual(fileSample);
});