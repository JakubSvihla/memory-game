import { useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { fetchImages } from './api/unsplash';
import { prepareImages, adjustNumOfCards, getDifficultyLevel } from './utils';
// import mockData from './api/mock-data.json';
import GameGrid from './components/GameGrid.tsx';
import config from './config.json';
import ModalGameCompleted from './components/ModalGameCompleted.tsx';

export interface ImageType {
  urls: {
    full: string;
  };
}

const App = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [numOfCards, setNumOfCards] = useState(config.initialNumOfCards);
  const [modalGameCompletedOpen, setModalGameCompletedOpen] = useState(false);

  const level = getDifficultyLevel(numOfCards);

  const getImages = async (query: string) => {
    const newImages = await fetchImages(
      query,
      adjustNumOfCards(numOfCards),
      setLoading
    );
    // const newImages = mockData;

    setUpGame(newImages);
  };

  const submitInput = async (e: any) => {
    if (e) {
      e.preventDefault();
    }

    if (query === '') {
      getImages(config.initialChips[0]);
      return;
    }

    getImages(query);
    // is this in correct place?
    // should not make request if input empty
  };

  const setUpGame = (images: ImageType) => {
    const preparedImages = prepareImages(images);

    setCompleted(false);
    setImages(preparedImages);
    setPlaying(true);
  };

  const concludeGame = () => {
    setCompleted(true);
    setModalGameCompletedOpen(true);
    setNumOfCards((prev) => prev + 1);
    setPlaying(false);
  };

  const close = () => {
    setModalGameCompletedOpen(false);
  };

  return (
    <>
      <ModalGameCompleted isOpen={modalGameCompletedOpen} close={close} />
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

        <h1 className="text-2xl text-center mb-4">Play Memory Odd</h1>

        {config.displayInputField && !playing && (
          <form
            onSubmit={submitInput}
            className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-4"
          >
            <Input
              className="max-w-[300px] "
              type="text"
              placeholder="Search for images (e.g. mountains, cars)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              errorMessage="Please enter something to search for or click on a suggestion below"
            />

            <Button type="submit" color="primary">
              Get Images & Start{' '}
              {numOfCards > config.initialNumOfCards && 'Next Level'}
            </Button>
          </form>
        )}

        {!playing && (
          <div className="mb-4">
            <p className="text-center">Select theme:</p>
            <div className="flex justify-center">
              {config.initialChips.map((chip: string) => (
                <Chip
                  key={chip}
                  className="cursor-pointer mr-1"
                  color="primary"
                  onClick={(e: any) => getImages(e.target.textContent)}
                >
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mb-2">
          <h2>Level: {level}</h2>
        </div>

        <div>
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
      </div>
    </>
  );
};

export default App;

// 1rem = 16px
