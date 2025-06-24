// client/src/pages/Home.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../context/AuthContext";
import Parcourir from "./Parcourir";

type Service = {
  id: number;
  statut: string;
};

function Home() {
  const navigate = useNavigate();
  const [existingServices, setExistingServices] = useState<Service[]>([]);

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
      navigate("/parcourir");
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

            {/* <section className="flex flex-col justify-center items-center gap-5">
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
            </section> */}

            <section className="flex flex-col justify-center items-center gap-5">
              <p className="mt-5 md:mt-0">Créer un compte</p>
              <input
                value={firstname}
                placeholder="Firstname"
                onChange={(e) => setFirstname(e.target.value)}
                className="rounded-3xl text-center bg-greyBackground"
              />
              <input
                value={lastname}
                placeholder="Lastname"
                onChange={(e) => setLastname(e.target.value)}
                className="rounded-3xl text-center bg-greyBackground"
              />
              <input
                value={mail}
                placeholder="mail"
                type="email"
                onChange={(e) => setMail(e.target.value)}
                className="rounded-3xl text-center bg-greyBackground"
              />
              <input
                value={password}
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-3xl text-center bg-greyBackground"
              />
              <input
                value={picture}
                placeholder="Profil picture URL"
                onChange={(e) => setPicture(e.target.value)}
                className="rounded-3xl text-center bg-greyBackground"
              />
              <select
                id="service"
                name="service"
                value={service_id}
                onChange={(e) => setService_id(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-yellowButton text-black rounded-3xl px-9"
              >
                Créer mon compte
              </button>
            </section>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Home;
