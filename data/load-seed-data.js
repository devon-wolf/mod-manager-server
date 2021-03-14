const client = require('../lib/client');
// import our seed data:
const games = require('./games.js');
const mods  = require('./mods.js');
const user_games = require('./user-games.js');
const user_mods = require('./user-mods.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    await Promise.all(
      games.map(game => {
        const { db_id, name, domain_name } = game;
        return client.query(`
                    INSERT INTO games (db_id, name, domain_name)
                    VALUES ($1, $2, $3);
                `,
        [db_id, name, domain_name]);
      })
    );

    await Promise.all(
      mods.map(mod => {
        const { name, summary, db_uid, db_mod_id, db_game_id, domain_name, version, author, game_id } = mod;
        return client.query(`
                    INSERT INTO mods (name, summary, db_uid, db_mod_id, db_game_id, domain_name, version, author, game_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
                `,
        [name, summary, db_uid, db_mod_id, db_game_id, domain_name, version, author, game_id]);
      })
    );

    await Promise.all(
      user_games.map(game => {
        const { game_name, game_id, owner_id } = game;
        return client.query(`
                    INSERT INTO user_games (game_name, game_id, owner_id)
                    VALUES ($1, $2, $3);
                `,
        [game_name, game_id, owner_id]);
      })
    );

    await Promise.all(
      user_mods.map(mod => {
        const { mod_name, mod_id, game_id, last_download, owner_id } = mod;
        return client.query(`
                    INSERT INTO user_mods (mod_name, mod_id, game_id, last_download, owner_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [mod_name, mod_id, game_id, last_download, owner_id]);
      })
    );

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
