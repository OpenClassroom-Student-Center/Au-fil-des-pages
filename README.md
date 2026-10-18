# Au fil des pages — dépôt d'entraînement

Petite application web d'une librairie de quartier : le catalogue des livres est lu dans une base **PostgreSQL** lancée avec **Docker Compose**, puis affiché par un serveur **Node.js / Express**.

Ce dépôt sert uniquement à vous **entraîner** en suivant la ressource « Configurez votre environnement de développement ». Les gestes appris ici sont à reproduire, seul, sur le projet de la mission.

> Les fichiers HTML et CSS contiennent volontairement quelques erreurs : ce sont les linters que vous installerez qui doivent les trouver.

## Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Git | 2.40 | `git --version` |
| Node.js (LTS) | 22 | `node -v` |
| npm | 10 | `npm -v` |
| Docker Desktop (avec Compose) | 4.x | `docker --version` puis `docker compose version` |

## Démarrage rapide

1. Forkez ce dépôt, clonez **votre fork**, puis créez une branche de travail :
   ```bash
   git clone https://github.com/<votre-compte>/demo-librairie-env.git
   cd demo-librairie-env
   git switch -c feature/env-setup
   ```
2. Créez votre fichier d'environnement **avant** le premier démarrage de la base :
   ```bash
   cp .env.example .env
   ```
3. Démarrez la base (les scripts de `db/init/` créent les tables et insèrent les données au premier démarrage) :
   ```bash
   docker compose up -d
   docker compose logs db
   ```
4. Installez les dépendances et lancez l'application :
   ```bash
   npm install
   npm start
   ```
5. Ouvrez http://localhost:3000.

## Structure

```
.
├── db/init/           # Scripts SQL exécutés au premier démarrage du conteneur
├── public/            # Fichiers statiques : CSS, images, page « À propos »
├── views/             # Gabarits HTML remplis par le serveur
├── server.js          # Serveur Express : lit la base et affiche les pages
├── docker-compose.yml # Service PostgreSQL
└── .env.example       # Modèle des variables d'environnement (à copier en .env)
```

## Repartir d'une base vierge

Les scripts de `db/init/` ne s'exécutent que lorsque le volume de données est vide. Pour les rejouer, supprimez le volume (les données sont perdues) :

```bash
docker compose down -v
docker compose up -d
```
