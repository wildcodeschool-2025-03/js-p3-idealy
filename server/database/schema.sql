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
  agree INT NOT NULL,
  disagree INT NOT NULL,
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
FOREIGN KEY(idea_id) REFERENCES Idea(id)
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

----------------------------INSERTS-----------------------------------------------

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
  ("Machine en mauvais état", "Améliorer la machine à café", "2025-12-12", 1);


INSERT INTO User_idea (user_id, idea_id) VALUES
(1, 1);


  INSERT INTO Vote (agree, disagree, idea_id, user_id) VALUES
  (17, 5, 1, 1);


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
    ("Innovation / Nouveaux projets"),
    ("Relation client"),
    ("Optimisation des coûts"),
    ("Développement durable"),
    ("Vie d'équipe");


    INSERT INTO Category_idea (category_id, idea_id) VALUES
(1, 1);



