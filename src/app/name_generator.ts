let adjectives = [
    "Brave",
    "Self-confident",
    "Sensible",
    "Sincere",
    "Thoughtful",
    "Warmhearted",
    "Willing",
    "Proficient",
    "Romantic",
    "Powerful",
    "Persistent",
    "Passionate",
    "Loving",
    "Faithful",
    "Nice",
    "Optimistic",
    "Plucky",
    "Philosophical",
    "Humorous",
    "Frank",
    "Fearless",
    "Considerate",
    "Courageous",
    "Marvelous",
    "Capable",
    "Accomplished",
    "Knowledgeable",
    "Adept",
    "Expert",
    "Engaging",
    "Affectionate",
    "Agreeable",
    "Amiable",
    "Bright",
    "Charming",
    "Creative",
    "Determined",
    "Energetic",
    "Friendly",
    "Funny",
    "Generous",
    "Imaginative",
    "Polite",
    "Likable",
    "Gregarious",
    "Diplomatic",
    "Sincere",
    "Helpful",
    "Giving",
    "Kind",
    "Hardworking",
    "Diligent",
    "Patient",
    "Dynamic",
    "Loyal",
    "Amazing",
    "Awesome",
    "Blithesome",
    "Excellent",
    "Fabulous",
    "Fantastic",
    "Favorable",
    "Fortuitous",
    "Gorgeous",
    "Incredible",
    "Unique",
    "Mirthful",
    "Outstanding",
    "Perfect",
    "Propitious",
    "Remarkable",
    "Rousing",
    "Spectacular",
    "Splendid",
    "Stellar",
    "Stupendous",
    "Super",
    "Upbeat",
    "Stunning",
    "Wondrous",
    "Ample",
    "Bountiful",
    "Glistening",
    "Dazzling",
    "Twinkling",
    "Lustrous",
    "Vivid",
    "Vibrant",
    "Vivacious",
    "Glowing",
    "Gleaming",
    "Sparkling",
    "Shimmering",
    "Glimmering",
    "Glittering",
    "Brilliant",
    "Elegant",
    "Sleek",
    "Alluring",
    "Enchanting",
    "Ravishing",
    "Magnificent",
    "Captivating",
    "Lovely",
    "Glowing",
    "Flexible",
    "Independent",
    "Insightful",
    "Open-minded",
    "Productive",
    "Adventurous",
    "Articulate",
    "Charismatic",
    "Competitive",
    "Confident",
    "Devoted",
    "Educated",
    "Inquisitive",
    "Organized",
    "Relaxed",
    "Responsible",
    "Technological",
    "Resourceful",
    "Ambitious",
    "Approachable",
    "Qualified",
    "Focused",
    "Honest",
    "Efficient",
    "Personable",
];

let animals = [
    "Crow",
    "Peacock",
    "Dove",
    "Sparrow",
    "Goose",
    "Stork",
    "Pigeon",
    "Turkey",
    "Hawk",
    "Bald eagle",
    "Raven",
    "Parrot",
    "Flamingo",
    "Seagull",
    "Ostrich",
    "Swallow",
    "Black bird",
    "Penguin",
    "Robin",
    "Swan",
    "Owl",
    "Woodpecker",
    "Cow",
    "Rabbit",
    "Ducks",
    "Shrimp",
    "Pig",
    "Goat",
    "Crab",
    "Deer",
    "Bee",
    "Sheep",
    "Fish",
    "Turkey",
    "Dove",
    "Chicken",
    "Horse",
    "Dog",
    "Puppy",
    "Turtle",
    "Rabbit",
    "Parrot",
    "Cat",
    "Kitten",
    "Goldfish",
    "Mouse",
    "Tropical fish",
    "Hamster",
    "Squirrel",
    "Dog",
    "Chimpanzee",
    "Ox",
    "Lion",
    "Panda",
    "Walrus",
    "Otter",
    "Mouse",
    "Kangaroo",
    "Goat",
    "Horse",
    "Monkey",
    "Cow",
    "Koala",
    "Mole",
    "Elephant",
    "Leopard",
    "Hippopotamus",
    "Giraffe",
    "Fox",
    "Coyote",
    "Hedgehong",
    "Sheep",
    "Deer",
    "Giraffe",
    "Woodpecker",
    "Camel",
    "Starfish",
    "Koala",
    "Alligator",
    "Owl",
    "Tiger",
    "Bear",
    "Blue whale",
    "Coyote",
    "Chimpanzee",
    "Raccoon",
    "Lion",
    "Arctic wolf",
    "Crocodile",
    "Dolphin",
    "Elephant",
    "Squirrel",
    "Snake",
    "Kangaroo",
    "Hippopotamus",
    "Elk",
    "Fox",
    "Gorilla",
    "Bat",
    "Hare",
    "Toad",
    "Frog",
    "Deer",
    "Rat",
    "Badger",
    "Lizard",
    "Mole",
    "Hedgehog",
    "Otter",
    "Reindeer",
];

export function randomName(){
    let random_adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
    let random_animal = animals[Math.floor(Math.random()*animals.length)];
    return random_adjective.toLowerCase() + "-" + random_animal.toLowerCase();
}