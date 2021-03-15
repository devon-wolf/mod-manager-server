require('dotenv').config();

const { 
  searchGamesByName,
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
const { search } = require('../lib/app');

test('returns a game object from the API based on a search query', async() => {
  const data = await searchGamesByName('Stardew Valley');
  
  const badData = await searchGamesByName('This is a fake game');
  
  expect(data.name).toEqual('Stardew Valley');
  expect(badData.name).toEqual('no match found');
});

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

// tests for the general shape of the file list object
test('returns a file list for a mod from the API', async() => {
  const data = await getModFileList('stardewvalley', 2400);

  expect(Array.isArray(data.files)).toEqual(true);
  expect(Array.isArray(data.file_updates)).toEqual(true);
  expect(Array.isArray(data.fake_property)).toEqual(false);

});

// tests against a full object; if this test breaks, confirm whether there have been changes to the remote data that may be affecting the match
test('returns a file object from the API', async() => {
  const data = await getModFileDetails('stardewvalley', 2400, 9622);
	
  expect(data).toEqual(fileSample);
});
