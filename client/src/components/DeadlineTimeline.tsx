// client/src/components/DeadlineTimeline.tsx

interface Deadlines {
  creation: string;
  comments: string;
  vote: string;
  decision: string;
}

const DeadlineTimeline = ({
  creation,
  comments,
  vote,
  decision,
}: Deadlines) => {
  const steps = [
    {
      date: decision,
      label: "Prise de décision",
      color: "border border-gray-500 bg-white",
    },
    { date: vote, label: "Deadline vote", color: "bg-greenButton" },
    {
      date: comments,
      label: "Deadline commentaires",
      color: "bg-yellowButton",
    },
    { date: creation, label: "Création de l'idée", color: "bg-redButton" },
  ];

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center relative">
        <div className="absolute top-0 bottom-0 w-1 bg-gray-300 z-0" />
        {steps.map((step) => (
          <div key={step.date} className="z-10 flex flex-col items-center mb-4">
            <div className="text-sm text-gray-700 mb-1">
              {new Date(step.date).toLocaleDateString("fr-FR")}
            </div>
            <div
              className={`w-5 h-5 rounded-full ${step.color} flex items-center justify-center`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between h-full py-1">
        {steps.map((step) => (
          <div key={step.label} className="text-sm text-gray-800 mb-6 pt-4.5">
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlineTimeline;
