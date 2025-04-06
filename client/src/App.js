import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allPostcards, setAllPostcards] = useState([]);

  const addPostcard = () => {
    axios
      .post("http://localhost:3001/addpostcard", {
        name: name,
        description: description,
      })
      .then(() => {
        setAllPostcards([
          ...allPostcards,
          { name: name, description: description },
        ]);
      })
      .catch(() => {
        alert("it failed");
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/allpostcards")
      .then((result) => {
        setAllPostcards(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <div className="formDiv">
        <h1>Kolekcja pocztówek</h1>
        <input
          type="text"
          placeholder="Nazwa"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <textarea
          type="text"
          placeholder="Opis..."
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button onClick={addPostcard} className="addPostcardBtn">
          Dodaj
        </button>
      </div>
      <div className="postcardsDiv">
        <table>
          {allPostcards.map((val) => {
            return (
              <div>
                {val.name} {val.description}
              </div>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default App;
