const SCRIPTWRITERS_COUNT = 2;

const ACTORS_COUNT = 3;

const MAX_COMMENTS_ON_FILM = 5;

const Raiting = {
  MIN: 0,
  MAX: 10,
};

const AgeRating = {
  MIN: 0,
  MAX: 18
};

const YearsDuration = {
  MIN: 5,
  MAX: 10
};

const Runtime = {
  MIN: 60,
  MAX: 180
};

const GenreCount = {
  MIN: 1,
  MAX: 3
};

const DaysDuration = {
  MIN: 0,
  MAX: 7
};

const DateType = {
  FILM_INFO: 'FILM_INFO',
  USER_DETAILS: 'USER_DETAILS'
};

const names = [
  'Alice',
  'Ivan',
  'Sergey',
  'Dakota',
  'Nevada',
  'Fedor'
];

const surnames = [
  'Makoveev',
  'Ivanov',
  'Romanov',
  'Lee',
  'James',
  'Walker'
];

const titles = [
  'A Little Pony Without The Carpet',
  'The Great Adventure',
  'Mystery of the Old House',
  'Journey to the Unknown',
  'Legends of the Hidden Temple',
  'Quest for the Lost City',
  'Tales from the Enchanted Forest',
  'Chronicles of the Brave Knight',
  'Secrets of the Ancient Ruins',
  'Voyage to the Stars',
  'A Little Pony Who Bought The Darkness',
  'Family Who Bought The Carpet',
  'Raiders Who Saw Him',
  'Guest Within Him',
  'Pioneers Without The Darkness',
  'A Tale Of A Little Bird With Him',
  'A Shark Who Sold The Wall',
  'Raiders Who The Storm',
  'Family Who Stole The Darkness',
  'A Lion Without Us',
];

const posters = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
];

const countries = [
  'USA',
  'UK',
  'France',
  'Germany',
  'Canada',
  'Australia',
  'Italy',
  'Spain',
  'Japan',
  'India',
  'Russia'
];

const genres = [
  'Drama',
  'Comedy',
  'Thriller',
  'Horror',
  'Sci-Fi',
  'Documentary',
  'Action',
  'Romance',
  'Animation',
  'Fantasy',
  'Mystery',
  'Adventure',
  'Musical',
  'Western',
  'Biography',
  'Crime',
  'Family',
  'History',
  'Sport',
  'War',
];

const description = [
  'A thrilling adventure of a little pony who embarks on a journey to find the legendary carpet that is said to bring happiness to all who ride it.',
  'In a world where dreams come true, a young girl discovers the magic within herself to change her destiny.',
  'A heartwarming tale of friendship and courage as a group of unlikely heroes band together to save their village from impending doom.',
  'An epic saga of love and betrayal set against the backdrop of a war-torn kingdom, where loyalties are tested and destinies are forged.',
  'A gripping mystery that unravels the secrets of a small town, where everyone has something to hide and no one is who they seem.',
  'A comedic romp through the lives of a dysfunctional family as they navigate the ups and downs of everyday life with humor and heart.',
  'A fantastical journey to a magical realm where mythical creatures roam and ancient prophecies come to life.',
  'A poignant exploration of human resilience and the power of hope in the face of adversity, as one man fights to reclaim his life.',
  'A suspenseful thriller that keeps you on the edge of your seat, as a detective'
];

const comments = [
  'Great movie! Really enjoyed it.',
  'Not my cup of tea.',
  'An absolute masterpiece!',
  'Could have been better.',
  'Loved the cinematography.',
  'The plot was a bit weak.',
  'Fantastic performances by the cast.',
];

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

export {
  SCRIPTWRITERS_COUNT,
  ACTORS_COUNT,
  MAX_COMMENTS_ON_FILM,
  Raiting,
  AgeRating,
  YearsDuration,
  Runtime,
  GenreCount,
  DaysDuration,
  DateType,
  names,
  surnames,
  titles,
  posters,
  countries,
  genres,
  description,
  comments,
  emotions
};
