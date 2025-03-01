# Bain Restaurant Recommender - Frontend

This is the frontend for the Bain Restaurant Recommender application, built with [Next.js](https://nextjs.org). It provides a modern, responsive UI for searching and viewing restaurant recommendations for client meetings.

## Features

- **Advanced Search Functionality**: Search by location with filters for cuisine type, price range, distance, and more
- **Multiple View Options**: Toggle between list view and map view
- **Restaurant Details**: View comprehensive information about restaurants including ratings, pricing, categories, and contact details
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Google Maps API key (for map view functionality)

### Environment Setup

Copy the example environment file and add your own API keys:

"""bash
cp .env.local.example .env.local
"""

Edit `.env.local` to add your Google Maps API key:

"""
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
"""

### Installation

Install dependencies:

"""bash
npm install
# or
yarn install
# or
bun install
"""

### Development

Run the development server:

"""bash
npm run dev
# or
yarn dev
# or
bun dev
"""

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Backend Integration

This frontend is designed to work with the Bain Restaurant Recommender backend API. Make sure the backend is running on the correct URL (default: `http://localhost:8000/api`).

## Search Features

The search functionality supports:

- Basic location-based search
- Search term filtering (cuisine type, restaurant name, etc.)
- Price range filtering
- Category filtering
- Radius/distance filtering
- Open now filtering
- Sorting by best match, rating, review count, or distance

## Views

- **List View**: Shows detailed cards for each restaurant
- **Map View**: Displays restaurants on an interactive map with pop-up details

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)
- [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3)
