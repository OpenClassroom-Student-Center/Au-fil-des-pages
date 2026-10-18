-- Jeu de données de test (fictif)

INSERT INTO livres (titre, auteur, genre, prix, stock, resume) VALUES
    ('Le Jardin des brumes', 'Claire Morel', 'Roman', 19.90, 6, 'Une saga familiale dans une maison de bord de mer.'),
    ('Coder sans peur', 'Hugo Lambert', 'Informatique', 32.00, 3, 'Une introduction bienveillante à la programmation web.'),
    ('Les Étoiles de papier', 'Inès Garnier', 'Jeunesse', 12.50, 10, 'Une petite fille fabrique des étoiles pour rallumer le ciel.'),
    ('Cuisine des quatre saisons', 'Paul Renaud', 'Cuisine', 24.00, 0, 'Cent recettes simples au fil de l''année.'),
    ('Le Dernier Phare', 'Marc Delmas', 'Policier', 21.50, 4, 'Un meurtre sur une île coupée du monde par la tempête.');

INSERT INTO clients (nom, email) VALUES
    ('Léa Martin', 'lea.martin@example.com'),
    ('Yanis Robert', 'yanis.robert@example.com'),
    ('Sofia Petit', 'sofia.petit@example.com');

INSERT INTO reservations (client_id, livre_id, date_retrait, statut) VALUES
    (1, 1, CURRENT_DATE + 1, 'en_attente'),
    (2, 2, CURRENT_DATE, 'prete'),
    (3, 3, CURRENT_DATE - 2, 'retiree');
