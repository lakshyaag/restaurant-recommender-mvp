# Bain Restaurant Recommender - Frontend

This is the frontend for the Bain Restaurant Recommender application, built with [Next.js](https://nextjs.org). It provides a modern, responsive UI for searching and viewing restaurant recommendations for client meetings for partners at Bain & Company.

## Features

- **Advanced Search Functionality**: Search either by traditional search or client-focused search, built for partners to quickly narrow down options for client meetings.
- **Restaurant Details**: View comprehensive information about restaurants including menu, reviews, and a custom "business suitability" score derived from the reviews.
- **Responsive Design**: Works on desktop and mobile devices.

## Getting Started

### Prerequisites

- Node.js 18.x or later

### Environment Setup

Copy the example environment file and add your own API keys:

```bash
cp .env.example .env
```

Edit `.env` to add your backend API URL and Google Maps API key:

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### Installation

Install dependencies:

```bash
bun install
```

### Development

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Backend Integration

This frontend is designed to work with the Bain Restaurant Recommender backend API. Make sure the backend is running on the correct URL (default: `http://localhost:8000/api`).

## Search Features

The application supports two types of searches:

1. **Traditional Search**: This search allows users to find restaurants based on location, cuisine type, price range, and other filters. Users can sort results by best match, rating, review count, or distance.

2. **Client-Focused Search**: This search is tailored for client meetings, allowing users to specify client-specific details such as designation, length of relationship, specific cuisine preferences, to automatically create a search query using an LLM.

### Review Features

- **Customer Reviews**: Users can view customer reviews for each restaurant, including ratings, review text, and helpful counts. The application displays a summary of reviews and allows users to see detailed feedback from other customers.
- **Business Suitability Score**: The application uses an LLM to score each restaurant on parameters such as noise, privacy, formality, and meeting types, to give a business suitability score to each restaurant, allowing partners to quickly accept or reject a restaurant recommendation.

## Views

- **List View**: Shows detailed cards for each restaurant
- **Map View**: Displays restaurants on an interactive map with pop-up details (note: this functionality is partially implemented as a paid Google Maps API key is required to enable JavaScript functionality)

## Libraries used

- [Shadcn UI](https://ui.shadcn.com/) for pre-built components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Zustand](https://zustand.docs.pmnd.rs/) for state management
- [React Hook Form](https://react-hook-form.com/) for form handling and validation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)
- [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3)
