function RandomWordCard({ randomWordData, mood }) {
  const moodColors = {
    "Very Positive": "#FFB845",
    Positive: "#FF6F61",
    Neutral: "#A2A2A2",
    Negative: "#6A4C93",
    "Very Negative": "#D64550",
  };

  return (
    <div
      className="
        random-words-card
        rounded-3xl
        p-4 sm:p-5 md:p-6
        relative
        w-full
        h-52 sm:h-56 md:h-60 lg:h-64
        flex flex-col justify-between
        transition-all duration-200
        hover:scale-[1.02]
        overflow-hidden
      "
      style={{ backgroundColor: moodColors[mood] }}
    >
      <div>
        <h1 className="text-zinc-700 text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
          {randomWordData.word}
        </h1>
        <p className="text-zinc-800 text-base sm:text-lg md:text-xl">
          <span className="font-semibold">Meaning:</span> {randomWordData.meaning}
        </p>
        <p className="text-teal-950 text-base sm:text-lg md:text-xl mt-1">
          <span className="font-semibold">Usecase:</span> {randomWordData.sentence}
        </p>
      </div>

      <div className="absolute right-4 bottom-2 sm:bottom-4 opacity-30 select-none">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-teal-950 font-bold">
          *
        </h1>
      </div>
    </div>
  );
}

export default RandomWordCard;
