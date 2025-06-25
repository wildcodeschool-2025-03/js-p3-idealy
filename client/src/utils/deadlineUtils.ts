export type DeadlineSteps = {
  creation: string;
  comment: string;
  vote: string;
  decision: string;
};

export const calculateDeadlineSteps = (
  creationDate: Date,
  decisionDate: Date,
): DeadlineSteps | null => {
  const duration = decisionDate.getTime() - creationDate.getTime();
  if (duration <= 0) return null;

  const third = duration / 3;
  const comment = new Date(creationDate.getTime() + third);
  const vote = new Date(creationDate.getTime() + 2 * third);

  return {
    creation: creationDate.toISOString(),
    comment: comment.toISOString(),
    vote: vote.toISOString(),
    decision: decisionDate.toISOString(),
  };
};
