import { Image } from '@nextui-org/react';
import { calculateGridClasses } from '../utils';
import { delayMs } from '../config.js';
import { useEffect, useState } from 'react';

const GameGrid = ({ images, resetGame }) => {
  const [revealed, setRevealed] = useState([]);
  const [paired, setPaired] = useState([]);
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

  const handleCardClick = (card) => {
    if (card.flipState === 'revealed') {
      return;
    }
    card.flipState = 'revealed';

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
  );
};

export default GameGrid;
