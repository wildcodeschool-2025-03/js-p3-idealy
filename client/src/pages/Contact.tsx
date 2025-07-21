import type React from "react";
import { useState } from "react";

interface EmailData {
  service_id: string;
  template_id: string;
  user_id: string;
  template_params: {
    user_name: string;
    user_last_name: string;
    user_email: string;
    message: string;
  };
}

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function Contact() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setError(
        "Le service de contact n'est pas disponible actuellement. Merci de nous écrire à contact@idealy.com.",
      );
      setShowModal(true);
      return;
    }

    const emailData: EmailData = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        user_name: name,
        user_last_name: lastName,
        user_email: email,
        message: message,
      },
    };

    try {
      const response = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(emailData),
        },
      );

      if (response.ok) {
        setStatus("success");
        setShowModal(true);
        setName("");
        setLastName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setError("Une erreur est survenue lors de l'envoi du message.");
        setShowModal(true);
      }
    } catch (err) {
      setStatus("error");
      setError("Impossible de contacter le service.");
      setShowModal(true);
    }
  };

  return (
    <section className="bg-greyBackground min-h-lvh py-6 md:pt-10">
      <section className="bg-card rounded-3xl shadow-md md:w-1/2 mx-auto px-4 md:px-30 py-6">
        <h1 className="text-2xl font-[atkinson] mt-6 mb-6  bg-[#ffbd2e] rounded-3xl px-4 py-2 text-center w-fit mx-auto">
          Contactez-nous
        </h1>

        <form
          onSubmit={handleSubmit}
          aria-describedby={error ? "form-error" : undefined}
          className="space-y-4"
        >
          <div>
            <label htmlFor="user_name" className="block font-semibold">
              Nom <span aria-hidden="true">*</span>
            </label>
            <input
              id="user_name"
              name="user_name"
              type="text"
              placeholder="Votre nom"
              required
              minLength={2}
              autoComplete="name"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="user_last_name" className="block font-semibold">
              Prénom <span aria-hidden="true">*</span>
            </label>
            <input
              id="user_last_name"
              name="user_last_name"
              type="text"
              placeholder="Votre prénom"
              required
              minLength={2}
              autoComplete="name"
              className="w-full border rounded px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="user_email" className="block font-semibold">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="user_email"
              name="user_email"
              type="email"
              placeholder="Votre adresse email"
              required
              autoComplete="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-semibold">
              Message <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Votre message"
              required
              minLength={10}
              rows={5}
              className="w-full border rounded px-3 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#28c940] px-6 py-2 rounded-3xl cursor-pointer focus:outline-none focus:ring-2"
              disabled={status === "sending"}
              aria-busy={status === "sending"}
            >
              {status === "sending" ? "Envoi en cours..." : "Envoyer"}
            </button>
          </div>
        </form>

        <aside
          className="flex-1 bg-white p-4 rounded shadow text-center mt-8"
          aria-label="Coordonnées"
        >
          <h2 className="text-xl font-bold font-kalam mb-4">Idealy</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Siège social :</span>
              <br />
              123 rue de Paris
              <br />
              75015 Paris, France
            </li>
            <li>
              <span className="font-semibold">Email :</span>
              <br />
              <a href="mailto:contact@idealy.com">contact@idealy.com</a>
            </li>
            <li>
              <span className="font-semibold">Téléphone :</span>
              <br />
              <a href="tel:+33123456789">01 23 45 67 89</a>
            </li>
          </ul>
        </aside>

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50
                  backdrop-filter "
          >
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
              {status === "success" && (
                <p className=" font-semibold text-lg mb-4">Message envoyé !</p>
              )}
              {status === "error" && (
                <p className="text-red-700 font-semibold text-lg mb-4">
                  {error}
                </p>
              )}
              <button
                type="button"
                aria-label="Fermer la modal"
                onClick={() => setShowModal(false)}
                className="mt-4 bg-[#ffbd2e] px-4 py-2 rounded-3xl cursor-pointer hover:bg-yellow-400 focus:outline-none focus:ring-2"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

export default Contact;
