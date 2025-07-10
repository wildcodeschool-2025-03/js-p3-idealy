import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { calculateDeadlineSteps } from "../utils/deadlineUtils";
import DeadlineTimeline from "./DeadlineTimeline";

interface WorkflowSidebarProps {
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

const WorkflowSidebar = ({ idea }: WorkflowSidebarProps) => {
  const [participants, setParticipants] = useState<User[] | null>(null);

  useEffect(() => {
    authFetch(
      `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/participants`,
    )
      .then((response) => response.json())
      .then((data) => setParticipants(data))
      .catch((error) => console.error("Error fetching participants:", error));
  }, [idea.id]);

  const deadlineSteps = calculateDeadlineSteps(
    new Date(idea.timestamp),
    new Date(idea.deadline),
  );

  if (!deadlineSteps) return null;

  return (
    <div className="bg-card rounded-3xl p-6 w-full h-fit mt-3 shadow-md">
      <h2 className="text-xl font-bold mb-8">Workflow</h2>

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
            <img
              className="w-8 h-8 rounded-full"
              src={
                participant.picture?.startsWith("http")
                  ? participant.picture
                  : `${import.meta.env.VITE_API_URL}${participant.picture}`
              }
              alt={`${participant.firstname} ${participant.lastname}`}
            />
            <span className="text-md">
              {participant.firstname} {participant.lastname}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowSidebar;
