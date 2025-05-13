import Folder from "../Models/Folder.js";
import Postcard from "../Models/Postcard.js";

export const addPostcard = async (req, res) => {
  try {
    const { id } = req.params; // folderId
    const { name, description, photos } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Brakuje tytułu lub treści pocztówki." });
    }

    const newPostcard = new Postcard({
      name: name,
      description: description,
      folderId: id,
      photos,
    });

    await newPostcard.save();
    res.status(201).json(newPostcard);
  } catch (error) {
    console.error("Błąd przy dodawaniu pocztówki:", error);
    res
      .status(500)
      .json({ message: "Wystąpił błąd przy dodawaniu pocztówki." });
  }
};
