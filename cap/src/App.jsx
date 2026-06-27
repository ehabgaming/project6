import { useState } from "react";
import "./App.css";

function App() {
  const [artwork, setArtwork] = useState(null);

  const getArtwork = async () => {
    try {
      const radomPage = Math.floor(Math.random() * 100) + 1;

      const response = axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${radomPage}&limit=100`,
      );
      const artworks = await response.data.data;

      const randomArtwork =
        artworks[Math.floor(Math.random() * artworks.length)];

      setArtwork(randomArtwork);
    } catch (error) {
      console.error("Error fetching artwork:", error);
    }
  };
  return (
    <>
      <div className="App">
        <h1>Random Artwork</h1>
        <button onClick={getArtwork}>Get Random Artwork</button>

        {artwork && (
          <div className="card">
            <img
              src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
              alt={artwork.title}
            />
            <h2>{artwork.title}</h2>
            <p>{artwork.artist_title}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
