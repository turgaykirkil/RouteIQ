import axios from 'axios';
import * as turf from '@turf/turf';
import { Customer } from '../types/customer';

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';
const OSRM_API_URL = 'https://router.project-osrm.org';

// Nominatim API için axios instance
const nominatimApi = axios.create({
  baseURL: NOMINATIM_API_URL,
  headers: {
    'User-Agent': 'RouteIQ Mobile App', // Nominatim politikası gereği User-Agent gerekli
  }
});

// OSRM API için axios instance
const osrmApi = axios.create({
  baseURL: OSRM_API_URL,
});

export const routeService = {
  // Adres arama
  async searchAddress(query: string) {
    try {
      const response = await nominatimApi.get('/search', {
        params: {
          q: query,
          format: 'json',
          limit: 5,
          addressdetails: 1
        }
      });
      return response.data;
    } catch (error) {
      console.error('Address search error:', error);
      throw error;
    }
  },

  // En kısa rotayı hesapla
  async calculateOptimalRoute(customers: Customer[], startPoint: { lat: number; lng: number }) {
    try {
      // Koordinatları OSRM formatına dönüştür
      const coordinates = [
        `${startPoint.lng},${startPoint.lat}`,
        ...customers.map(customer => 
          `${customer.address.coordinates.lng},${customer.address.coordinates.lat}`
        )
      ].join(';');

      // OSRM'den rota al
      const response = await osrmApi.get(
        `/route/v1/driving/${coordinates}?overview=full&alternatives=false&steps=true`
      );

      if (response.data.code !== 'Ok') {
        throw new Error('Route calculation failed');
      }

      // Rotayı decode et
      const route = response.data.routes[0];
      const decodedRoute = this.decodePolyline(route.geometry);

      // Adım adım yönergeleri hazırla
      const steps = route.legs.flatMap(leg => leg.steps.map(step => ({
        instruction: step.maneuver.instruction,
        distance: step.distance,
        duration: step.duration,
        coordinates: this.decodePolyline(step.geometry)
      })));

      return {
        distance: route.distance / 1000, // km cinsinden
        duration: route.duration / 60, // dakika cinsinden
        coordinates: decodedRoute,
        steps,
      };
    } catch (error) {
      console.error('Route calculation error:', error);
      throw error;
    }
  },

  // Polyline'ı decode et
  decodePolyline(encoded: string) {
    const points: [number, number][] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let shift = 0;
      let result = 0;

      do {
        const b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        const b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push([lat * 1e-5, lng * 1e-5]);
    }

    return points;
  },

  // İki nokta arası mesafeyi hesapla
  calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) {
    const from = turf.point([point1.lng, point1.lat]);
    const to = turf.point([point2.lng, point2.lat]);
    const options = { units: 'kilometers' as const };
    
    return turf.distance(from, to, options);
  },

  // Toplam rota mesafesini hesapla
  calculateTotalDistance(coordinates: [number, number][]) {
    let totalDistance = 0;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const point1 = { lat: coordinates[i][0], lng: coordinates[i][1] };
      const point2 = { lat: coordinates[i + 1][0], lng: coordinates[i + 1][1] };
      totalDistance += this.calculateDistance(point1, point2);
    }
    
    return totalDistance;
  },

  // Rotayı optimize et (TSP algoritması)
  optimizeRoute(points: { lat: number; lng: number }[]) {
    // Başlangıç noktasını al (ilk nokta)
    const start = points[0];
    const destinations = points.slice(1);
    
    // En yakın komşu algoritması
    const route = [start];
    let current = start;
    let remaining = [...destinations];
    
    while (remaining.length > 0) {
      // En yakın noktayı bul
      let minDistance = Infinity;
      let nextPoint = null;
      let nextIndex = -1;
      
      remaining.forEach((point, index) => {
        const distance = this.calculateDistance(current, point);
        if (distance < minDistance) {
          minDistance = distance;
          nextPoint = point;
          nextIndex = index;
        }
      });
      
      if (nextPoint) {
        route.push(nextPoint);
        current = nextPoint;
        remaining.splice(nextIndex, 1);
      }
    }
    
    // Başlangıç noktasına dön
    route.push(start);
    
    return route;
  }
};
