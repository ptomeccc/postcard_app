import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { uploadImagesToCloudinary } from "../../utils/uploadImagesToCloudinary";
import "./Folder.css";

const Folder = () => {
  const { id } = useParams();
  const [folderName, setFolderName] = useState("");
  const [postcards, setPostcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useContext(AuthContext);
  // Okno modalne
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostcard, setNewPostcard] = useState({
    name: "",
    description: "",
    photos: [],
  });

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:4000/folder/${id}`, {
          withCredentials: true,
        });
        console.log("Response Data:", response.data);

        setFolderName(response.data.folderName);
        setPostcards(
          response.data.postcards.map((card) => ({
            ...card,
            currentPhoto: 0,
          }))
        );
      } catch (error) {
        console.error("Błąd pobierania:", error);
        setError(
          error.message || "Wystąpił nieznany błąd podczas ładowania folderu."
        );
        setPostcards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [id]); // Add id to dependency array
  const handleAddPostcard = async (e) => {
    e.preventDefault();

    try {
      if (!newPostcard.photos || newPostcard.photos.length === 0) {
        throw new Error("Please select at least one photo");
      }
      console.log("Attempting to upload photos:", newPostcard.photos);
      const imageUrls = await uploadImagesToCloudinary(newPostcard.photos);

      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Failed to upload images to Cloudinary");
      }
      console.log("Successfully uploaded images:", imageUrls);

      const postcardData = {
        name: newPostcard.name,
        description: newPostcard.description,
        photos: imageUrls,
      };

      const response = await axios.post(
        `http://localhost:4000/folder/${id}/add_postcard`,
        postcardData,
        { withCredentials: true }
      );

      setPostcards((prev) => [
        ...prev,
        {
          ...response.data,
          currentPhoto: 0,
        },
      ]);
      setNewPostcard({ name: "", description: "", photos: [] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Błąd dodawania pocztówki:", error);
      alert(error.message || "Wystąpił błąd podczas dodawania pocztówki");
    }
  };

  if (loading) {
    return <p>Ładowanie folderu...</p>;
  }

  if (error) {
    return <p>Wystąpił błąd podczas ładowania folderu: {error}</p>;
  }

  return (
    <>
      <div className="folder-container">
        <h1>{folderName}</h1>
        {username && (
          <button onClick={() => setIsModalOpen(true)}>
            Dodaj nową pocztówkę
          </button>
        )}
        <div className="postcard-list">
          {postcards.map((card, index) => (
            <div className="postcard" key={index}>
              <h3>{card.name}</h3>
              <p>{card.description}</p>
              {card.photos.length > 0 && (
                <div className="carousel">
                  {card.photos.length > 1 && (
                    <button
                      className="carousel-btn left"
                      onClick={() =>
                        setPostcards((prev) =>
                          prev.map((c, i) =>
                            i === index
                              ? {
                                  ...c,
                                  currentPhoto:
                                    (c.currentPhoto - 1 + c.photos.length) %
                                    c.photos.length,
                                }
                              : c
                          )
                        )
                      }>
                      ‹
                    </button>
                  )}

                  <div className="carousel-images">
                    <img
                      src={card.photos[card.currentPhoto]}
                      alt="Zdjęcie pocztówki"
                      className="carousel-image"
                    />
                  </div>

                  {card.photos.length > 1 && (
                    <button
                      className="carousel-btn right"
                      onClick={() =>
                        setPostcards((prev) =>
                          prev.map((c, i) =>
                            i === index
                              ? {
                                  ...c,
                                  currentPhoto:
                                    (c.currentPhoto + 1) % c.photos.length,
                                }
                              : c
                          )
                        )
                      }>
                      ›
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Dodaj nową pocztówkę</h2>
              <form onSubmit={handleAddPostcard}>
                <input
                  type="text"
                  placeholder="Nazwa"
                  value={newPostcard.name}
                  onChange={(e) =>
                    setNewPostcard({ ...newPostcard, name: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Treść"
                  value={newPostcard.description}
                  onChange={(e) =>
                    setNewPostcard({
                      ...newPostcard,
                      description: e.target.value,
                    })
                  }
                  required></textarea>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files).slice(0, 2);
                    setNewPostcard((prev) => ({ ...prev, photos: files }));
                  }}
                />
                <button type="submit">Dodaj</button>
              </form>
              <button onClick={() => setIsModalOpen(false)}>Anuluj</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Folder;
