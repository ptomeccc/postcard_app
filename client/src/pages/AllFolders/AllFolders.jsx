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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");
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
  const deleteFolder = async (folderId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten folder?")) {
      return;
    }

    setError(null);
    try {
      await axios.delete(`http://localhost:4000/folder/${folderId}`, {
        withCredentials: true,
      });
      setFolders(folders.filter((folder) => folder._id !== folderId));
    } catch (error) {
      console.error("Błąd usuwania folderu:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Wystąpił błąd podczas usuwania folderu";
      setError(errorMessage);
    }
  };

  const editFolder = async (e) => {
    e.preventDefault();
    if (!editFolderName.trim()) {
      setError("Nazwa folderu nie może być pusta");
      return;
    }
    setError(null);
    try {
      await axios.put(
        "http://localhost:4000/editfolder",
        {
          folderId: editFolderId,
          name: editFolderName.trim(),
        },
        { withCredentials: true }
      );

      setFolders(
        folders.map((folder) =>
          folder._id === editFolderId
            ? { ...folder, name: editFolderName.trim() }
            : folder
        )
      );

      setEditModalOpen(false);
      setEditFolderId(null);
      setEditFolderName("");
    } catch (error) {
      console.error("Błąd edycji folderu:", error);
      setError(
        error.response?.data?.message || "Wystąpił błąd podczas edycji folderu"
      );
    }
  };

  const openEditModal = (folder, e) => {
    e.stopPropagation();
    setEditFolderId(folder._id);
    setEditFolderName(folder.name);
    setEditModalOpen(true);
  };
  if (loading) {
    return <p>Ładowanie folderów...</p>;
  }
  return (
    <>
      {" "}
      <div className="folders-header">
        <h4>Wszystkie foldery użytkownika {username}</h4>
        {error && <div className="error-message">{error}</div>}
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
            {" "}
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="folder"
                onClick={(e) => {
                  if (!e.target.closest(".folder-action-button")) {
                    navigate(`/folder/${folder._id}`);
                  }
                }}>
                <div className="folder-actions">
                  <button
                    className="folder-action-button edit-folder-button"
                    onClick={(e) => openEditModal(folder, e)}>
                    Edytuj
                  </button>
                  <button
                    className="folder-action-button delete-folder-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFolder(folder._id);
                    }}>
                    Usuń
                  </button>
                </div>
                <h3>{folder.name}</h3>
                <p>0 pocztówek</p>
              </div>
            ))}
          </>
        ) : (
          <p>Brak folderów.</p>
        )}
      </div>
      {editModalOpen && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edytuj nazwę folderu</h2>
            <form onSubmit={editFolder}>
              <input
                type="text"
                value={editFolderName}
                onChange={(e) => setEditFolderName(e.target.value)}
                placeholder="Nowa nazwa folderu"
                autoFocus
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setEditModalOpen(false)}>
                  Anuluj
                </button>
                <button type="submit">Zapisz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllFolders;
