import React, { useState } from "react";
import TextAreaInput from "../ui/TextAreaInput";
import GenerateAi from "./GenerateAi";
import promptApi from "../../utils/promptApi";

function PromptForm({ promptType, setGenzResponse }) {
  const [inputSentenceValue, setInputSentenceValue] = useState("");

  const handleChange = (eventValue) => {
    setInputSentenceValue(eventValue);
  };

  const handleGeneration = async (value) => {
    if (!inputSentenceValue.trim()) {
      console.log("Please enter a valid sentence.");
      return;
    }
    try {
      const response = await promptApi.post("/translate-genz", {
        sentence: inputSentenceValue,
      });
      const rawText = response.data?.data?.raw_text;

      let parsedData;
      try {
        parsedData = JSON.parse(rawText.replace(/```json|```/g, "").trim());
      } catch (err) {
        parsedData = { raw_text: rawText };
      }

      setGenzResponse(parsedData);
    } catch (err) {
      console.error(err);
    }
  };

  const placeholder =
    promptType === "sentence"
      ? "Write a sentence to convert in genz sentence and get info..."
      : "Write words to get examples and meaning in genz mode and get info...";

  return (
    <section
      className="
        sentence-form 
        w-full 
        md:w-[70%] 
        lg:w-[60%] 
        mx-auto 
        flex flex-col 
        gap-3 
        mt-6 
        px-3 sm:px-4 md:px-8 
      "
    >
      <TextAreaInput
        onChange={(e) => handleChange(e.target.value)}
        inputName={promptType}
        inputId={`${promptType}-prompt`}
        value={inputSentenceValue}
        placeholder={placeholder}
      />
      <GenerateAi
        inputSentenceValue={inputSentenceValue}
        handleGeneration={handleGeneration}
      >
        Generate✨
      </GenerateAi>
    </section>
  );
}

export default PromptForm;
