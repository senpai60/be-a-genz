import React from "react";
import SavedWordButton from "../ui/SavedWordButton";

function LeftSection() {
  const genZWords = [
    "lit",
    "sus",
    "cap",
    "no cap",
    "bet",
    "stan",
    "slay",
    "vibe",
    "yeet",
    "drip",
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[20%] hidden md:hidden lg:flex flex-col border-r border-r-zinc-800 p-4 items-start">
      <div className="header mb-4 text-2xl tracking-wide capitalize">Be A Genz!</div>
      <div className="saved-words flex flex-wrap gap-2 col-end-3">
        {genZWords.map((word)=>

        <SavedWordButton key={word}>{word}</SavedWordButton>
        )}
      </div>
    </aside>
  );
}

export default LeftSection;
