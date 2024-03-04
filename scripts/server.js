import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/leaderboard', async (_, res) => {
  try {
    let json = await fs.readFile('leaderboard.json');
    let obj = JSON.parse(json);
    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));