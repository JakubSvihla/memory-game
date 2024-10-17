import config from './config.js';

export function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function assignCustomProperty(items, property, value) {
  items.forEach((item) => {
    item[property] = value;
  });
}

export function calculateGridClasses(imageCount: number) {
  if (imageCount === 0) return ''; // No images, no grid needed

  // Calculate the number of columns as the closest square root of the number of images
  const columns = Math.ceil(Math.sqrt(imageCount));

  // Dynamically create a Tailwind class for the grid layout

  return columns;
}

export const doubleImages = (images) => {
  return [
    ...images.map((image) => ({
      ...image,
      instance: 1,
      uniqueKey: `${image.id}-1`,
    })),
    ...images.map((image) => ({
      ...image,
      instance: 2,
      uniqueKey: `${image.id}-2`,
    })),
  ];
};

export const prepareImages = (images) => {
  assignCustomProperty(images, 'flipState', 'hidden');

  if (config.rogueCard) {
    const rogueCard = images.pop();
    rogueCard.uniqueKey = `${rogueCard.id}-1`;

    const imagesDoubled = doubleImages(images);
    imagesDoubled.push(rogueCard);

    return shuffle(imagesDoubled);
  } else {
    return shuffle(doubleImages(images));
  }
};

export const getDifficultyLevel = (level: number) => {
  return config.rogueCard ? level + 1 : level;
};
