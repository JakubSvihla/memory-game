const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const urlBase = 'https://api.unsplash.com/search/photos';

export const fetchImages = (query: string, amount: number, setLoading) => {
  setLoading(true);
  return fetch(
    `${urlBase}?query=${query}&per_page=${amount}&client_id=${accessKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      setLoading(false);
    });
};
