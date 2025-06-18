import { useState } from "react";

interface Slide {
  id: string;
  content: React.ReactNode; // contenu du slide (image, texte, bouton, etc.)
}

interface CarouselProps {
  slides: Slide[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 max-w-[320px] w-full mx-auto flex flex-col items-center relative">
      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
        {slides[current].content}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 z-10"
      >
        &#8592;
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 z-10"
      >
        &#8594;
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
