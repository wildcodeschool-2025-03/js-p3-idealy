-- SQLBook: Code
  CREATE TABLE Service(
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  statut ENUM('Production', 'Marketing', 'Innovation', 'Vente', 'Comptabilité', 'Logistique', 'Qualité', 'Sécurité', 'RH', 'Juridique', 'Maintenance', 'Autre')
);

create table Statut (
    id int primary key auto_increment not null,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM(
        'En cours',
        'Validé',
        'Refusé'
    ) DEFAULT 'En cours'
);

  CREATE TABLE Idea (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  deadline DATE NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  statut_id INT NOT NULL,
  FOREIGN KEY (statut_id) REFERENCES Statut(id) ON DELETE CASCADE
);

CREATE TABLE User(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
firstname VARCHAR(255) NOT NULL,
lastname VARCHAR(255) NOT NULL,
mail VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
picture TEXT,
isAdmin BOOLEAN DEFAULT FALSE,
service_id INT NOT NULL,
FOREIGN KEY(service_id) REFERENCES Service(id) ON DELETE CASCADE
);

  CREATE TABLE Comment (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  content TEXT NOT NULL,
  idea_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (idea_id) REFERENCES Idea(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Media (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  url VARCHAR(500) NOT NULL,
  type ENUM('image', 'video') NOT NULL,
  idea_id INT NOT NULL,
  FOREIGN KEY (idea_id) REFERENCES Idea(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Vote (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  agree BOOLEAN NOT NULL DEFAULT FALSE,
  disagree BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  idea_id INT NOT NULL,
  FOREIGN KEY (idea_id) REFERENCES Idea(id) ON DELETE CASCADE,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
  );

CREATE TABLE User_idea(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
user_id INT NOT NULL,
FOREIGN KEY(user_id) REFERENCES User(id),
idea_id INT NOT NULL,
FOREIGN KEY(idea_id) REFERENCES Idea(id),
isCreator BOOLEAN NOT NULL DEFAULT FALSE
);

create table Category (
    id int primary key auto_increment not null,
    category varchar(255) not null unique
);

create table Category_idea (
    id int primary key auto_increment not null,
    category_id int not null,
    foreign key (category_id) references Category (id),
    idea_id int not null,
    foreign key (idea_id) references Idea (id)
);

INSERT INTO Service(statut)
VALUES
('Production'),
('Marketing'),
('Innovation'),
('Vente'),
('Comptabilité'),
('Logistique'),
('Qualité'),
('Sécurité'),
('RH'),
('Juridique'),
('Maintenance'),
('Autre');


INSERT INTO User(firstname, lastname, mail, password, picture, isAdmin, service_id) VALUES
('admin', 'admin', 'admin@admin.com', 'admin', 'https://i.etsystatic.com/34185979/r/il/ac579f/4769986190/il_1588xN.4769986190_jiiq.jpg', TRUE, 1),
('Lucas', 'Martin', 'lucas.martin@example.com', 'pass123', 'https://randomuser.me/api/portraits/men/1.jpg', FALSE, 1),
('Emma', 'Durand', 'emma.durand@example.com', 'pass123', 'https://randomuser.me/api/portraits/women/2.jpg', FALSE, 2),
('Hugo', 'Lefevre', 'hugo.lefevre@example.com', 'pass123', 'https://randomuser.me/api/portraits/men/3.jpg', FALSE, 3),
('Léa', 'Moreau', 'lea.moreau@example.com', 'pass123', 'https://randomuser.me/api/portraits/women/4.jpg', FALSE, 4),
('Arthur', 'Garcia', 'arthur.garcia@example.com', 'pass123', 'https://randomuser.me/api/portraits/men/5.jpg', FALSE, 5),
('Chloé', 'Bernard', 'chloe.bernard@example.com', 'pass123', 'https://randomuser.me/api/portraits/women/6.jpg', FALSE, 6),
('Louis', 'Petit', 'louis.petit@example.com', 'pass123', 'https://randomuser.me/api/portraits/men/7.jpg', FALSE, 7),
('Manon', 'Roux', 'manon.roux@example.com', 'pass123', 'https://randomuser.me/api/portraits/women/8.jpg', FALSE, 8),
('Maxime', 'Fournier', 'maxime.fournier@example.com', 'pass123', 'https://randomuser.me/api/portraits/men/9.jpg', FALSE, 9),
('Camille', 'Girard', 'camille.girard@example.com', 'pass123', 'https://randomuser.me/api/portraits/women/10.jpg', FALSE, 10),
('Nathan', 'Andre', 'nathan.andre@example.com', 'pass123', 'https://randomuser.me/api/portraits/men/11.jpg', FALSE, 11);


insert into
    Statut (statut)
values ("En cours"),
    ("Validé"),
    ("Refusé");


  INSERT INTO Idea (title, description, deadline, statut_id) VALUES
  ("Machine en mauvais état", "Améliorer la machine à café", "2025-12-12", 2),
  ("Poste de travail ergonomique", "Proposer une solution ergonomique pour les postes de travail.", "2025-08-04", 1),
  ("Réduction des déchets plastiques", "Mettre en place des mesures pour réduire les déchets plastiques.", "2025-08-15", 1),
  ("Application mobile interne", "Développer une application interne pour faciliter la communication.", "2026-03-06", 1),
  ("Optimisation des horaires", "Réorganiser les horaires pour améliorer la productivité.", "2026-03-20", 2),
  ("Nouveau processus de feedback", "Mettre en place un processus de feedback anonyme et régulier.", "2025-08-20", 3),
  ("Campagne bien-être au travail", "Lancer une campagne bien-être incluant yoga et méditation.", "2026-02-07", 1),
  ("Automatisation du reporting", "Automatiser le reporting hebdomadaire via un outil dédié.", "2025-08-04", 3),
  ("Sécurité incendie renforcée", "Améliorer les dispositifs de sécurité en cas d’incendie.", "2026-02-23", 1),
  ("Formation continue des équipes", "Encourager la formation continue des membres de l’équipe.", "2026-01-13", 3),
  ("Révision des fournisseurs", "Revoir les contrats fournisseurs pour réduire les coûts.", "2026-03-08", 2),
  ("Aménagement espace détente", "Créer un espace détente plus accueillant pour les pauses.", "2026-03-14", 2),
  ("Covoiturage entreprise", "Mettre en place un service de covoiturage entre employés.", "2026-05-08", 3),
  ("Centralisation documentation", "Centraliser toute la documentation dans un espace unique.", "2026-03-09", 2),
  ("Réduction bruit open space", "Installer des panneaux acoustiques pour limiter le bruit.", "2026-04-16", 1),
  ("Outil de suivi de projet", "Proposer un outil simple de suivi de projet par équipe.", "2025-11-19", 1);



INSERT INTO User_idea (user_id, idea_id, isCreator) VALUES
(2, 1, TRUE),
(7, 2, TRUE),
(10, 3, TRUE),
(9, 4, TRUE),
(11, 5, TRUE),
(3, 6, TRUE),
(5, 7, TRUE),
(6, 8, TRUE),
(2, 9, TRUE),
(12, 10, TRUE),
(2, 11, TRUE),
(8, 12, TRUE),
(4, 13, TRUE),
(6, 14, TRUE),
(10, 15, TRUE),
(9, 16, TRUE);


  INSERT INTO Vote (agree, disagree, idea_id, user_id) VALUES
  (TRUE, FALSE, 1, 2),
  (FALSE, TRUE, 1, 4),
  (FALSE, TRUE, 1, 5),
  (FALSE, TRUE, 1, 8),
  (TRUE, FALSE, 1, 9),
  (TRUE, FALSE, 1, 10),
  (FALSE, TRUE, 2, 2),
  (TRUE, FALSE, 2, 3),
  (FALSE, TRUE, 2, 5),
  (TRUE, FALSE, 2, 6),
  (TRUE, FALSE, 2, 7),
  (TRUE, FALSE, 2, 9),
  (FALSE, TRUE, 2, 12),
  (TRUE, FALSE, 3, 2),
  (TRUE, FALSE, 3, 4),
  (TRUE, FALSE, 3, 5),
  (TRUE, FALSE, 3, 6),
  (TRUE, FALSE, 3, 9),
  (FALSE, TRUE, 3, 11),
  (TRUE, FALSE, 4, 2),
  (FALSE, TRUE, 4, 4),
  (FALSE, TRUE, 4, 5),
  (FALSE, TRUE, 4, 6),
  (TRUE, FALSE, 4, 9),
  (TRUE, FALSE, 4, 12),
  (TRUE, FALSE, 5, 2),
  (TRUE, FALSE, 5, 3),
  (FALSE, TRUE, 5, 4),
  (TRUE, FALSE, 5, 7),
  (FALSE, TRUE, 5, 11),
  (FALSE, TRUE, 6, 2),
  (TRUE, FALSE, 6, 3),
  (TRUE, FALSE, 6, 4),
  (TRUE, FALSE, 6, 5),
  (FALSE, TRUE, 6, 8),
  (TRUE, FALSE, 6, 11),
  (TRUE, FALSE, 7, 3),
  (TRUE, FALSE, 7, 4),
  (FALSE, TRUE, 7, 5),
  (TRUE, FALSE, 7, 6),
  (TRUE, FALSE, 7, 10),
  (TRUE, FALSE, 8, 3),
  (TRUE, FALSE, 8, 4),
  (TRUE, FALSE, 8, 5),
  (FALSE, TRUE, 8, 6),
  (TRUE, FALSE, 8, 7),
  (TRUE, FALSE, 8, 11),
  (TRUE, FALSE, 9, 3),
  (TRUE, FALSE, 9, 5),
  (FALSE, TRUE, 9, 6),
  (FALSE, TRUE, 9, 8),
  (TRUE, FALSE, 9, 10),
  (FALSE, TRUE, 10, 2),
  (FALSE, TRUE, 10, 4),
  (TRUE, FALSE, 10, 5),
  (TRUE, FALSE, 10, 8),
  (TRUE, FALSE, 10, 10),
  (TRUE, FALSE, 11, 2),
  (FALSE, TRUE, 11, 3),
  (TRUE, FALSE, 11, 6),
  (FALSE, TRUE, 11, 9),
  (TRUE, FALSE, 11, 11),
  (FALSE, TRUE, 12, 3),
  (TRUE, FALSE, 12, 5),
  (TRUE, FALSE, 12, 6),
  (TRUE, FALSE, 12, 8),
  (TRUE, FALSE, 12, 9),
  (TRUE, FALSE, 13, 2),
  (TRUE, FALSE, 13, 4),
  (FALSE, TRUE, 13, 5),
  (TRUE, FALSE, 13, 8),
  (FALSE, TRUE, 13, 11),
  (TRUE, FALSE, 14, 3),
  (TRUE, FALSE, 14, 5),
  (TRUE, FALSE, 14, 6),
  (TRUE, FALSE, 14, 9),
  (FALSE, TRUE, 14, 11),
  (FALSE, TRUE, 15, 2),
  (TRUE, FALSE, 15, 4),
  (TRUE, FALSE, 15, 7),
  (FALSE, TRUE, 15, 9),
  (TRUE, FALSE, 15, 11),
  (FALSE, TRUE, 16, 2),
  (TRUE, FALSE, 16, 3),
  (TRUE, FALSE, 16, 5),
  (FALSE, TRUE, 16, 7),
  (TRUE, FALSE, 16, 11);


INSERT INTO Comment (created_at, content, idea_id, user_id)
VALUES
(NOW(), 'This is a comment', 1, 1),
(NOW(), 'This is another comment', 1, 2);


INSERT INTO Media (created_at, url, type, idea_id)
VALUES
  (NOW(), 'https://www.pexels.com/fr-fr/photo/aurores-boreales-3025005', 'image', 1),
  (NOW(), 'https://www.pexels.com/fr-fr/video/nature-ciel-soleil-couchant-nuages-6528444', 'video', 1);


insert into
    Category (category)
values ("Amélioration"),
    ("Conditions de travail"),
    ("Innovation"),
    ("Relation client"),
    ("Optimisation des coûts"),
    ("Développement durable"),
    ("Vie d'équipe");


    INSERT INTO Category_idea (category_id, idea_id) VALUES
    (1, 1),
    (6, 2),
    (1, 2),
    (1, 3),
    (3, 3),
    (5, 3),
    (4, 4),
    (1, 4),
    (5, 5),
    (7, 5),
    (7, 6),
    (2, 6),
    (5, 7),
    (4, 8),
    (2, 8),
    (2, 9),
    (7, 9),
    (5, 10),
    (1, 10),
    (7, 11),
    (2, 12),
    (6, 12),
    (3, 13),
    (1, 14),
    (2, 14),
    (7, 14),
    (3, 15),
    (1, 15),
    (3, 16);




