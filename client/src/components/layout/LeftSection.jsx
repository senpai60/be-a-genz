import { useEffect, useState } from "react";
import SavedWordButton from "../ui/SavedWordButton";
import { useAuth } from "../../context/AuthContext";
import promptApi from "../../utils/promptApi";

function LeftSection() {
  const [archivedWords, setArchivedWords] = useState([]);
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    const fetchArchive = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await promptApi.get("/archived-word");
        console.log(response.data);

        setArchivedWords(response.data.archiveList || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (!loading) fetchArchive();
  }, [isLoggedIn, loading]);

  let content;

  if (loading) {
    content = <p>Loading...</p>;
  } else if (!isLoggedIn) {
    content = <p>Please login to view archived words</p>;
  } else if (archivedWords.length === 0) {
    content = <p>Please add some words to archive</p>;
  } else {
    content = archivedWords.map((archivedWord) => (
      <SavedWordButton key={archivedWord._id}>
        {archivedWord.word}
      </SavedWordButton>
    ));
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[20%] hidden md:hidden lg:flex flex-col border-r border-r-zinc-800 p-4 items-start">
      <div className="header mb-4 text-2xl tracking-wide capitalize">
        Be A Genz!
      </div>
      <div className="saved-words flex flex-wrap gap-2 col-end-3">
        {content}
      </div>
    </aside>
  );
}

export default LeftSection;
