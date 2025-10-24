import React, { useState } from 'react';
import ButtonPrimary from '../ui/ButtonPrimary';
import PromptForm from '../UseUi/PromptForm';
import ResponseOutput from '../UseUi/ResponseOutput';

function UseAi() {
  const [genzResponse, setGenzResponse] = useState(null);
  
  // 1. DEFINE the loading state here
  const [isLoading, setIsLoading] = useState(false); 
  
  const [promptType, setPromptType] = useState("sentence");
  const [isSentencePrompt, setIsSentencePrompt] = useState(true);

  const changePromptType = () => {
    if (isSentencePrompt) {
      setPromptType("word");
      setIsSentencePrompt(false);
    } else {
      setPromptType("sentence");
      setIsSentencePrompt(true);
    }
  };

  return (
    <section className='md:p-4 w-full'>
      
      {/* <h1 className='text-3xl sm:text-4xl md:text-5xl text-zinc-800 tracking-wide mb-6'>
        Get more GENZ words, meanings, and modern sentences from the sentence you like!
      </h1> */}

      <div className="btns flex flex-row gap-4 py-4">
        <ButtonPrimary 
          handleClick={changePromptType} 
          selectionStyle={promptType==='sentence'?"bg-teal-950":""}
        >
          Use Sentence
        </ButtonPrimary>
        <ButtonPrimary 
          handleClick={changePromptType} 
          selectionStyle={promptType==='word'?"bg-teal-950":""}
        >
          Use Words
        </ButtonPrimary>
      </div>

      {/* MAIN CONTAINER */}
      <div className="main flex flex-col md:flex-row gap-5 items-start w-full">
        
        {/* LEFT - Prompt Form */}
        <div className="left w-full md:w-1/2">
          {isSentencePrompt 
            ? <PromptForm 
                setGenzResponse={setGenzResponse} 
                promptType={promptType} 
                // 2. PASS the state and setter down
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              /> 
            : <PromptForm 
                promptType={promptType} 
                // (Also pass here in case your 'word' prompt also generates)
                setGenzResponse={setGenzResponse} 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
          }
        </div>

        {/* RIGHT - Response Output */}
        <div className="right w-full md:w-1/2 mt-4 md:mt-0">
          {/* 3. PASS the loading state down to show the loader */}
          <ResponseOutput 
            genzResponse={genzResponse} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </section>
  );
}

export default UseAi;