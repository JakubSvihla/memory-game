import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { fetchImages } from './api/unsplash';
import {
  assignCustomProperty,
  shuffle,
  calculateGridClasses,
  doubleImages,
} from './utils';
import mockData from './api/mock-data.json';
import { delayMs } from './config.js';
import Timer from './components/Timer.tsx';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [paired, setPaired] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(2);
  const cardSize = 100;

  useEffect(() => {
    if (revealed.length === 2) {
      function onTimeout() {
        revealed[0].flipState = 'hidden';
        revealed[1].flipState = 'hidden';
        setRevealed([]);
      }

      const timeoutId = setTimeout(onTimeout, delayMs);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [revealed]);

  // rogue card
  // fetching it - difficulty level + 1
  // assign it uniqueKey
  // put it in the array after doubling
  // determining when to win

  const setUpGame = (images) => {
    assignCustomProperty(images, 'flipState', 'hidden');

    const rogueCard = images.pop(); // make sure it's not the same as the bg image
    rogueCard.uniqueKey = `${rogueCard.id}-1`;

    const imagesDoubled = doubleImages(images);

    imagesDoubled.push(rogueCard);

    shuffle(imagesDoubled);

    setCompleted(false);
    setImages(imagesDoubled);
    setPlaying(true);
    // setQuery('');
  };

  const resetGame = () => {
    setCompleted(true);
    setDifficultyLevel((prev) => prev + 1);
    setPlaying(false);
    setPaired([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query === '') {
      setInputInvalid(true);
    } else {
      setInputInvalid(false);
    }

    const newImages = await fetchImages(query, difficultyLevel + 1, setLoading);
    // const newImages = mockData;

    setUpGame(newImages);
  };

  const handleCardClick = (card) => {
    if (card.flipState === 'revealed') {
      return;
    }
    card.flipState = 'revealed';

    // if rogue card
    if (revealed.length === 0) {
      if (images.length - 1 === paired.length) {
        resetGame();
        return;
      }

      setRevealed([card]);
    }

    if (revealed.length === 1) {
      const isMatch = revealed[0].id === card.id;
      if (isMatch) {
        // if standard game - no rogue card
        if (images.length - 2 === paired.length) {
          resetGame();
          return;
        }

        setPaired([...paired, revealed[0], card]);
        setRevealed([]);
      } else {
        setRevealed([...revealed, card]);
      }
    }

    if (revealed.length === 2) {
      revealed[0].flipState = 'hidden';
      revealed[1].flipState = 'hidden';
      setRevealed([card]);
    }
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
        <div className="grid justify-items-center">
          {/* <Timer isRunning={playing} /> */}
          <div
            className={`grid grid-cols-${calculateGridClasses(
              images.length
            )} gap-1`}
          >
            {images.map((image) => (
              <div
                key={image.uniqueKey}
                className={`relative  w-[100px] h-[100px]`}
                onClick={() => handleCardClick(image)}
              >
                {image.flipState === 'hidden' && (
                  <Image
                    className="object-cover cursor-pointer"
                    src="../assets/gradient.jpg"
                    width={cardSize}
                    height={cardSize}
                    radius="sm"
                  />
                )}

                {image.flipState === 'revealed' && (
                  <Image
                    className="object-cover cursor-not-allowed"
                    alt={image.alt_description}
                    src={image.urls.small}
                    width={cardSize}
                    height={cardSize}
                    radius="sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

// will need to dynamically construct css grid class
// based on how many images we have

// 1rem = 16px
