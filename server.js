// Application de démonstration « Au fil des pages »
// Serveur Express qui lit le catalogue dans PostgreSQL et l'affiche en HTML.
// Les variables d'environnement sont chargées depuis .env par le script npm start
// (option --env-file de Node.js).

const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = Number(process.env.PORT) || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Lit un gabarit HTML du dossier views/ et remplace les marqueurs {{cle}}.
function render(view, values) {
  const template = fs.readFileSync(path.join(__dirname, 'views', view), 'utf8');
  return template.replace(/{{(\w+)}}/g, (_, key) => values[key] ?? '');
}

// Échappe le texte venant de la base avant de l'insérer dans le HTML.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatPrice(value) {
  return Number(value).toFixed(2).replace('.', ',') + ' €';
}

app.use(express.static(path.join(__dirname, 'public')));

// Page d'accueil : le catalogue, lu dans la table livres.
app.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, titre, auteur, genre, prix, stock FROM livres ORDER BY titre');
    const cards = rows.map((livre) => `
      <li class="carte">
        <h2><a href="/livres/${livre.id}">${escapeHtml(livre.titre)}</a></h2>
        <p class="auteur">${escapeHtml(livre.auteur)} · ${escapeHtml(livre.genre)}</p>
        <p class="prix">${formatPrice(livre.prix)}</p>
        <p class="stock">${livre.stock > 0 ? `${livre.stock} en stock` : 'Épuisé'}</p>
      </li>`).join('');
    res.send(render('catalogue.html', { cartes: cards, total: rows.length }));
  } catch (error) {
    next(error);
  }
});

// Fiche d'un livre.
app.get('/livres/:id', async (req, res, next) => {
  if (!/^\d+$/.test(req.params.id)) {
    res.status(404).send(render('introuvable.html', {}));
    return;
  }
  try {
    const { rows } = await pool.query('SELECT * FROM livres WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).send(render('introuvable.html', {}));
      return;
    }
    const livre = rows[0];
    res.send(render('livre.html', {
      titre: escapeHtml(livre.titre),
      auteur: escapeHtml(livre.auteur),
      genre: escapeHtml(livre.genre),
      prix: formatPrice(livre.prix),
      stock: livre.stock > 0 ? `${livre.stock} exemplaire(s) en stock` : 'Épuisé',
      resume: escapeHtml(livre.resume ?? ''),
    }));
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, _next) => {
  console.error('[Server] Erreur :', error.message);
  res.status(500).send('Erreur serveur : consultez le terminal.');
});

// Express 5 transmet au callback une éventuelle erreur de démarrage (ex. port déjà utilisé).
app.listen(port, async (error) => {
  if (error) {
    console.error(`[Server] Impossible de démarrer sur le port ${port} : ${error.message}`);
    process.exit(1);
  }
  console.log(`[Server] Serveur Node.js démarré sur le port ${port}`);
  try {
    await pool.query('SELECT 1');
    console.log(`[Database] Connexion réussie à la base de données PostgreSQL (${process.env.DB_NAME})`);
    console.log(`[Server] Ouvrez http://localhost:${port}`);
  } catch (error) {
    console.error(`[Database] Échec de la connexion à PostgreSQL : ${error.message}`);
    process.exit(1);
  }
});
