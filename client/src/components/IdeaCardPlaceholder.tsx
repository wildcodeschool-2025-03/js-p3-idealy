// client/src/components/IdeaCard.tsx
import { useEffect, useState } from "react";

// Couleurs des catégories pour les blocs
const categoryColors: Record<string, string> = {
  Amélioration: "bg-redButton",
  Innovation: "bg-yellowButton",
  "Conditions de travail": "bg-greenButton",
  "Relation client": "bg-[#007aff]",
  "Optimisation des coûts": "bg-[#af52de]",
  "Développement durable": "bg-[#5ac8fa]",
  "Vie d'équipe": "bg-[#ff9500]",
};

const allCategories = Object.keys(categoryColors);

function getRandomCategories() {
  const count = Math.floor(Math.random() * 3) + 1; // 1 à 3 catégories
  const shuffled = allCategories.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((category) => ({ category }));
}

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.";

function getRandomTruncatedText(text: string, min: number, max: number) {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  return text.slice(0, length) + (text.length > length ? "…" : "");
}

function IdeaCardPlaceholder({ showVotes = true }) {
  const [isVoteAllowed, setIsVoteAllowed] = useState<boolean>(true);
  const [categories, setCategories] = useState<{ category: string }[]>([]);
  const [truncatedText, setTruncatedText] = useState("");
  const [truncatedtitle, setTruncatedtitle] = useState("");

  useEffect(() => {
    setIsVoteAllowed(Math.random() < 0.5); // 50% de chance que le vote soit autorisé
    setCategories(getRandomCategories()); // Génère 1 à 3 catégories aléatoires
    setTruncatedText(getRandomTruncatedText(lorem, 70, 270));
    setTruncatedtitle(getRandomTruncatedText(lorem, 10, 30));
  }, []);

  return (
    <article className="bg-card rounded-3xl w-[370px] py-5 px-5 relative shadow-md flex flex-col justify-between min-h-[23rem] md:h-[23rem] max-w-full">
      {/* Haut de la carte */}
      <div>
        {/* Avatar et titre */}
        <section className="flex items-center mb-4">
          <img
            className="rounded-full w-10 mr-5"
            src="/placeholder-avatar.jpg"
            alt="profil du créateur"
          />
          <p className="font-bold">{truncatedtitle}</p>
        </section>

        {/* Blocs de catégorie */}
        <section className="flex items-center gap-2">
          {categories.map((cat) => (
            <span
              key={cat.category}
              title={cat.category}
              className={`block h-2 w-1/5 rounded-md ${categoryColors[cat.category] || "bg-gray-300"}`}
            />
          ))}
        </section>

        {/* Contenu de l'idée */}
        <div className="relative max-h-[10rem] overflow-hidden mt-6 text-justify">
          <div className="prose prose-sm max-w-none">{truncatedText}</div>
        </div>
      </div>

      {/* Bas de la carte : auteur + votes */}
      <div>
        <p className="text-right font-bold mb-4">Place Holder</p>
        {showVotes && (
          <section className="flex items-center justify-center gap-6">
            {isVoteAllowed ? (
              <>
                <button
                  type="button"
                  className="bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
                >
                  <span className="inline-block text-center w-6">154</span>
                  <i className="bi bi-hand-thumbs-up" />
                </button>
                <button
                  type="button"
                  className="bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
                >
                  <span className="inline-block text-center w-6">18</span>
                  <i className="bi bi-hand-thumbs-down" />
                </button>
              </>
            ) : (
              <div
                className="bg-blackBackground w-4/5 h-8 rounded-full flex items-center justify-center text-white opacity-60"
                title="Le délai de vote est dépassé"
              >
                Délai de vote dépassé
              </div>
            )}
          </section>
        )}
      </div>
    </article>
  );
}

export default IdeaCardPlaceholder;
