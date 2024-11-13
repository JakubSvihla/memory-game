import { Image } from '@nextui-org/react';
import { calculateGridClasses } from '../utils';
import config from '../config.json';
import { useEffect, useState } from 'react';
import { ImageType } from '../App';

interface GameGridProps {
  images: ImageType[];
  concludeGame: () => void;
  completed: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({
  images,
  concludeGame,
  completed,
}) => {
  const [revealed, setRevealed] = useState<{ flipState: string; id: string }[]>(
    []
  );
  const [paired, setPaired] = useState<{ flipState: string; id: string }[]>([]);
  const cardSize = 100;

  useEffect(() => {
    if (revealed.length === 2) {
      function onTimeout() {
        revealed[0].flipState = 'hidden';
        revealed[1].flipState = 'hidden';
        setRevealed([]);
      }

      const timeoutId = setTimeout(onTimeout, config.delayMs);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [revealed]);

  const checkGameConcluded = () => {
    if (config.rogueCard) {
      return images.length - 2 - paired.length === 1;
    }
    return images.length - 2 === paired.length;
  };

  const handleCardClick = (card: any) => {
    if (card.flipState === 'revealed' || completed) {
      // want to be able to turn the last rogue card
      return;
    }
    card.flipState = 'revealed';

    if (revealed.length === 0) {
      setRevealed([card]);
    }

    if (revealed.length === 1) {
      const isMatch = revealed[0].id === card.id;
      if (isMatch) {
        if (checkGameConcluded()) {
          concludeGame();
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
        {images.map((image: any) => (
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
