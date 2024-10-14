import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { fetchImages } from './api/unsplash';
import { assignCustomProperty, shuffle, calculateGridClasses } from './utils';
import mockData from './api/mock-data.json';
import { delayMs } from './config.js';
import Timer from './components/Timer.tsx';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [completed, setCompleted] = useState(false);
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

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query === '') {
      setInputInvalid(true);
    } else {
      setInputInvalid(false);
    }

    const newImages = await fetchImages(query, difficultyLevel, setLoading);
    // const newImages = mockData;
    assignCustomProperty(newImages);

    // const rogueCard = newImages.pop(); // make sure it's not the same as the bg image
    // rogueCard.uniqueKey = `${rogueCard.id}-1`;
    // debugger;
    // maybe instead of having haveRogueCard, from certain number of images we can just chuck one more in
    // maybe rogueCard from the beginning
    // with rogueCard, how do we conclude the game?

    const imagesDoubled = [
      ...newImages.map((image) => ({
        ...image,
        instance: 1,
        uniqueKey: `${image.id}-1`,
      })),
      ...newImages.map((image) => ({
        ...image,
        instance: 2,
        uniqueKey: `${image.id}-2`,
      })),
    ];

    // imagesDoubled.push(rogueCard);

    shuffle(imagesDoubled);

    setCompleted(false);
    setImages(imagesDoubled);
    setPlaying(true);
    // setQuery('');
  };

  let timer;
  const handleCardClick = (card) => {
    console.log(timer);
    clearTimeout(timer);
    if (card.flipState === 'revealed') {
      return;
    }

    if (revealed.length === 0) {
      card.flipState = 'revealed';
      setRevealed([card]);
    }

    if (revealed.length === 1) {
      card.flipState = 'revealed';

      const isMatch = revealed[0].id === card.id;
      if (isMatch) {
        setRevealed([]);
        const allRevealed = images.every(
          (image) => image.flipState === 'revealed'
        );

        if (allRevealed) {
          setCompleted(true);
          setDifficultyLevel((prev) => prev + 1);
          setPlaying(false);
        }
        return;
      } else {
        setRevealed([...revealed, card]);
      }
    }

    if (revealed.length === 2) {
      revealed[0].flipState = 'hidden';
      revealed[1].flipState = 'hidden';
      card.flipState = 'revealed';
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
      {completed ? <h2>Great Success!!</h2> : ''}
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
        <Button color="danger">Stop Game</Button>
      </form>

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
