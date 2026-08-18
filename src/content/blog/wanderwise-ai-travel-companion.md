---
title: WanderWise AI — Building an Offline-First Mobile Travel App with React Native & Expo
date: 2026-06-10
description: How I built WanderWise AI — real-time itinerary generation, offline caching with AsyncStore, weather-adapted suggestions, and location sync in React Native.
tags: [mobile, react-native, expo, ai, typescript]
---

## The Traveler's Connectivity Dilemma

When traveling internationally or exploring remote mountain trails, cellular data is unreliable or non-existent. Yet most modern AI travel itinerary apps rely on constant active server requests. If you step into a tunnel or foreign city center without roaming data, the app freezes.

I built **WanderWise AI** as a React Native mobile app that uses OpenAI to generate hyper-personalized multi-day travel itineraries while persisting all generated schedules, maps, and offline tips locally.

```
       ┌────────────────────────┐
       │   React Native Expo    │
       └───────────┬────────────┘
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
[Online Mode]               [Offline Mode]
- Stream GPT-4 Itinerary    - Read AsyncStorage Cache
- Live OpenWeather Map      - SQLite Saved Places
- Instant Sync              - Local GeoJSON Maps
```

## Offline-First Storage Architecture with AsyncStorage

To guarantee zero latency when browsing previously created trip plans, WanderWise uses a custom offline persistence hook:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export type Itinerary = {
  id: string;
  destination: string;
  days: Array<{
    dayNumber: number;
    activities: string[];
  }>;
};

const STORAGE_KEY = '@wanderwise_trips';

export function useSavedTrips() {
  const [trips, setTrips] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedTrips();
  }, []);

  async function loadSavedTrips() {
    try {
      const jsonStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonStr) {
        setTrips(JSON.parse(jsonStr));
      }
    } catch (e) {
      console.error('Failed to load trips from offline storage', e);
    } finally {
      setLoading(false);
    }
  }

  async function saveTrip(newTrip: Itinerary) {
    try {
      const updated = [newTrip, ...trips.filter(t => t.id !== newTrip.id)];
      setTrips(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save trip', e);
    }
  }

  return { trips, saveTrip, loading };
}
```

## Weather-Adapted Prompt Engineering for AI Itineraries

When generating itineraries via OpenAI API endpoints, feeding raw weather forecasts prevents the system from suggesting outdoor hikes during heavy rainfall:

```ts
export async function generateItineraryPrompt(
  destination: string,
  days: number,
  forecast: { condition: string; tempC: number }
) {
  return `Generate a structured ${days}-day travel itinerary for ${destination}.
Current Weather Forecast: ${forecast.tempC}°C, ${forecast.condition}.

CRITICAL ADAPTATION RULES:
- If weather indicates rain/storm, replace outdoor activities with museums, indoor galleries, or covered markets.
- Format response strictly as JSON with array of days and activities.`;
}
```

## Mobile Engineering Takeaways

1. **Optimistic UI Updates**: Render cached trips immediately while fetching updated recommendations in the background.
2. **Smooth Expo Animations**: Using `react-native-reanimated` for collapsible daily accordion views keeps screen transitions locked at 60fps on mobile.
