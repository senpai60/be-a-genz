import { useState, useEffect } from "react";
import RandomWordCard from "./RandomWordCard";
import wordsApi from "../../utils/wordsApi";

function RandomWordsPage() {
  const [randomWordsData, setRandomWordsData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await wordsApi.get("/random-words");
        setRandomWordsData(response.data.randomWordsData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  const updateRandomWords = async () => {
    try {
      const response = await wordsApi.get("/random-words");
      setRandomWordsData(response.data.randomWordsData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="w-full h-full p-4">
      {/* Header */}
      <div className="header text-center lg:text-left">
        <h1 className="text-zinc-300 text-3xl md:text-4xl lg:text-5xl leading-snug">
          You can explore{" "}
          <span className="font-bold text-5xl md:text-6xl lg:text-7xl text-pink-400">
            plenty
          </span>{" "}
          of random generated{" "}
          <span className="font-bold text-5xl md:text-6xl lg:text-7xl text-pink-400">
            genz
          </span>{" "}
          words!{" "}
          <span className="font-bold text-4xl md:text-5xl lg:text-6xl text-pink-400">
            ⓿_⓿
          </span>
        </h1>

        <button
          onClick={updateRandomWords}
          className="mt-6 bg-orange-400 text-xl md:text-2xl lg:text-3xl px-4 py-2 md:px-6 md:py-3 text-teal-950 rounded-2xl font-semibold hover:bg-orange-500 transition"
        >
          GENERATE RANDOMS
        </button>
      </div>

      {/* Words Grid */}
      <div
        className="
          random-words 
          scrollbar-hide 
          overflow-scroll 
          h-[60vh] w-full 
          mt-8 
          grid 
          grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
          gap-5
          px-2
        "
      >
        {randomWordsData.map((randomWordData) => (
          <RandomWordCard
            key={randomWordData.wordData._id}
            mood={randomWordData.wordMood}
            randomWordData={randomWordData.wordData}
          />
        ))}
      </div>
    </section>
  );
}

export default RandomWordsPage;
