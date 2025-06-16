// client/src/pages/Parcourir

import IdeaCard from "../components/IdeaCard";

const ideatable = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "En cours",
  },
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "Validé",
  },
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "Refusé",
  },
];

function Parcourir() {
  return (
    <section className="bg-greyBackground pt-20 pb-20 md:w-[90rem] m-auto gap-10 flex flex-col items-center">
      {ideatable.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </section>
  );
}

export default Parcourir;
