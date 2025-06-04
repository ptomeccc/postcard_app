import Folder from "../Models/Folder.js";
import Postcard from "../Models/Postcard.js";

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    const newFolder = new Folder({ name: name, userId: userId, postcards: [] });

    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Błąd podczas tworzenia folderu", error });
  }
};

export const getAllFolders = async (req, res) => {
  try {
    const username = req.username;
    const userId = req.userId;
    const folderList = await Folder.find({ userId: userId });
    res.status(200).json({ username: username, folderList: folderList });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Błąd podczas pobierania folderów", error });
  }
};

export const getFolderById = async (req, res) => {
  try {
    const userId = req.userId;
    const folderId = req.params.id;

    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      return res.status(404).json({ message: "Folder nie został znaleziony." });
    }

    const postcards = await Postcard.find({ folderId: folder._id });

    res.status(200).json({ folderName: folder.name, postcards });
  } catch (error) {
    console.error("Błąd przy pobieraniu folderu:", error);
    res.status(500).json({ message: "Błąd podczas pobiernia folderu:", error });
  }
};

/* Create deleteFolder function */
export const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userId = req.userId; // Find the folder by ID and userId
    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      return res.status(404).json({ message: "Folder nie został znaleziony." });
    }

    // Check if folder has any postcards
    const postcardCount = await Postcard.countDocuments({
      folderId: folder._id,
    });

    if (postcardCount > 0) {
      return res.status(400).json({
        message:
          "Nie można usunąć folderu zawierającego pocztówki. Usuń najpierw wszystkie pocztówki z folderu.",
      });
    }

    // Delete the folder
    await Folder.deleteOne({ _id: folderId });

    res.status(200).json({ message: "Folder został usunięty." });
  } catch (error) {
    console.error("Błąd przy usuwaniu folderu:", error);
    res.status(500).json({ message: "Błąd podczas usuwania folderu:", error });
  }
};

export const editFolder = async (req, res) => {
  try {
    const { folderId, name } = req.body;
    const userId = req.userId;

    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ message: "Nazwa folderu nie może być pusta." });
    }

    const folder = await Folder.findOne({ _id: folderId, userId });

    if (!folder) {
      return res.status(404).json({ message: "Folder nie został znaleziony." });
    }

    folder.name = name.trim();
    await folder.save();

    res
      .status(200)
      .json({ message: "Nazwa folderu została zmieniona.", folder });
  } catch (error) {
    console.error("Błąd przy edycji folderu:", error);
    res.status(500).json({ message: "Błąd podczas edycji folderu", error });
  }
};
