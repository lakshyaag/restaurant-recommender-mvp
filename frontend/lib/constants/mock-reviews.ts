export interface RestaurantReview {
  id: string;
  restaurantId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  text: string;
  helpfulCount: number;
  photos?: string[];
}

// Business context scores for restaurant suitability
export interface BusinessContextScores {
  noiseLevel: number; // 1-5, where 1 is quiet, 5 is very loud
  privacyLevel: number; // 1-5, where 1 is public, 5 is very private
  formalityLevel: number; // 1-5, where 1 is casual, 5 is very formal
  meetingTypes: string[]; // Types of meetings this place is good for
}

// Default business context scores - you would ideally determine these based on the restaurant or client profile
export const defaultBusinessContext: BusinessContextScores = {
  noiseLevel: 3, // Medium noise
  privacyLevel: 4, // Good privacy
  formalityLevel: 4, // Somewhat formal
  meetingTypes: ["Client presentations", "Team meetings", "Casual client lunches", "Business dinners"]
};

// Business context highlights - key points from reviews relevant to business meetings
export const businessHighlights = [
  "Private dining rooms available for presentations",
  "Accommodates dietary restrictions",
  "Manageable noise level for conversations",
  "Professional atmosphere",
  "Attentive but non-intrusive service"
];

// Mock review data
const mockReviews: RestaurantReview[] = [
  // Generic reviews that will be used for any restaurant without specific reviews
  {
    id: "generic1",
    restaurantId: "generic",
    userName: "Olivia Martinez",
    userAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 4,
    date: "2023-10-15",
    text: "Excellent choice for business meetings. The staff was accommodating of our large group and the private room setup was perfect for our presentation. Food came out quickly and everyone was satisfied with their meals.",
    helpfulCount: 12,
  },
  {
    id: "generic2",
    restaurantId: "generic",
    userName: "Liam Thompson",
    userAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
    rating: 3.5,
    date: "2023-09-28",
    text: "Decent place for client lunches. The food is reliable and the atmosphere is professional. Service was a bit rushed but overall a good experience. The noise level is manageable for business conversations.",
    helpfulCount: 5,
  },
  {
    id: "generic3",
    restaurantId: "generic",
    userName: "Sophia Garcia",
    userAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
    rating: 5,
    date: "2023-11-05",
    text: "Perfect for impressing clients! We had a product launch dinner here and the ambiance really elevated our presentation. The chef's tasting menu was a hit and the sommelier's recommendations paired perfectly. Attentive service without being intrusive.",
    helpfulCount: 27,
    photos: ["https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000"],
  },
  {
    id: "generic4",
    restaurantId: "generic",
    userName: "Noah Kim",
    userAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 4.5,
    date: "2023-12-01",
    text: "Excellent business lunch spot. We had a team celebration here and the staff made it special. The private dining option gave us the space we needed for our discussions. Food quality was outstanding and everyone found something they enjoyed on the menu.",
    helpfulCount: 18,
  },
  {
    id: "generic5",
    restaurantId: "generic",
    userName: "Isabella Ahmed",
    userAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
    rating: 2.5,
    date: "2023-10-10",
    text: "Mixed experience for our business dinner. While the food was excellent, the service was inconsistent and we had a long wait between courses which made our meeting run longer than scheduled. The atmosphere is nice but a bit too noisy for serious discussions.",
    helpfulCount: 9,
  }
];

// Helper function to get at least 5 reviews for any restaurant
export const getReviews = (restaurantId: string): RestaurantReview[] => {
  return mockReviews
    .filter(review => review.restaurantId === "generic")
    .map(review => ({
      ...review,
      id: `${review.id}-${restaurantId}`,
      restaurantId
    })).sort(() => Math.random() - 0.5);
}; 