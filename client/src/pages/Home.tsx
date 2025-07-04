// client/src/pages/Home.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ParcourirPlaceHolder from "../components/ParcourirPlaceHolder";
import { useLogin } from "../context/AuthContext";

type Service = {
  id: number;
  statut: string;
};

function Home() {
  const navigate = useNavigate();
  const [existingServices, setExistingServices] = useState<Service[]>([]);
  const [loginPanel, setLoginPanel] = useState(true);

  // Partie login
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  // Partie création de compte
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [picture, setPicture] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  );
  const [service_id, setService_id] = useState(1);

  const handleLogin = async () => {
    try {
      await login(mail, password);
      navigate("/principal");
    } catch (error) {
      // Gérer l'erreur (afficher un message à l'utilisateur par exemple)
    }
  };

  const handleCreateAccount = async () => {
    if (!firstname || !lastname || !mail || !password || !service_id) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    try {
      const userData = {
        firstname,
        lastname,
        mail,
        password,
        picture,
        isAdmin: false,
        service_id,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création du compte.");
      }

      await handleLogin();
    } catch (error) {
      console.error("Erreur de création :", error);
      alert("Une erreur est survenue lors de l'inscription.");
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/services`)
      .then((response) => response.json())
      .then((data) => {
        setExistingServices(data);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  return (
    <section className="relative">
      {/*Fond de la page-------A REMPLACER PAR DE FAUSSES DONNEES !!*/}
      <ParcourirPlaceHolder />

      {/* Blur sur tout l'écran */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10" />

      {/* Container de la modale (c.a.d. l'écran) */}
      <div className="fixed inset-0 flex items-center justify-center z-20">
        {/* La modale elle même*/}
        <div className="bg-white rounded-3xl shadow-md w-3/4 lg:w-[80rem] max-w-9/10 p-5">
          <h1 className="text-center font-bold font-kalam text-5xl md:mb-15 md:mt-4 mb-8 mt-6">
            idealy
          </h1>

          <section className="flex flex-col-reverse md:flex-row justify-evenly align-bottom">
            <section className="flex flex-col gap-4 text-left max-md:hidden">
              <p className="text-2xl font-bold">
                idealy, qu'est ce que c'est ?
              </p>
              <p>
                {" "}
                <span className="text-yellowButton text-xl"> ● </span> Rédigez
                et soumettez vos idées en ligne
              </p>
              <p>
                {" "}
                <span className="text-yellowButton text-xl"> ● </span>{" "}
                Consultez, commentez, votez pour celles des autres contributeurs
              </p>
              <p>
                {" "}
                <span className="text-yellowButton text-xl"> ● </span> Suivez en
                temps réel la prise de décision de celles-ci
              </p>
            </section>

            {loginPanel ? (
              <section className="flex flex-col items-center gap-2">
                <input
                  value={mail}
                  placeholder="Mail"
                  type="mail"
                  onChange={(e) => setMail(e.target.value)}
                  className="rounded-3xl text-center bg-greyBackground w-60 focus:outline-none py-1"
                />
                <input
                  value={password}
                  placeholder="Mot de passe"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-3xl text-center bg-greyBackground w-60 focus:outline-none py-1"
                />
                <button
                  type="button"
                  onClick={handleLogin}
                  className="bg-greenButton text-black rounded-3xl w-50 py-2 mt-10 cursor-pointer"
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => setLoginPanel(!loginPanel)}
                  className="bg-redButton text-black rounded-3xl w-50 py-2 mb-10 cursor-pointer"
                >
                  Je n'ai pas de compte
                </button>
              </section>
            ) : (
              <section className="flex flex-col justify-center items-center gap-2">
                <input
                  value={firstname}
                  placeholder="Votre prénom"
                  onChange={(e) => setFirstname(e.target.value)}
                  className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                />
                <input
                  value={lastname}
                  placeholder="Votre nom de famille"
                  onChange={(e) => setLastname(e.target.value)}
                  className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                />
                <input
                  value={mail}
                  placeholder="Votre adresse mail"
                  type="email"
                  onChange={(e) => setMail(e.target.value)}
                  className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                />
                <input
                  value={password}
                  type="password"
                  placeholder="Votre mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                />
                <input
                  value={picture}
                  placeholder="Lien de l'image de profil"
                  onChange={(e) => setPicture(e.target.value)}
                  className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                />
                <select
                  id="service"
                  name="service"
                  value={service_id}
                  onChange={(e) => setService_id(Number(e.target.value))}
                  className="bg-greyBackground rounded-3xl focus:outline-none w-60 text-center py-1"
                >
                  <option value="">Choisir un service</option>
                  {existingServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.statut}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="bg-greenButton text-black rounded-3xl w-50 py-2 mt-10 cursor-pointer"
                >
                  Créer mon compte
                </button>
                <button
                  type="button"
                  onClick={() => setLoginPanel(!loginPanel)}
                  className="bg-redButton text-black rounded-3xl w-50 py-2 mb-10 cursor-pointer"
                >
                  Retour menu connexion
                </button>
              </section>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

export default Home;
