-- Schéma de la librairie « Au fil des pages » (dépôt d'entraînement)
-- Exécuté automatiquement au PREMIER démarrage du conteneur, quand le volume est vide.

CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    auteur VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    prix DECIMAL(5, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    resume TEXT
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id),
    livre_id INTEGER NOT NULL REFERENCES livres(id),
    date_retrait DATE NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'en_attente' -- en_attente, prete, retiree
);
