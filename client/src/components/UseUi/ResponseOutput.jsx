import React, { useState } from "react";
import ButtonSaveWord from "./ButtonSaveWord";
import promptApi from "../../utils/promptApi";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

// 1. Accept 'isLoading' prop (for the *generation*)
function ResponseOutput({ genzResponse, isLoading }) {
  const { isLoggedIn } = useAuth();
  
  // 2. Create *local* state just for the 'save' buttons
  //    'null' means no word is being saved.
  const [isSavingWord, setIsSavingWord] = useState(null);

  const addToArchive = async (word, meaning, sentence) => {
    if (!isLoggedIn) {
      alert("Please Log In to Add in archive");
      return;
    }

    setIsSavingWord(word); // <-- 3. Set *which* word is saving

    try {
      const response = await promptApi.post("/add-to-archive", {
        word,
        meaning,
        sentence,
      });
      alert(response.data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingWord(null); // <-- 4. Reset saving state
    }
  };

  const containerClasses = `
    w-full 
    md:w-[70%] 
    lg:w-[60%] 
    mx-auto 
    mt-6 
    p-3 sm:p-4 md:p-6 
    border border-zinc-700 
    rounded 
    max-h-[60vh] 
    min-h-[200px] // <-- Add a min-height for the loader
    overflow-y-auto 
    scrollbar-thin 
    scrollbar-thumb-zinc-700 
    scrollbar-track-zinc-900
  `;

  // 5. Check for *generation* loading FIRST
  if (isLoading) {
    return (
      <div className={`${containerClasses} flex justify-center items-center`}>
        <Loader />
      </div>
    );
  }

  // 6. Check for empty state (no response AND not loading)
  if (!genzResponse) {
    return (
      <div className={`${containerClasses} flex justify-center items-center`}>
        <p className="text-zinc-500 text-center italic text-sm sm:text-base">
          No translation yet — try generating one!
        </p>
      </div>
    );
  }

  // 7. If not loading and we have data, show the response
  return (
    <div className={containerClasses}>
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
          {genzResponse.words.map((item, index) => {
            // 8. Check if *this specific* word is saving
            const isThisWordSaving = isSavingWord === item.word;

            return (
              <li
                key={index}
                className="
                  flex flex-col sm:flex-row 
                  sm:items-start 
                  gap-2 sm:gap-3 
                  mb-3
                "
              >
                {/* 9. Conditionally show loader or button */}
                {isThisWordSaving ? (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Loader /> {/* You might want a smaller loader here */}
                  </div>
                ) : (
                  <ButtonSaveWord
                    handleClick={() =>
                      addToArchive(item.word, item.meaning, genzResponse.sentence)
                    }
                    // 10. Disable all save buttons if *any* word is saving
                    disabled={isSavingWord !== null}
                  />
                )}

                <span className="font-semibold text-lg sm:text-xl md:text-2xl text-teal-300">
                  {item.word}:
                </span>
                <span className="text-sm sm:text-base md:text-lg text-zinc-300 leading-snug">
                  {item.meaning}
                </span>
              </li>
            );
          })}
        </ul>
      </>
    </div>
  );
}

export default ResponseOutput;