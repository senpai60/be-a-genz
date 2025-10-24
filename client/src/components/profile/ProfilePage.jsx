import React, { useState, useEffect } from "react";
import { AiOutlineInbox } from "react-icons/ai";
import promptApi from "../../utils/promptApi";
import Loader from "../ui/Loader";
import { useToast } from "../ui/Toast";

function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [archivedWords, setArchivedWords] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        // This endpoint is protected, so it will only work if logged in
        const res = await promptApi.get("/archived-word");
        setArchivedWords(res.data.archiveList);
      } catch (err) {
        showToast("Could not load archived words", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchive();
  }, [showToast]);

  return (
    <section className="w-full h-full p-3 md:p-5 text-zinc-300">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Profile & Archive</h1>

      {/* User Details Section */}
      <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 mb-6">
        <h2 className="text-xl font-semibold mb-3 text-zinc-500">My Details</h2>
        {/* TODO: Create a '/users/me' endpoint to fetch this data */}
        <p className="text-zinc-400">
          <span className="font-medium text-zinc-200">Username:</span> (Coming
          Soon)
        </p>
        <p className="text-zinc-400">
          <span className="font-medium text-zinc-200">Email:</span> (Coming Soon)
        </p>
        <p className="text-xs text-zinc-500 mt-2">
          (User details are not yet available from the server)
        </p>
      </div>

      {/* Archived Words Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-green-400">My Archived Words</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader />
          </div>
        ) : archivedWords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 bg-zinc-800/50 rounded-lg border border-zinc-700 border-dashed">
            <AiOutlineInbox className="text-4xl text-zinc-500 mb-2" />
            <p className="text-zinc-500">Your archive is empty.</p>
            <p className="text-zinc-600 text-sm">
              Words you save from the "Use AI" page will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {archivedWords.map((word) => (
              <div
                key={word._id}
                className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
              >
                <h3 className="text-lg font-semibold text-purple-400 truncate capitalize">
                  {word.word}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
