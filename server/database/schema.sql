USE Idealy;

CREATE TABLE comment (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  content TEXT NOT NULL,
  idea_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (idea_id) REFERENCES idea(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE media (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  url VARCHAR(500) NOT NULL,
  type ENUM('image', 'video') NOT NULL,
  idea_id INT NOT NULL,
  FOREIGN KEY (idea_id) REFERENCES idea(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO comment (created_at, content, idea_id, user_id)
VALUES 
(NOW(), 'This is a comment', 1, 1),
(NOW(), 'This is another comment', 1, 2);

INSERT INTO media (created_at, url, type, idea_id)
VALUES 
  (NOW(), 'https://www.pexels.com/fr-fr/photo/aurores-boreales-3025005', 'image', 1),
  (NOW(), 'https://www.pexels.com/fr-fr/video/nature-ciel-soleil-couchant-nuages-6528444', 'video', 1);
