---
title: Building a Commercial Truck Dispatcher & FMCSA HOS Compliance Engine
date: 2026-06-25
description: Inside Dispatcher HOS — route optimization algorithms, Mapbox integration, and Django-based FMCSA Electronic Logging Device (ELD) rule calculations.
tags: [fullstack, django, python, react, GIS]
---

## Commercial Logistics & FMCSA Regulatory Demands

In interstate trucking, driver safety and route dispatching are governed by strict Federal Motor Carrier Safety Administration (FMCSA) regulations. Drivers are restricted to:
- Maximum **11 hours** driving after 10 consecutive hours off duty.
- Maximum **14-hour** overall duty window per day.
- Mandatory **30-minute break** after 8 hours of cumulative driving.

If a truck dispatcher assigns a load that forces a driver over their legal limit, heavy fines and safety violations occur. 

I built **Dispatcher HOS & ELD** to integrate real-time route optimization with automated FMCSA Hours of Service (HOS) validation.

```
Dispatcher Load Assignment
          │
          ▼
┌─────────────────────────┐
│ Mapbox Distance Matrix  │ ──► Total Miles & Driving Time
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ FMCSA HOS Compliance    │ ──► Calculates Required Rest Stops
│ Engine (Django REST)    │     & Driving Violation Risk
└─────────────────────────┘
```

## Rule Engine for FMCSA Hours of Service

In the Django REST backend, I built a state machine validator that processes raw ELD duty status logs (`OFF_DUTY`, `SLEEPER_BERTH`, `DRIVING`, `ON_DUTY_NOT_DRIVING`):

```python
from datetime import datetime, timedelta
from typing import List, Dict

class HOSStatus:
    OFF_DUTY = "OFF"
    SLEEPER = "SB"
    DRIVING = "D"
    ON_DUTY = "ON"

class HOSComplianceEngine:
    MAX_DRIVING_HOURS = 11.0
    MAX_DUTY_WINDOW = 14.0
    BREAK_THRESHOLD_HOURS = 8.0

    @classmethod
    def validate_driver_logs(cls, logs: List[Dict]) -> Dict:
        # Sort logs chronologically
        sorted_logs = sorted(logs, key=lambda x: x['timestamp'])
        
        driving_seconds = 0
        duty_window_start = None
        consecutive_off_seconds = 0
        violations = []

        for entry in sorted_logs:
            status = entry['status']
            duration = entry['duration_seconds']

            if status in [HOSStatus.OFF_DUTY, HOSStatus.SLEEPER]:
                consecutive_off_seconds += duration
                if consecutive_off_seconds >= 36000: # 10 hours off duty reset
                    driving_seconds = 0
                    duty_window_start = None
            else:
                consecutive_off_seconds = 0
                if duty_window_start is None:
                    duty_window_start = entry['timestamp']

                if status == HOSStatus.DRIVING:
                    driving_seconds += duration

                # Check 11-hour driving rule violation
                if (driving_seconds / 3600.0) > cls.MAX_DRIVING_HOURS:
                    violations.append({
                        "type": "11_HOUR_DRIVING_EXCEEDED",
                        "timestamp": entry['timestamp'],
                        "message": f"Exceeded 11 hours maximum driving limit."
                    })

        return {
            "is_compliant": len(violations) == 0,
            "driving_hours_today": round(driving_seconds / 3600.0, 2),
            "violations": violations
        }
```

## Mapbox Matrix Route Optimization in React

On the frontend, dispatchers plan multi-stop loads. Using Mapbox GL JS and the Matrix API, the interface projects optimized transit times onto an interactive map:

```tsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!;

export function RouteMap({ stops }: { stops: Array<[number, number]> }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || stops.length === 0) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: stops[0],
      zoom: 6
    });

    map.current.on('load', () => {
      // Plot waypoints and route polyline
      stops.forEach((coord, i) => {
        new mapboxgl.Marker({ color: i === 0 ? '#4ade80' : '#ef4444' })
          .setLngLat(coord)
          .addTo(map.current!);
      });
    });

    return () => map.current?.remove();
  }, [stops]);

  return <div ref={mapContainer} className="w-full h-96 rounded-lg" />;
}
```

## Logistics Tech Insights

- **State Machine Accuracy**: FMCSA compliance cannot rely on simple hourly sums — time tracking must account for reset breaks and duty windows.
- **Visual Clarity**: Displaying compliance status directly over Mapbox trip legs prevents dispatch errors before drivers hit the road.
