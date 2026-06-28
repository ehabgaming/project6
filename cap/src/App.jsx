import { useState } from "react";
import "./App.css";

function App() {
  const [cat, setCat] = useState(null);
  const [banList, setBanList] = useState([]);
  const [message, setMessage] = useState("");

  const getCat = async () => {
    setMessage("");

    try {
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search?has_breeds=1&limit=10",
        {
          headers: {
            "x-api-key": import.meta.env.VITE_CAT_API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      const cats = data
        .filter((result) => result.breeds && result.breeds.length > 0)
        .map((result) => {
          const breed = result.breeds[0];

          return {
            image: result.url,
            breed: breed.name,
            origin: breed.origin,
            temperament: breed.temperament.split(",")[0],
          };
        });

      const allowedCats = cats.filter(
        (catInfo) =>
          !banList.includes(catInfo.breed) &&
          !banList.includes(catInfo.origin) &&
          !banList.includes(catInfo.temperament),
      );

      if (allowedCats.length === 0) {
        setCat(null);
        setMessage(
          "No cats found that are not banned. Try removing something from the ban list.",
        );
        return;
      }

      const randomCat =
        allowedCats[Math.floor(Math.random() * allowedCats.length)];

      setCat(randomCat);
    } catch (error) {
      setCat(null);
      setMessage("Something went wrong. Please try again.");
      console.log(error);
    }
  };

  const addToBanList = (value) => {
    if (!banList.includes(value)) {
      setBanList([...banList, value]);
    }
  };

  const removeFromBanList = (value) => {
    setBanList(banList.filter((item) => item !== value));
  };

  return (
    <div className="App">
      <h1>Random Cat Finder</h1>
      <p>Click discover to find a random cat breed.</p>

      <button onClick={getCat}>Discover Cat</button>

      {message && <p className="message">{message}</p>}

      {cat && (
        <div className="cat-card">
          <img src={cat.image} alt={cat.breed} />

          <h2>{cat.breed}</h2>

          <p>
            Breed:{" "}
            <button onClick={() => addToBanList(cat.breed)}>{cat.breed}</button>
          </p>

          <p>
            Origin:{" "}
            <button onClick={() => addToBanList(cat.origin)}>
              {cat.origin}
            </button>
          </p>

          <p>
            Temperament:{" "}
            <button onClick={() => addToBanList(cat.temperament)}>
              {cat.temperament}
            </button>
          </p>
        </div>
      )}

      <div className="ban-list">
        <h2>Ban List</h2>
        <p>Click one to remove it.</p>

        {banList.map((item, index) => (
          <button key={index} onClick={() => removeFromBanList(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
