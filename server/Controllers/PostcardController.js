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

export const deletePostcard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const postcard = await Postcard.findById(id);
    if (!postcard) {
      return res
        .status(404)
        .json({ message: "Pocztówka nie została znaleziona." });
    }

    // Verify that the postcard belongs to a folder owned by the user
    const folder = await Folder.findOne({ _id: postcard.folderId, userId });
    if (!folder) {
      return res.status(403).json({
        message: "Brak uprawnień do usunięcia tej pocztówki.",
      });
    }

    await Postcard.findByIdAndDelete(id);
    res.status(200).json({ message: "Pocztówka została usunięta." });
  } catch (error) {
    console.error("Błąd przy usuwaniu pocztówki:", error);
    res.status(500).json({ message: "Wystąpił błąd przy usuwaniu pocztówki." });
  }
};

export const editPostcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.userId;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Brakuje tytułu lub treści pocztówki." });
    }

    const postcard = await Postcard.findById(id);
    if (!postcard) {
      return res
        .status(404)
        .json({ message: "Pocztówka nie została znaleziona." });
    }

    // Verify that the postcard belongs to a folder owned by the user
    const folder = await Folder.findOne({ _id: postcard.folderId, userId });
    if (!folder) {
      return res
        .status(403)
        .json({ message: "Brak uprawnień do edycji tej pocztówki." });
    }

    postcard.name = name.trim();
    postcard.description = description.trim();
    await postcard.save();

    res.status(200).json({
      message: "Pocztówka została zaktualizowana.",
      postcard,
    });
  } catch (error) {
    console.error("Błąd przy edycji pocztówki:", error);
    res.status(500).json({ message: "Wystąpił błąd przy edycji pocztówki." });
  }
};
