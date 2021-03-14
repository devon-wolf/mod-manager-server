const client = require('../lib/client');
// import our seed data:
const games = require('./games.js');
const mods  = require('./mods.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

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
        const { name, summary, db_uid, db_mod_id, db_game_id, domain_name, version, author, last_download, game_id } = mod;
        return client.query(`
                    INSERT INTO mods (name, summary, db_uid, db_mod_id, db_game_id, domain_name, version, author, last_download, game_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
                `,
        [name, summary, db_uid, db_mod_id, db_game_id, domain_name, version, author, last_download, game_id, user.id]);
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
