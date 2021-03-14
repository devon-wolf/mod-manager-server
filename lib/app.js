const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/games', async(req, res) => {
  try {
    const data = await client.query('SELECT * from games');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/mods', async(req, res) => {
  try {
    const data = await client.query('SELECT * from mods');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/games', async(req, res) => {
  try {
    const data = await client.query('SELECT * from user_games WHERE owner_id=$1', [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/games/:id', async(req, res) => {
  try {
    const data = await client.query('SELECT * from user_games WHERE id=$1', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/mods', async(req, res) => {
  try {
    const data = await client.query('SELECT * from user_mods WHERE owner_id=$1', [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/games', async(req, res) => {
  try {
    const { game_name, game_id } = req.body;
    const data = await client.query(`
      INSERT into user_games (game_name, game_id, owner_id)
      values ($1, $2, $3)
      returning *`,
    [game_name, game_id, req.userId]);

    res.json(data.rows[0]);
  }
  catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.post('/api/mods', async(req, res) => {
  try {
    const { mod_name, mod_id, game_id, last_download } = req.body;
    const data = await client.query(`
      INSERT into user_mods (mod_name, mod_id, game_id, last_download, owner_id)
      values ($1, $2, $3, $4, $5)
      returning *`,
    [mod_name, mod_id, game_id, last_download, req.userId]);

    res.json(data.rows[0]);
  }
  catch(e) {

    res.status(500).json({ error: e.message });
  }
});

app.put('/api/mods/:id', async(req, res) => {

});

app.delete('/api/games/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE from user_games WHERE id=$1 returning *', [req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.delete('api/mods/:id', async(req, res) => {

});

app.use(require('./middleware/error'));

module.exports = app;
