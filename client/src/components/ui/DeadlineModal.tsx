// client/src/components/ui/DeadlineModal.tsx

import { Dialog } from "@headlessui/react";
import { useState } from "react";

interface DeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dates: {
    creation: string;
    comment: string;
    vote: string;
    decision: string;
  }) => void;
}

const DeadlineModal = ({ isOpen, onClose, onSubmit }: DeadlineModalProps) => {
  const [decisionDate, setDecisionDate] = useState<string>("");

  const handleValidation = () => {
    if (!decisionDate) return;

    const creation = new Date();
    const decision = new Date(decisionDate);

    const duration = decision.getTime() - creation.getTime();
    if (duration <= 0)
      return alert("La date de décision doit être dans le futur.");

    const third = duration / 3;

    const comment = new Date(creation.getTime() + third);
    const vote = new Date(creation.getTime() + third * 2);

    onSubmit({
      creation: creation.toISOString(),
      comment: comment.toISOString(),
      vote: vote.toISOString(),
      decision: decision.toISOString(),
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-l p-6 shadow-xl w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            Sélectionnez la date de prise de décision
          </Dialog.Title>

          <input
            type="date"
            value={decisionDate}
            onChange={(e) => setDecisionDate(e.target.value)}
            className="border rounded-xl w-full p-2 mb-4 cursor-pointer"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-3xl bg-gray-300 hover:bg-gray-400 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleValidation}
              className="px-4 py-2 rounded-3xl bg-yellowButton text-black hover:bg-yellow-300 cursor-pointer"
            >
              Valider
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeadlineModal;
