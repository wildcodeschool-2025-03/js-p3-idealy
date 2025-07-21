import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { calculateDeadlineSteps } from "../utils/deadlineUtils";
import DeadlineTimeline from "./DeadlineTimeline";

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: {
    id: number;
    timestamp: string;
    deadline: string;
  };
  voteData: {
    agree_count: number;
    disagree_count: number;
  };
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  picture: string;
}

const WorkflowModal = ({
  isOpen,
  onClose,
  idea,
  voteData,
}: WorkflowModalProps) => {
  const [participants, setParticipants] = useState<User[] | null>(null);

  useEffect(() => {
    if (isOpen) {
      authFetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/participants`,
      )
        .then((response) => response.json())
        .then((data) => setParticipants(data))
        .catch((error) => console.error("Error fetching participants:", error));
    }
  }, [isOpen, idea.id]);

  if (!isOpen) return null;

  // Calcul des étapes de deadline
  const deadlineSteps = calculateDeadlineSteps(
    new Date(idea.timestamp),
    new Date(idea.deadline),
  );

  if (!deadlineSteps) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-96 shadow-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Workflow</h2>
          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Timeline */}
        <div className="flex">
          <DeadlineTimeline
            creation={deadlineSteps.creation}
            comments={deadlineSteps.comment}
            vote={deadlineSteps.vote}
            decision={deadlineSteps.decision}
          />
        </div>

        <div className="mt-12">
          <h3 className="font-bold mb-6">Personnes concernées</h3>

          {participants?.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 mb-2 space-y-4"
            >
              {/* Photo */}
              <img
                className="w-8 h-8 rounded-full"
                src={
                  participant.picture?.startsWith("http")
                    ? participant.picture
                    : `${import.meta.env.VITE_API_URL}${participant.picture}`
                }
                alt={`${participant.firstname} ${participant.lastname}`}
              />

              {/* Nom + Prénom */}
              <span className="text-md">
                {participant.firstname} {participant.lastname}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <div className="bg-greenButton text-white px-4 py-2 rounded-2xl">
            👍 {voteData?.agree_count || 0}
          </div>
          <div className="bg-redButton text-white px-4 py-2 rounded-2xl">
            👎 {voteData?.disagree_count || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowModal;
