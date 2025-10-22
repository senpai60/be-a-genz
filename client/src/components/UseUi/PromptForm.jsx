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
    console.log("Sending to API:", inputSentenceValue);
    try {
      const response = await promptApi.post("/translate-genz", {
        sentence: inputSentenceValue,
      });
      const rawText = response.data?.data?.raw_text;

      if (!rawText) {
        console.error("No raw_text returned from API", response.data);
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(rawText.replace(/```json|```/g, "").trim());
      } catch (err) {
        console.warn("Failed to parse AI JSON, falling back to raw text");
        parsedData = { raw_text: rawText };
      }

      console.log("Parsed Data:", parsedData);
      setGenzResponse(parsedData);
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic placeholder based on promptType
  const placeholder =
    promptType === "sentence"
      ? "Write a sentence to convert in genz sentence and get info..."
      : "Write words to get examples and meaning in genz mode and get info...";

  return (
    <section className="sentence-form">
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
