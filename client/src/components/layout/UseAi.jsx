import React, { useState } from 'react';
import ButtonPrimary from '../ui/ButtonPrimary';
import PromptForm from '../UseUi/PromptForm';
import ResponseOutput from '../UseUi/ResponseOutput';

function UseAi() {
  const [genzResponse, setGenzResponse] = useState(null)
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
    <section className='p-4'>
      <h1 className='text-5xl text-zinc-800 tracking-wide'>
        Get more GENZ words, meanings, and modern sentences from the sentence you like!
      </h1>
      <div className="main-input w-full h-[60vh]">
        <div className="btns flex items-center gap-4 py-4">
          <ButtonPrimary handleClick={changePromptType} selectionStyle={promptType==='sentence'?"bg-teal-950":""}>Use Sentence</ButtonPrimary>
          <ButtonPrimary handleClick={changePromptType} selectionStyle={promptType==='word'?"bg-teal-950":""}>Use Words</ButtonPrimary>
        </div>
        <div className="main flex gap-5 items-start">
          <div className="left h-[80%] w-[50%]">
            {isSentencePrompt?<PromptForm setGenzResponse={setGenzResponse} promptType={promptType} />:<PromptForm promptType={promptType}/>}
        </div>
        <div className="right h-[80%] w-[50%]">
          <ResponseOutput genzResponse={genzResponse}/>
        </div>
        </div>
      </div>
    </section>
  );
}

export default UseAi;
