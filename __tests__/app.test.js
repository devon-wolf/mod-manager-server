require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns games', async() => {

      const expectation = [{
        id: 1,
        'db_id': 1303,
        'name': 'Stardew Valley',
        'domain_name': 'stardewvalley',
      }];

      const data = await fakeRequest(app)
        .get('/games')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns mods', async() => {

      const expectation = [{
        'name': 'SMAPI - Stardew Modding API',
        'summary': 'The mod loader for Stardew Valley.',
        'db_uid': '5596342389088',
        'db_mod_id': 2400,
        'db_game_id': 1303,
        'domain_name': 'stardewvalley',
        'version': '3.9.4',
        'author': 'Pathoschild',
        'game_id': 1,
        id: 1,
        dependencies: null
      },
      {
        'name': 'Stardew Valley Expanded',
        'summary': 'Stardew Valley Expanded is a fanmade expansion for ConcernedApe\'s Stardew Valley. This mod features 26 new locations, 160 new character events, 12 new NPCs, a new village, 800 location messages, reimagined maps and festivals (all maps), a huge remastered farm map, a new world map reflecting all changes, and many miscellaneous additions!',
        'db_uid': '5596342390441',
        'db_mod_id': 3753,
        'db_game_id': 1303,
        'domain_name': 'stardewvalley',
        'version': '1.12.16',
        'author': 'FlashShifter',
        'game_id': 1,
        id: 2,
        dependencies: null
      }];

      const data = await fakeRequest(app)
        .get('/mods')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('adds a game to the library as the test user', async() => {

      const newGame = {
        game_name: 'Stardew Valley',
        game_id: 1
      };

      const expectation = {
        ...newGame,
        owner_id: 2,
        id: 2
      };

      const data = await fakeRequest(app)
        .post('/api/games')
        .set({ Authorization: token })
        .send(newGame)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('gets all games from the library as the test user', async() => {

      const expectation = [{
        game_name: 'Stardew Valley',
        game_id: 1,
        owner_id: 2,
        id: 2
      }];

      const data = await fakeRequest(app)
        .get('/api/games')
        .set({ Authorization: token })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('gets a game by its ID from the library as the test user', async() => {

      const expectation = {
        game_name: 'Stardew Valley',
        game_id: 1,
        owner_id: 2,
        id: 2
      };

      const data = await fakeRequest(app)
        .get('/api/games/2')
        .set({ Authorization: token })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('deletes a game from the library as the test user', async() => {
      const expectation = {
        game_name: 'Stardew Valley',
        game_id: 1,
        owner_id: 2,
        id: 2
      };

      const data = await fakeRequest(app)
        .delete('/api/games/2')
        .set({ Authorization: token })
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(data.body).toEqual(expectation);

    });

    test('adds a mod to the library as the test user', async() => {

      const newMod = {
        mod_name: 'Stardew Valley Expanded',
        mod_id: 2,
        game_id: 1,
        last_download: '2021-03-08T05:16:05.000+00:00'
      };

      const expectation = {
        ...newMod,
        owner_id: 2,
        id: 2
      };

      const data = await fakeRequest(app)
        .post('/api/mods')
        .set({ Authorization: token })
        .send(newMod)
        .expect('Content-Type', /json/);
        //.expect(200);

      expect(data.body).toEqual(expectation);
    });

  });
});
