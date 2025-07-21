import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Slide {
  id: string;
  content: React.ReactNode; // contenu du slide (image, texte, bouton, etc.)
}

interface CarouselProps {
  slides: Slide[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  // Ajoute cet effet pour corriger l'index si slides change
  useEffect(() => {
    if (current > slides.length - 1) {
      setCurrent(slides.length - 1 >= 0 ? slides.length - 1 : 0);
    }
  }, [slides.length, current]);

  if (!slides.length) {
    return null; // ou <div>Aucune idée à afficher</div>
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className=" rounded-2xl  p-5 max-w-full w-full mx-auto flex flex-col items-center relative px-3">
      <div className="w-full ">
        {" "}
        {slides[current] ? slides[current].content : null}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 -translate-y-1/2 text-black font-bold bg-opacity-50  rounded-full p-0.3 z-10"
      >
        <i className="bi bi-chevron-left text-2xl" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 -translate-y-1/2  text-black font-bold rounded-full p-0.3 z-10"
      >
        <i className="bi bi-chevron-right text-2xl" />
      </button>

      <div className="flex justify-center space-x-2 mt-3">
        {slides.map((slide, index) => (
          <span
            key={slide.id}
            className={`block w-3 h-3 rounded-full transition-colors duration-300 ${
              index === current ? "bg-[#ffbd2e]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
