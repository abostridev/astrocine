require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { globalLimiter, searchLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json());
app.use(globalLimiter);

app.use('/api/movies', require('./routes/movies'));
app.use('/api/series', require('./routes/series'));
app.use('/api/search', searchLimiter, require('./routes/search'));
app.use('/api/player', require('./routes/player'));
app.use('/api/genres', require('./routes/genres'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(PORT, () => console.log(`Backend lancé sur http://localhost:${PORT}`));
