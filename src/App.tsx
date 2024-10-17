import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { fetchImages } from './api/unsplash';
import { prepareImages, getDifficultyLevel } from './utils';
// import mockData from './api/mock-data.json';
import GameGrid from './components/GameGrid.tsx';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(2);

  // rogue card:
  // determining when to win

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query === '') {
      setInputInvalid(true);
    } else {
      setInputInvalid(false);
    }

    const newImages = await fetchImages(
      query,
      getDifficultyLevel(difficultyLevel),
      setLoading
    );
    // const newImages = mockData;

    setUpGame(newImages);
  };

  const setUpGame = (images) => {
    const preparedImages = prepareImages(images);

    setCompleted(false);
    setImages(preparedImages);
    setPlaying(true);
  };

  const concludeGame = () => {
    setCompleted(true);
    setDifficultyLevel((prev) => prev + 1);
    setPlaying(false);
  };

  return (
    <div className="w-screen h-screen relative">
      <div
        style={{
          backgroundImage: `url(${images[0]?.urls.full})`,
        }}
        className={`
          absolute
          w-screen h-screen
          left-0 top-0
          bg-no-repeat bg-cover bg-center
          opacity-20
        `}
      ></div>
      <h1 className="text-2xl">Play Memory</h1>

      <form
        onSubmit={handleSearch}
        className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-4 mb-4"
      >
        <Input
          className="max-w-[400px] "
          type="text"
          placeholder="Search for images (e.g. mountains, cars)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          isInvalid={inputInvalid}
          errorMessage="Please enter something to search for"
        />
        {playing ? (
          <Button isDisabled color="primary">
            Get Images & Start
          </Button>
        ) : (
          <Button type="submit" color="primary">
            Get Images & Start
          </Button>
        )}
      </form>
      <div className="flex justify-center mb-2">
        {completed ? <h2>Great Success!!</h2> : <h2>Focus!!</h2>}
      </div>
      {loading && images.length ? (
        <p>Loading...</p>
      ) : (
        <GameGrid images={images} concludeGame={concludeGame} />
      )}
    </div>
  );
};

export default App;

// 1rem = 16px
