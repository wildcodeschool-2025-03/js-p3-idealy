// client/src/components/TextEditor.tsx

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type TextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  minLength?: number;
};

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>(
  ({ value, onChange, onFocus, minLength }, ref) => {
    const localEditorRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(false);

    // Expose l'élément éditable au parent via ref
    useImperativeHandle(
      ref,
      () => localEditorRef.current as HTMLDivElement,
      [],
    );

    // Met à jour le contenu de l'éditeur si la prop value change
    useEffect(() => {
      if (
        localEditorRef.current &&
        localEditorRef.current.innerHTML !== value
      ) {
        localEditorRef.current.innerHTML = value;
      }
    }, [value]);

    // Applique une commande de mise en forme (gras, italique, etc.)
    const handleCommand = (command: string, value?: string) => {
      document.execCommand(command, false, value);
      localEditorRef.current?.focus();
      // Notifie le parent du changement
      if (localEditorRef.current) {
        onChange(localEditorRef.current.innerHTML);
      }
    };

    // Gestion du changement de contenu
    const handleInput = () => {
      if (localEditorRef.current) {
        onChange(localEditorRef.current.innerHTML);
      }
    };

    // Cache la toolbar après un petit délai si l'utilisateur sort complètement
    const handleBlur = () => {
      setTimeout(() => {
        const isOverToolbar = toolbarRef.current?.matches(":hover");
        if (!isOverToolbar) {
          setIsToolbarVisible(false);
        }
      }, 150);
    };

    return (
      <div className="w-full">
        {/* Barre d’outils */}
        {isToolbarVisible && (
          <div
            ref={toolbarRef}
            className="z-10 flex flex-wrap gap-2 mb-2 p-2 bg-gray-100 rounded"
          >
            <button
              type="button"
              onClick={() => handleCommand("bold")}
              className="font-bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => handleCommand("italic")}
              className="italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => handleCommand("underline")}
              className="underline"
            >
              U
            </button>

            <select
              onChange={(e) => handleCommand("foreColor", e.target.value)}
              defaultValue=""
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="" disabled>
                Couleur
              </option>
              <option value="#000000">Noir</option>
              <option value="#e53935">Rouge</option>
              <option value="#1e3a8a">Bleu foncé</option>
              <option value="#2e7d32">Vert foncé</option>
              <option value="#6a1b9a">Violet</option>
            </select>

            <select
              onChange={(e) => handleCommand("fontSize", e.target.value)}
              defaultValue=""
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="" disabled>
                Taille
              </option>
              <option value="1">XXS</option>
              <option value="2">XS</option>
              <option value="3">S</option>
              <option value="4">M</option>
              <option value="5">L</option>
              <option value="6">XL</option>
              <option value="7">XXL</option>
            </select>
            {/* Message indicatif sur la longueur minimale */}
            {isToolbarVisible &&
              value.replace(/<[^>]+>/g, "").trim().length <
                (minLength || 0) && (
                <p className="w-full text-xs text-gray-600 mt-2">
                  Minimum {minLength} caractères requis.
                </p>
              )}
          </div>
        )}

        {/* Zone éditable */}
        <div
          ref={localEditorRef}
          id="content"
          className="min-h-[250px] w-full bg-card p-2 text-gray-900 focus:outline-none"
          contentEditable
          onFocus={() => {
            setIsToolbarVisible(true);
            if (onFocus) onFocus();
          }}
          onBlur={handleBlur}
          onInput={handleInput}
          suppressContentEditableWarning
          style={{ position: "relative", zIndex: 2, background: "transparent" }}
        />
      </div>
    );
  },
);

export default TextEditor;
