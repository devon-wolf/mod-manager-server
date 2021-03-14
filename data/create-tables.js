const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );
                CREATE TABLE games (
                    id SERIAL PRIMARY KEY,
                    db_id INTEGER NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    domain_name VARCHAR(512) NOT NULL
                );
                CREATE TABLE mods (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    summary VARCHAR(512) NOT NULL,
                    db_uid BIGINT NOT NULL,
                    db_mod_id INTEGER NOT NULL,
                    db_game_id INTEGER NOT NULL,
                    domain_name VARCHAR(512) NOT NULL,
                    version VARCHAR(512) NOT NULL,
                    author VARCHAR(512) NOT NULL,
                    dependencies text[],
                    game_id INTEGER NOT NULL REFERENCES games(id)
                );
                CREATE TABLE user_games (
                  id SERIAL PRIMARY KEY,
                  game_name VARCHAR(512) NOT NULL,
                  game_id INTEGER NOT NULL REFERENCES games(id),
                  owner_id INTEGER NOT NULL REFERENCES users(id)
                );
                CREATE TABLE user_mods (
                  id SERIAL PRIMARY KEY,
                  mod_name VARCHAR(512) NOT NULL,
                  mod_id INTEGER NOT NULL REFERENCES mods(id),
                  game_id INTEGER NOT NULL REFERENCES games(id),
                  last_download TIMESTAMP NOT NULL,
                  owner_id INTEGER NOT NULL REFERENCES users(id)
                );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
