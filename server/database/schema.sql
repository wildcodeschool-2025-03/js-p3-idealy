create table Category (
    id int primary key auto_increment not null,
    category varchar(255) not null unique default 'Amélioration'
);

create table Statut (
    id int primary key auto_increment not null,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM(
        'En cours',
        'Validé',
        'Refusé'
    ) DEFAULT 'En cours',
);

create table Category_idea (
    id int primary key auto_increment not null,
    category_id int not null,
    foreign key (category_id) references Category (id),
    idea_id int not null,
    foreign key (idea_id) references Idea (id)
);

insert into
    Category (category)
values ("Amélioration"),
    ("Conditions de travail"),
    (
        "Innovation / Nouveaux projets"
    ),
    ("Relation client"),
    ("Optimisation des coûts"),
    ("Développement durable"),
    ("Vie d'équipe");

insert into
    Statut (statut, idea_id)
values ("En cours", 1),
    ("Validé", 1),
    ("Refusé", 1);