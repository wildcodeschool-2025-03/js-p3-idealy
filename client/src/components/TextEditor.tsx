// client/src/components/TextEditor.tsx

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "flowbite";

// Composant éditeur de texte enrichi
const TextEditor = forwardRef<HTMLDivElement>((_props, ref) => {
  const localEditorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  // Rendre la div éditable accessible au parent via useRef
  useImperativeHandle(
    ref,
    () => {
      if (!localEditorRef.current) {
        throw new Error("Editor ref not available");
      }
      return localEditorRef.current;
    },
    [],
  );

  // (Re)charge Flowbite (au cas où il serait utile pour du style futur)
  useEffect(() => {
    import("flowbite");
  }, []);

  // Appliquer les commandes de mise en forme
  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    localEditorRef.current?.focus(); // Re-focus pour garder le curseur actif
  };

  // Cacher la toolbar après un délai si plus de focus/hover
  const handleMouseLeave = () => {
    setTimeout(() => {
      const isOverEditor = localEditorRef.current?.matches(":hover");
      const isOverToolbar = toolbarRef.current?.matches(":hover");
      if (!isOverEditor && !isOverToolbar) {
        setIsToolbarVisible(false);
      }
    }, 150);
  };

  return (
    <div className="w-full">
      {/* Barre d’outils, visible uniquement si isToolbarVisible est true */}
      {isToolbarVisible && (
        <div
          ref={toolbarRef}
          className="z-10 flex flex-wrap gap-2 mb-2 p-2 bg-gray-100 rounded"
          onMouseLeave={handleMouseLeave}
        >
          {/* Boutons de mise en forme basiques */}
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

          {/* Sélecteur de couleur de texte */}
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

          {/* Sélecteur de taille de texte */}
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
        </div>
      )}

      {/* Zone éditable */}
      <div
        ref={localEditorRef}
        id="content"
        className="min-h-[250px] w-full bg-card p-2 text-gray-900 focus:outline-none"
        contentEditable
        onFocus={() => setIsToolbarVisible(true)}
        onMouseEnter={() => setIsToolbarVisible(true)}
        onMouseLeave={handleMouseLeave}
        suppressContentEditableWarning
      >
        Tapez votre texte ici...
      </div>
    </div>
  );
});

export default TextEditor;
