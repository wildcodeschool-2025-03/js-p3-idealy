// client/src/pages/Home.tsx

import { useState } from "react";
import { useLogin } from "../context/AuthContext";

function Home() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const handleLogin = async () => {
    try {
      await login(mail, password);
      // Redirection ou affichage d'un message de succès ici si besoin
    } catch (error) {
      // Gérer l'erreur (afficher un message à l'utilisateur par exemple)
    }
  };

  return (
    <section className="min-h-lvh">
      {/*Intégrer ici la page "principal" et mettre le reste du return en modale par dessus*/}

      {/*Tout ce qu'il y a dessous est à mettre en modal*/}

      <h1>idealy</h1>

      <section>
        <p>Balbla présentation du site</p>
        <p>Balbla présentation du site</p>
        <p>Balbla présentation du site</p>
        <p>Balbla présentation du site</p>
        <p>Balbla présentation du site</p>
      </section>

      <section>
        <p>Login</p>
        <input
          value={mail}
          placeholder="mail"
          onChange={(e) => setMail(e.target.value)}
          className="border-2"
        />
        <input
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border-2"
        />
        <button type="button" onClick={handleLogin}>
          Envoi
        </button>
      </section>
    </section>
  );
}

export default Home;
