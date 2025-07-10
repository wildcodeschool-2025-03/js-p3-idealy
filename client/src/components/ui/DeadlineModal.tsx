// client/src/components/ui/DeadlineModal.tsx

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      return toast.error("La date de décision doit être dans le futur.");

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
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-card rounded-3xl p-6 shadow-md w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            Sélectionnez la date de prise de décision
          </Dialog.Title>

          <input
            type="date"
            value={decisionDate}
            onChange={(e) => setDecisionDate(e.target.value)}
            className="border rounded-3xl w-full p-2 mb-4 cursor-pointer"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Annuler la sélection"
              className="px-6 py-2 text-xl md:2xl rounded-full bg-redButton hover:bg-red-600 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleValidation}
              arial-label="Valider la date de décision"
              className="px-6 py-2 text-xl md:2xl rounded-full bg-yellowButton hover:bg-yellow-300 cursor-pointer"
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
