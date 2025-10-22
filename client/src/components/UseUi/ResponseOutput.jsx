import React from "react";
import ButtonSaveWord from "./ButtonSaveWord";

function ResponseOutput({ genzResponse }) {
  return (
    <div className=" max-h-[60vh] overflow-y-auto p-4 border border-zinc-700 rounded scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
      {genzResponse ? (
        <>
          <h2 className="text-3xl text-green-400 mb-2">GenZ Translation</h2>
          <p className="text-lg mb-4 leading-relaxed">{genzResponse.sentence}</p>

          <h3 className="text-3xl text-teal-500 mb-2">Key Words</h3>
          <ul className="ml-4">
            {genzResponse.words.map((item, index) => (
              <li key={index} className="flex items-start gap-3 mb-3">
                <ButtonSaveWord />
                <span className="font-semibold text-2xl text-teal-300">{item.word}:</span>
                <span className="text-[1.2rem] text-zinc-300 leading-snug">{item.meaning}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-zinc-500 text-center italic">
          No translation yet — try generating one!
        </p>
      )}
    </div>
  );
}

export default ResponseOutput;
