-- SQLBook: Code
CREATE TABLE Service (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    statut ENUM(
        'Production',
        'Marketing',
        'Innovation',
        'Vente',
        'Comptabilité',
        'Logistique',
        'Qualité',
        'Sécurité',
        'RH',
        'Juridique',
        'Maintenance',
        'Autre'
    )
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
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    justification TEXT,
    statut_id INT NOT NULL,
    FOREIGN KEY (statut_id) REFERENCES Statut (id) ON DELETE CASCADE
);

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    picture TEXT,
    isAdmin BOOLEAN DEFAULT FALSE,
    service_id INT NOT NULL,
    FOREIGN KEY (service_id) REFERENCES Service (id) ON DELETE CASCADE
);

CREATE TABLE Comment (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    idea_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (idea_id) REFERENCES Idea (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Media (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    url VARCHAR(500) NOT NULL,
    type ENUM('image', 'video') NOT NULL,
    idea_id INT NOT NULL,
    FOREIGN KEY (idea_id) REFERENCES Idea (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Vote (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    agree BOOLEAN NOT NULL DEFAULT FALSE,
    disagree BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idea_id INT NOT NULL,
    FOREIGN KEY (idea_id) REFERENCES Idea (id) ON DELETE CASCADE,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE
);

CREATE TABLE User_idea (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE,
    idea_id INT NOT NULL,
    FOREIGN KEY (idea_id) REFERENCES Idea (id) ON DELETE CASCADE,
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
    foreign key (idea_id) references Idea (id) on delete cascade
);


INSERT INTO
    Service (statut)
VALUES ('Production'),
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

INSERT INTO
    User (
        firstname,
        lastname,
        mail,
        password,
        picture,
        isAdmin,
        service_id
    )
VALUES (
        'admin',
        'admin',
        'admin@admin.com',
        '$2b$10$DSrLC0m4iiXTiaEBYJjOKOofyBSpKiJyOfqniF6G8gM5qoQkf0DJG',
        'https://i.etsystatic.com/34185979/r/il/ac579f/4769986190/il_1588xN.4769986190_jiiq.jpg',
        TRUE,
        1
    ),
    (
        'Compte',
        'anonyme',
        'anonyme@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        TRUE,
        1
    ),
    (
        'Lucas',
        'Martin',
        'lucas.martin@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/men/1.jpg',
        FALSE,
        1
    ),
    (
        'Emma',
        'Durand',
        'emma.durand@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/women/2.jpg',
        FALSE,
        2
    ),
    (
        'Hugo',
        'Lefevre',
        'hugo.lefevre@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/men/3.jpg',
        FALSE,
        3
    ),
    (
        'Léa',
        'Moreau',
        'lea.moreau@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/women/4.jpg',
        FALSE,
        4
    ),
    (
        'Arthur',
        'Garcia',
        'arthur.garcia@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/men/5.jpg',
        FALSE,
        5
    ),
    (
        'Chloé',
        'Bernard',
        'chloe.bernard@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/women/6.jpg',
        FALSE,
        6
    ),
    (
        'Louis',
        'Petit',
        'louis.petit@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/men/7.jpg',
        FALSE,
        7
    ),
    (
        'Manon',
        'Roux',
        'manon.roux@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/women/8.jpg',
        FALSE,
        8
    ),
    (
        'Maxime',
        'Fournier',
        'maxime.fournier@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/men/9.jpg',
        FALSE,
        9
    ),
    (
        'Camille',
        'Girard',
        'camille.girard@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/women/10.jpg',
        FALSE,
        10
    ),
    (
        'Nathan',
        'Andre',
        'nathan.andre@example.com',
        '$2b$10$Yz7hpQrpZJBaXQpkk58FauS598.lnN2ATiBeWWRs45XogCJtRnFRC',
        'https://randomuser.me/api/portraits/men/11.jpg',
        FALSE,
        11
    );

insert into
    Statut (statut)
values ("En cours"),
    ("Validé"),
    ("Refusé");

INSERT INTO
    Idea (
        title,
        description,
        deadline,
        timestamp,
        statut_id
    )
VALUES (
        "Machine en mauvais état",
        "La machine à café actuelle est souvent en panne et engendre de nombreuses frustrations parmi les employés. Il serait bénéfique de la remplacer ou de la faire réparer durablement. Cela améliorerait le moral et la productivité du personnel.",
        "2024-12-12",
        "2024-09-27",
        2
    ),
    (
        "Poste de travail ergonomique",
        "Les postes de travail ne sont pas adaptés aux besoins ergonomiques des employés, ce qui peut provoquer des douleurs ou troubles musculo-squelettiques. Une révision de l’agencement des bureaux, chaises et écrans est proposée afin d'améliorer le confort et la santé au quotidien.",
        "2025-06-06",
        "2025-05-16",
        1
    ),
    (
        "Réduction des déchets plastiques",
        "L'utilisation excessive de plastique à usage unique dans l'entreprise représente un impact environnemental important. Il serait pertinent d’introduire des alternatives durables et de sensibiliser le personnel aux gestes écoresponsables pour réduire notre empreinte écologique.",
        "2025-06-07",
        "2025-07-09",
        1
    ),
    (
        "Application mobile interne",
        "La communication entre les équipes pourrait être largement améliorée par une application mobile dédiée. Elle permettrait de centraliser les échanges, calendriers, documents partagés et notifications importantes dans un outil unique, accessible à tout moment.",
        "2026-03-06",
        "2025-07-09",
        1
    ),
    (
        "Optimisation des horaires",
        "Le système actuel d’horaires rigides ne convient pas à tous les services. Une organisation plus souple, avec possibilité de télétravail ou de plages horaires aménagées, pourrait favoriser une meilleure gestion du temps et un équilibre vie professionnelle/personnelle.",
        "2025-03-20",
        "2024-11-01",
        2
    ),
    (
        "Nouveau processus de feedback",
        "Le feedback est actuellement rare et peu structuré. Mettre en place un processus de retour d'information régulier, anonyme et constructif permettrait d'améliorer la transparence, de valoriser les efforts des employés et de corriger rapidement les points bloquants.",
        "2025-05-20",
        "2024-12-12",
        3
    ),
    (
        "Campagne bien-être au travail",
        "Le stress et la fatigue ont un impact croissant sur la motivation des équipes. Une campagne bien-être incluant des séances de yoga, de méditation, des conférences et des activités sociales pourrait améliorer la santé mentale et renforcer la cohésion interne.",
        "2026-02-07",
        "2025-07-09",
        1
    ),
    (
        "Automatisation du reporting",
        "Les rapports hebdomadaires sont chronophages et souvent réalisés manuellement. Automatiser la génération de ces documents permettrait de gagner un temps précieux, de fiabiliser les données et de se concentrer sur l’analyse plutôt que la collecte d’informations.",
        "2025-05-04",
        "2024-11-10",
        3
    ),
    (
        "Sécurité incendie renforcée",
        "Les dispositifs actuels de sécurité incendie sont vieillissants et parfois non conformes. Il est urgent de revoir l’installation des détecteurs, extincteurs, plans d’évacuation et de proposer des formations régulières pour garantir la sécurité de tous les collaborateurs.",
        "2026-02-23",
        "2025-07-09",
        1
    ),
    (
        "Formation continue des équipes",
        "Le développement des compétences est essentiel à l’évolution de l’entreprise. Il est proposé de créer un programme de formation continue, en ligne ou en présentiel, permettant à chacun d’acquérir de nouvelles aptitudes et de s’adapter aux évolutions du marché.",
        "2025-01-13",
        "2024-08-31",
        3
    ),
    (
        "Révision des fournisseurs",
        "Les coûts liés à certains fournisseurs semblent excessifs sans justification claire. Une étude comparative et une renégociation des contrats pourraient générer des économies importantes tout en maintenant, voire en améliorant, la qualité des services et produits.",
        "2025-03-08",
        "2024-11-17",
        2
    ),
    (
        "Aménagement espace détente",
        "L’espace détente est peu utilisé car il manque de confort et de convivialité. Le réaménager avec du mobilier agréable, une décoration chaleureuse et des équipements comme une machine à café ou des jeux de société pourrait en faire un véritable lieu de pause régénérante.",
        "2025-03-14",
        "2024-10-20",
        2
    ),
    (
        "Covoiturage entreprise",
        "Beaucoup d'employés se déplacent seuls en voiture, ce qui augmente les coûts et l’empreinte carbone. La mise en place d’un système de covoiturage structuré favoriserait les trajets partagés, réduirait le trafic et améliorerait l’ambiance entre collègues.",
        "2025-05-08",
        "2024-11-19",
        3
    ),
    (
        "Centralisation documentation",
        "La documentation est éparpillée sur différents supports, ce qui complique l’accès à l’information. Une plateforme centralisée et bien organisée permettrait un gain de temps significatif, une meilleure traçabilité et un accès équitable pour tous les services.",
        "2025-03-09",
        "2024-09-30",
        2
    ),
    (
        "Réduction bruit open space",
        "Le bruit constant dans les open spaces nuit à la concentration et à l'efficacité. Installer des panneaux acoustiques, proposer des casques antibruit et aménager des espaces silencieux pourrait grandement améliorer le confort sonore des collaborateurs.",
        "2026-04-16",
        "2025-07-09",
        1
    ),
    (
        "Outil de suivi de projet",
        "Le suivi des projets est actuellement dispersé entre plusieurs outils non synchronisés. Un logiciel unique, simple et intuitif, permettrait de mieux planifier, suivre les étapes, collaborer efficacement et respecter les délais, tout en gardant une trace claire de l’avancement.",
        "2025-11-19",
        "2025-06-17",
        1
    );

INSERT INTO
    User_idea (user_id, idea_id, isCreator)
VALUES (3, 1, TRUE),
    (7, 2, TRUE),
    (10, 3, TRUE),
    (9, 4, TRUE),
    (11, 5, TRUE),
    (3, 6, TRUE),
    (5, 7, TRUE),
    (6, 8, TRUE),
    (3, 9, TRUE),
    (12, 10, TRUE),
    (3, 11, TRUE),
    (8, 12, TRUE),
    (4, 13, TRUE),
    (6, 14, TRUE),
    (10, 15, TRUE),
    (9, 16, TRUE);

INSERT INTO
    Vote (
        agree,
        disagree,
        idea_id,
        user_id
    )
VALUES (TRUE, FALSE, 1, 4),
    (FALSE, TRUE, 1, 4),
    (FALSE, TRUE, 1, 5),
    (FALSE, TRUE, 1, 8),
    (TRUE, FALSE, 1, 9),
    (TRUE, FALSE, 1, 10),
    (FALSE, TRUE, 2, 4),
    (TRUE, FALSE, 2, 3),
    (FALSE, TRUE, 2, 5),
    (TRUE, FALSE, 2, 6),
    (TRUE, FALSE, 2, 7),
    (TRUE, FALSE, 2, 9),
    (FALSE, TRUE, 2, 12),
    (TRUE, FALSE, 3, 5),
    (TRUE, FALSE, 3, 4),
    (TRUE, FALSE, 3, 5),
    (TRUE, FALSE, 3, 6),
    (TRUE, FALSE, 3, 9),
    (FALSE, TRUE, 3, 11),
    (TRUE, FALSE, 4, 5),
    (FALSE, TRUE, 4, 4),
    (FALSE, TRUE, 4, 5),
    (FALSE, TRUE, 4, 6),
    (TRUE, FALSE, 4, 9),
    (TRUE, FALSE, 4, 12),
    (TRUE, FALSE, 5, 6),
    (TRUE, FALSE, 5, 3),
    (FALSE, TRUE, 5, 4),
    (TRUE, FALSE, 5, 7),
    (FALSE, TRUE, 5, 11),
    (FALSE, TRUE, 6, 7),
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
    (FALSE, TRUE, 10, 8),
    (TRUE, FALSE, 10, 5),
    (TRUE, FALSE, 10, 8),
    (TRUE, FALSE, 10, 10),
    (TRUE, FALSE, 11, 8),
    (FALSE, TRUE, 11, 3),
    (TRUE, FALSE, 11, 6),
    (FALSE, TRUE, 11, 9),
    (TRUE, FALSE, 11, 11),
    (FALSE, TRUE, 12, 3),
    (TRUE, FALSE, 12, 5),
    (TRUE, FALSE, 12, 6),
    (TRUE, FALSE, 12, 8),
    (TRUE, FALSE, 12, 9),
    (TRUE, FALSE, 13, 8),
    (TRUE, FALSE, 13, 4),
    (FALSE, TRUE, 13, 5),
    (TRUE, FALSE, 13, 8),
    (FALSE, TRUE, 13, 11),
    (TRUE, FALSE, 14, 3),
    (TRUE, FALSE, 14, 5),
    (TRUE, FALSE, 14, 6),
    (TRUE, FALSE, 14, 9),
    (FALSE, TRUE, 14, 11),
    (FALSE, TRUE, 15, 9),
    (TRUE, FALSE, 15, 4),
    (TRUE, FALSE, 15, 7),
    (FALSE, TRUE, 15, 9),
    (TRUE, FALSE, 15, 11),
    (FALSE, TRUE, 16, 9),
    (TRUE, FALSE, 16, 3),
    (TRUE, FALSE, 16, 5),
    (FALSE, TRUE, 16, 7),
    (TRUE, FALSE, 16, 11);

INSERT INTO
    Comment (
        created_at,
        content,
        idea_id,
        user_id
    )
VALUES (
        NOW(),
        'This is a comment',
        1,
        1
    ),
    (
        NOW(),
        'This is another comment',
        1,
        5
    );

INSERT INTO
    Media (
        created_at,
        url,
        type,
        idea_id
    )
VALUES (
        NOW(),
        'https://www.pexels.com/fr-fr/photo/aurores-boreales-3025005',
        'image',
        1
    ),
    (
        NOW(),
        'https://www.pexels.com/fr-fr/video/nature-ciel-soleil-couchant-nuages-6528444',
        'video',
        1
    );

insert into
    Category (category)
values ("Amélioration"),
    ("Conditions de travail"),
    ("Innovation"),
    ("Relation client"),
    ("Optimisation des coûts"),
    ("Développement durable"),
    ("Vie d'équipe");

INSERT INTO
    Category_idea (category_id, idea_id)
VALUES (1, 1),
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

-- NB : Mot de passe utilisateur : "pass123". Mot de passe admin : "admin" 