// client/src/pages/Home.tsx

import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../context/AuthContext";
import Parcourir from "./Parcourir";

function Home() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(mail, password);
      navigate("/parcourir");
    } catch (error) {
      // Gérer l'erreur (afficher un message à l'utilisateur par exemple)
    }
  };

  return (
    <section className="min-h-lvh relative">
      {/*Fond de la page-------A REMPLACER PAR DE FAUSSES DONNEES !!*/}
      <Parcourir />

      {/* Blur sur tout l'écran */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10" />

      {/* Container de la modale (c.a.d. l'écran) */}
      <div className="fixed inset-0 flex items-center justify-center z-20">
        {/* La modale elle même*/}
        <div className="bg-white rounded-3xl shadow-md w-3/4 h-2/3 lg:w-[80rem] lg:h-[30rem] max-w-9/10 p-5">
          <h1 className="text-center font-bold font-kalam text-5xl md:mb-10 md:mt-4">
            idealy
          </h1>

          <section className="flex flex-col-reverse md:flex-row justify-evenly items-center">
            <p className=" mt-20 md:mt-0">Et coucou !</p>

            <section className="flex flex-col justify-center items-center gap-5">
              <p className="mt-5 md:mt-0">Login</p>
              <input
                value={mail}
                placeholder="mail"
                onChange={(e) => setMail(e.target.value)}
                className="rounded-3xl text-center bg-greyBackground"
              />
              <input
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-3xl text-center bg-greyBackground"
              />
              <button
                type="button"
                onClick={handleLogin}
                className="bg-greenButton text-black rounded-3xl px-9"
              >
                Se connecter
              </button>
            </section>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Home;
