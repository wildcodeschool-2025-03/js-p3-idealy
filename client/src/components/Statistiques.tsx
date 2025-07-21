// client/src/components/Statistiques.tsx
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { authFetch } from "../utils/authFetch"; // ✅ Utilise authFetch

type Stats = {
  submittedThisMonth: number;
  likesAdded: number;
  ideasValidated: number;
};

function Statistiques() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/statistics`) // ✅ Utilise authFetch pour sécuriser la requête
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then((data: Stats) => {
        setStats({
          submittedThisMonth: data.submittedThisMonth,
          likesAdded: data.likesAdded,
          ideasValidated: data.ideasValidated,
        });
      })
      .catch((err) => {
        console.error("Erreur récupération statistiques :", err);
        setError(true);
        setStats({
          submittedThisMonth: 5,
          likesAdded: 1578,
          ideasValidated: 14,
        });
      });
  }, []);

  if (!stats) {
    return (
      <p className="text-center text-gray-500">
        Chargement des statistiques...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-center">
      <div className="p-6">
        <p className="text-6xl md:text-8xl font-bold">
          <CountUp end={stats.submittedThisMonth} duration={1.5} />
        </p>
        <p className="font-bold">
          {stats.submittedThisMonth === 0 && "Aucune idée soumise ce mois-ci"}
          {stats.submittedThisMonth === 1 && "idée soumise ce mois-ci"}
          {stats.submittedThisMonth > 1 && "idées soumises ce mois-ci"}
        </p>
      </div>
      <div className="p-6">
        <p className="text-6xl md:text-8xl font-bold">
          <CountUp end={stats.likesAdded} duration={1.5} />
        </p>
        <p className="font-bold">Likes ajoutés cette année</p>
      </div>
      <div className="p-6">
        <p className="text-6xl md:text-8xl font-bold">
          <CountUp end={stats.ideasValidated} duration={1.5} />
        </p>
        <p className="font-bold">Idées validées cette année</p>
      </div>
      {error && (
        <p className="col-span-full text-sm text-red-600 mt-2">
          Les données affichées sont simulées en raison d'une erreur de
          récupération.
        </p>
      )}
    </div>
  );
}

export default Statistiques;
