import React from "react";
import ButtonSaveWord from "./ButtonSaveWord";
import promptApi from "../../utils/promptApi";
import { useAuth } from "../../context/AuthContext";

function ResponseOutput({ genzResponse }) {
  const { isLoggedIn } = useAuth();

  const addToArchive = async (word, meaning, sentence) => {
    if (!isLoggedIn) {
      alert("Please Log In to Add in archive");
      return;
    }
    try {
      const response = await promptApi.post("/add-to-archive", {
        word,
        meaning,
        sentence,
      });
      alert(response.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="
        w-full 
        md:w-[70%] 
        lg:w-[60%] 
        mx-auto 
        mt-6 
        p-3 sm:p-4 md:p-6 
        border border-zinc-700 
        rounded 
        max-h-[60vh] 
        overflow-y-auto 
        scrollbar-thin 
        scrollbar-thumb-zinc-700 
        scrollbar-track-zinc-900
      "
    >
      {genzResponse ? (
        <>
          <h2 className="text-xl sm:text-2xl md:text-3xl text-green-400 mb-2">
            GenZ Translation
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-4 leading-relaxed">
            {genzResponse.sentence}
          </p>

          <h3 className="text-xl sm:text-2xl md:text-3xl text-teal-500 mb-2">
            Key Words
          </h3>
          <ul className="ml-2 sm:ml-4">
            {genzResponse.words.map((item, index) => (
              <li
                key={index}
                className="
                  flex flex-col sm:flex-row 
                  sm:items-start 
                  gap-2 sm:gap-3 
                  mb-3
                "
              >
                <ButtonSaveWord
                  handleClick={() =>
                    addToArchive(item.word, item.meaning, genzResponse.sentence)
                  }
                />
                <span className="font-semibold text-lg sm:text-xl md:text-2xl text-teal-300">
                  {item.word}:
                </span>
                <span className="text-sm sm:text-base md:text-lg text-zinc-300 leading-snug">
                  {item.meaning}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-zinc-500 text-center italic text-sm sm:text-base">
          No translation yet — try generating one!
        </p>
      )}
    </div>
  );
}

export default ResponseOutput;
