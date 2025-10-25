import React, { useState, useEffect, useCallback } from "react";
import { Bot, Zap, Loader2, Send, Save } from "lucide-react";
import commentGenApi from "../../utils/commentGenApi";

// --- MOCK UTILITY COMPONENTS (Required for CommentGenerator to run) ---

// Mock Component for ButtonPrimary (Tailwind dark theme compatible)
function ButtonPrimary({
  children,
  handleClick,
  selectionStyle = "",
  disabled = false,
  Icon,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-4 py-2 font-semibold text-sm rounded-lg shadow-md transition-all duration-200
        bg-teal-700 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${selectionStyle}
      `}
    >
      {children}
      {Icon && <Icon className="w-5 h-5 ml-2 inline-block" />}
    </button>
  );
}

// Mock Component for Loader
function Loader() {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      <span className="ml-3 text-zinc-400">Loading...</span>
    </div>
  );
}

// Mock Component for ResponseOutputCard (for displaying generated content)
function ResponseOutputCard({ generatedComment, onSave }) {
  if (!generatedComment) {
    return (
      <div className="p-6 bg-zinc-800 rounded-xl shadow-lg h-full flex flex-col justify-center items-center">
        <Bot className="w-12 h-12 text-teal-500 mb-4" />
        <p className="text-zinc-400 text-center">
          Your generated comment will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-xl shadow-lg flex flex-col h-full min-h-[300px]">
      <h3 className="text-xl font-bold text-teal-400 mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2" /> Generated Comment
      </h3>
      <div className="flex-1 bg-zinc-900 p-4 rounded-lg overflow-y-auto">
        <p className="text-zinc-200 whitespace-pre-wrap">{generatedComment}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <ButtonPrimary handleClick={() => onSave(generatedComment)} Icon={Save}>
          Save Comment
        </ButtonPrimary>
      </div>
    </div>
  );
}

// --- CORE FEATURE COMPONENT: CommentGenerator ---

const CommentGenerator = ({ backendUri = "/prompt/generate-comment" }) => {
  // Mock API Key, required for the fetch operation
  const apiKey = "";

  // State
  const [postContext, setPostContext] = useState("");
  const [commentTone, setCommentTone] = useState("supportive");
  const [generatedComment, setGeneratedComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- New State for Image Upload ---
  const [selectedImage, setSelectedImage] = useState(null); // Stores the File object
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // For <img> src
  const [imageBase64, setImageBase64] = useState(null); // For API

  // Available Tones
  const tones = [
    { value: "supportive", label: "Supportive & Encouraging" },
    { value: "funny", label: "Funny & Witty" },
    { value: "savage", label: "Savage & Bold" },
    { value: "deep", label: "Insightful & Deep" },
    { value: "genz", label: "Gen Z Slang" },
  ];

  // Custom fetch wrapper with exponential backoff for resilience
  const fetchWithBackoff = useCallback(async (url, options) => {
    let lastError = null;
    for (let i = 0; i < 4; i++) {
      // Max 4 attempts
      try {
        const response = await fetch(url, options);
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
      } catch (e) {
        lastError = e;
        if (i < 3) {
          const delay = Math.pow(2, i) * 1000 + Math.random() * 1000; // 1s, 2s, 4s + jitter
          console.log(
            `Attempt ${i + 1} failed. Retrying in ${delay / 1000}s...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  }, []);

  // --- New Image Handler Functions ---

  /**
   * Handles the file selection, creates a preview URL, and converts the image to Base64.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Clear previous preview
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file); // Store the file object
      setImagePreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for preview

      // Convert to Base64 for API
      const reader = new FileReader();
      reader.onloadend = () => {
        // result includes 'data:image/jpeg;base64,' part, we need to strip it
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreviewUrl(null);
      setImageBase64(null);
    }
  };

  /**
   * Clears the selected image, preview, and Base64 data.
   */
  const clearImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setImageBase64(null);

    // Also clear the file input value so the user can re-select the same file
    const fileInput = document.getElementById("imageUpload");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  /**
   * Effect to clean up the object URL on component unmount or when preview URL changes.
   */
  useEffect(() => {
    // Cleanup object URL
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  /**
   * Main function to generate the comment.
   * Now includes image data in the API request if present.
   */
  const generateComment = async (e) => {
    e.preventDefault();
    if (!postContext.trim()) {
      setError("Please provide some context about the post or topic.");
      return;
    }

    setIsLoading(true);
    setGeneratedComment("");
    setError(null);

    try {
      // Send to backend, not Gemini directly
      // Use a direct fetch with a deterministic URL so we don't accidentally
      // hit the wrong axios instance (there were cases where requests went to
      // /prompt/... instead of /comments/...). This will fall back to
      // localhost:3000 when VITE_SERVER_URI is not set.
      const serverBase = import.meta.env.VITE_SERVER_URI
        ? import.meta.env.VITE_SERVER_URI
        : "http://localhost:3000";

      const endpoint = `${serverBase.replace(/\/$/, "")}/comments/gen-comment`;

      const fetchResp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userPrompt: postContext,
          tone: commentTone,
          imageBase64: imageBase64 || null,
          imageType: selectedImage?.type || null,
        }),
      });

      if (!fetchResp.ok) {
        const text = await fetchResp.text();
        throw new Error(text || `Server returned ${fetchResp.status}`);
      }

      const data = await fetchResp.json();
      setGeneratedComment(data.comment);
    } catch (err) {
      console.error("Backend error:", err.response?.data || err.message);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (comment) => {
    // Replaced alert() with console log to adhere to safety guidelines
    console.log(`Mock Save: "${comment}" has been archived!`);
    // This is where you would call your Firestore/database logic.
    // You also have access to the 'selectedImage' (File object) and 'imageBase64' (string)
    // state variables here if you need to save the image.
    console.log("Image File (if any):", selectedImage);
  };

  return (
    <section className="md:p-4 w-full h-full text-zinc-100 bg-zinc-950">
      <h1 className="text-3xl sm:text-4xl tracking-wide mb-6">
        Instant Comment Generator{" "}
        <Zap className="w-6 h-6 inline-block text-yellow-400 ml-2" />
      </h1>

      {/* MAIN CONTAINER */}
      <div className="main flex flex-col lg:flex-row gap-8 items-stretch w-full h-[calc(100%-100px)]">
        {/* LEFT - Prompt Form & Controls */}
        <div className="left w-full lg:w-1/2 p-6 bg-zinc-800 rounded-xl shadow-lg overflow-y-auto">
          <h2 className="text-xl font-semibold text-teal-300 mb-4">
            1. Context & Tone
          </h2>

          <form onSubmit={generateComment} className="space-y-5">
            {/* POST CONTEXT INPUT */}
            <div className="form-group">
              <label
                htmlFor="context"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Post Context / Topic Summary (What is the post about?)
              </label>
              <textarea
                id="context"
                value={postContext}
                onChange={(e) => {
                  setPostContext(e.target.value);
                  setError(null);
                }}
                rows="6"
                placeholder="e.g., 'My friend just graduated from college and posted a picture in her cap and gown.' or 'A video of a golden retriever failing to catch a ball.'"
                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-teal-500 focus:border-teal-500"
                disabled={isLoading}
                required
              />
            </div>

            {/* TONE SELECT */}
            <div className="form-group">
              <label
                htmlFor="tone"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                2. Select Comment Tone
              </label>
              <select
                id="tone"
                value={commentTone}
                onChange={(e) => setCommentTone(e.target.value)}
                className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 appearance-none focus:ring-teal-500 focus:border-teal-500"
                disabled={isLoading}
              >
                {tones.map((tone) => (
                  <option
                    key={tone.value}
                    value={tone.value}
                    className="bg-zinc-800 text-zinc-100"
                  >
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            {/* --- NEW: IMAGE UPLOAD --- */}
            <div className="form-group">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                3. Add Image (Optional)
              </label>
              {imagePreviewUrl ? (
                // Show preview and remove button
                <div className="mt-2 relative w-full max-w-xs">
                  <img
                    src={imagePreviewUrl}
                    alt="Selected preview"
                    className="rounded-lg object-cover w-full max-h-64 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
                    aria-label="Remove image"
                    disabled={isLoading}
                  >
                    {/* Inline X SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                // Show upload button
                <label
                  htmlFor="imageUpload"
                  className={`
                    w-full flex justify-center items-center px-4 py-6 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg text-zinc-400
                    ${
                      isLoading
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:border-teal-500 hover:text-teal-400 transition-colors"
                    }
                  `}
                >
                  {/* Inline Image SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Click to upload an image
                </label>
              )}
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p className="text-red-500 text-sm mt-2 p-2 bg-red-900/30 border border-red-700 rounded-lg">
                {error}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <ButtonPrimary
                type="submit"
                disabled={isLoading || !postContext.trim()}
                Icon={Send}
              >
                {isLoading ? "Generating..." : "Generate Comment"}
              </ButtonPrimary>
              {isLoading && (
                <span className="ml-4 text-zinc-400 text-sm">
                  May take a few moments...
                </span>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT - Response Output */}
        <div className="right w-full lg:w-1/2 mt-8 lg:mt-0">
          {isLoading ? (
            <Loader />
          ) : (
            <ResponseOutputCard
              generatedComment={generatedComment}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentGenerator;
