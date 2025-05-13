import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllFolders.css";

const AllFolders = () => {
  const [username, setUsername] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:4000/folders", {
          withCredentials: true,
        });
        console.log("Response Data:", response.data);

        setFolders(response.data.folderList);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Błąd pobierania folderów:", error);
        setError(
          error.message || "Wystąpił nieznany błąd podczas ładowania folderów."
        );
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      setError("Nazwa folderu nie może być pusta");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/createfolder",
        { name: newFolderName },
        { withCredentials: true }
      );
      setFolders([...folders, response.data]);
      setNewFolderName("");
    } catch (error) {
      console.error("Błąd tworzenia folderu:", error);
      setError(
        error.response?.data?.message ||
          "Wystąpił błąd podczas tworzenia folderu"
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return <p>Ładowanie folderów...</p>;
  }

  if (error) {
    return <p>Wystąpił błąd podczas ładowania folderów: {error}</p>;
  }
  return (
    <>
      <div className="folders-header">
        <h4>Wszystkie foldery użytkownika {username}</h4>
        <div className="create-folder-form">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nazwa nowego folderu"
            disabled={isCreating}
          />
          <button
            onClick={createNewFolder}
            disabled={isCreating}
            className="create-folder-button">
            {isCreating ? "Tworzenie..." : "Stwórz nowy folder"}
          </button>
        </div>
      </div>
      <div className="folders-container">
        {folders.length > 0 ? (
          <>
            {folders.map((folder) => (
              <div
                key={folder._id}
                onClick={() => navigate(`/folder/${folder._id}`)}
                className="folder">
                <h3>{folder.name}</h3>
                <p>0 pocztówek</p>
              </div>
            ))}
          </>
        ) : (
          <p>Brak folderów.</p>
        )}
      </div>
    </>
  );
};

export default AllFolders;
