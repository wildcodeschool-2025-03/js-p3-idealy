// client/src/pages/Home.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ParcourirPlaceHolder from "../components/ParcourirPlaceHolder";
import { useLogin } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

type Service = {
  id: number;
  statut: string;
};

function Home() {
  const navigate = useNavigate();
  const [existingServices, setExistingServices] = useState<Service[]>([]);
  const [loginPanel, setLoginPanel] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Partie login
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, isLoading: authLoading } = useLogin();

  // Partie création de compte
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picture, setPicture] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  );
  const [service_id, setService_id] = useState(1);

  // Redirection si déjà authentifié
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/principal");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(mail, password);
      navigate("/principal");

      toast.success("Connexion réussie ! Bienvenue sur idealy.");
    } catch (error) {
      toast.error("Erreur de connexion, veuillez vérifier vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (
      !firstname ||
      !lastname ||
      !mail ||
      !password ||
      !confirmPassword ||
      !service_id
    ) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
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
        if (response.status === 409) {
          // Erreur spécifique pour email déjà utilisé
          const errorData = await response.json();
          toast.error(
            errorData.error || "Cette adresse email est déjà utilisée",
          );
          return;
        }
        if (response.status === 400) {
          // Erreurs de validation du middleware
          const errorData = await response.json();
          if (errorData.validationErrors) {
            // Afficher chaque erreur de validation
            for (const error of errorData.validationErrors as {
              field: string;
              message: string;
            }[]) {
              toast.error(error.message);
            }
            return;
          }
        }
        throw new Error("Erreur lors de la création du compte.");
      }

      await handleLogin();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription.");
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
      {/*Fond de la page*/}
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
                <form
                  className="flex flex-col items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <input
                    id="login-email"
                    name="login-email"
                    value={mail}
                    placeholder="Mail"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setMail(e.target.value)}
                    className="rounded-3xl text-center bg-greyBackground w-60 focus:outline-none py-1 mb-2"
                  />
                  <div className="relative">
                    <input
                      id="login-password"
                      name="login-password"
                      value={password}
                      placeholder="Mot de passe"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-3xl text-center bg-greyBackground w-60 focus:outline-none py-1 mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/6"
                    >
                      {showPassword ? (
                        <i className="bi bi-eye-slash" />
                      ) : (
                        <i className="bi bi-eye" />
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-greenButton text-black rounded-3xl w-50 py-2 mt-10 cursor-pointer"
                  >
                    Se connecter
                  </button>
                </form>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setLoginPanel(!loginPanel)}
                  className="bg-redButton text-black rounded-3xl w-50 py-2 mb-10 cursor-pointer"
                >
                  Je n'ai pas de compte
                </button>
              </section>
            ) : (
              <section className="flex flex-col justify-center items-center gap-2">
                <form
                  className="flex flex-col items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateAccount();
                  }}
                >
                  <input
                    id="register-firstname"
                    name="register-firstname"
                    value={firstname}
                    placeholder="Votre prénom"
                    autoComplete="given-name"
                    onChange={(e) => setFirstname(e.target.value)}
                    className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                    required
                  />
                  <input
                    id="register-lastname"
                    name="register-lastname"
                    value={lastname}
                    placeholder="Votre nom de famille"
                    autoComplete="family-name"
                    onChange={(e) => setLastname(e.target.value)}
                    className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                    required
                  />
                  <input
                    id="register-email"
                    name="register-email"
                    value={mail}
                    placeholder="Votre adresse mail"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setMail(e.target.value)}
                    className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                    required
                  />
                  <div className="relative">
                    <input
                      id="register-password"
                      name="register-password"
                      value={password}
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <i className="bi bi-eye-slash" />
                      ) : (
                        <i className="bi bi-eye" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="register-confirm-password"
                      name="register-confirm-password"
                      value={confirmPassword}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmer mot de passe"
                      autoComplete="new-password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <i className="bi bi-eye-slash" />
                      ) : (
                        <i className="bi bi-eye" />
                      )}
                    </button>
                  </div>
                  <input
                    id="register-picture"
                    name="register-picture"
                    value={picture}
                    placeholder="Lien de l'image de profil"
                    autoComplete="photo"
                    onChange={(e) => setPicture(e.target.value)}
                    className="rounded-3xl text-center bg-greyBackground focus:outline-none w-60 py-1"
                  />
                  <select
                    id="service"
                    name="service"
                    value={service_id}
                    onChange={(e) => setService_id(Number(e.target.value))}
                    className="bg-greyBackground rounded-3xl focus:outline-none w-60 text-center py-1"
                    required
                  >
                    <option value="">Choisir un service</option>
                    {existingServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.statut}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-greenButton text-black rounded-3xl w-50 py-2 mt-10 cursor-pointer"
                  >
                    Créer mon compte
                  </button>
                </form>
                <button
                  type="button"
                  disabled={isLoading}
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
