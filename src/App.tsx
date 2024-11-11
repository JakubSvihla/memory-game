import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { fetchImages } from './api/unsplash';
import { prepareImages, getDifficultyLevel } from './utils';
// import mockData from './api/mock-data.json';
import GameGrid from './components/GameGrid.tsx';
import config from './config.js';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false); // do i need this?
  const [difficultyLevel, setDifficultyLevel] = useState(2);

  const getImages = async (query: string) => {
    const newImages = await fetchImages(
      query,
      getDifficultyLevel(difficultyLevel),
      setLoading
    );
    // const newImages = mockData;

    setUpGame(newImages);
    setInputInvalid(false);
  };

  const submitInput = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (query === '') {
      setInputInvalid(true);
      return;
    }

    getImages(query);
    // is this in correct place?
    // should not make request if input empty
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
        onSubmit={submitInput}
        className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-4"
      >
        <Input
          className="max-w-[400px] "
          type="text"
          placeholder="Search for images (e.g. mountains, cars)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          isInvalid={inputInvalid}
          errorMessage="Please enter something to search for or click on a suggestion below"
        />

        {playing ? (
          <Button isDisabled color="primary">
            Get Images & Start
          </Button>
        ) : (
          <Button type="submit" color="primary">
            Get Images & Start {difficultyLevel > 2 && 'Next Level'}
          </Button>
        )}
      </form>

      {!playing && (
        <div>
          <p>Select suggestion:</p>
          {config.initialChips.map((chip: string) => (
            <Chip
              key={chip}
              className="cursor-pointer mr-1"
              color="primary"
              onClick={(e) => getImages(e.target.textContent)}
            >
              {chip}
            </Chip>
          ))}
        </div>
      )}

      <div className="flex justify-center mb-2">
        {completed ? <h2>Great Success!!</h2> : <h2>Focus!!</h2>}
      </div>
      {loading && images.length ? (
        <p>Loading...</p>
      ) : (
        <GameGrid
          images={images}
          concludeGame={concludeGame}
          completed={completed}
        />
      )}
    </div>
  );
};

export default App;

// 1rem = 16px
