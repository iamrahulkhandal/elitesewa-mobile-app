export const getCorrectRating = (rating: number) =>
  Math.floor(rating >= 2 ? rating / 2 : rating);

export const getFractionDigitsRating = (rating: number) => rating.toFixed(1);

export const getRatingLabel = (rating: number) => {
  const reviews = ['Bad', 'Okay', 'Good', 'Very Good', 'Amazing'];
  return reviews[rating - 1];
};
