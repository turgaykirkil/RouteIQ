import axios from 'axios';
import * as turf from '@turf/turf';
import { Customer } from '../types/customer';
import { WeatherService } from './weatherService'; 
import { TrafficService } from './trafficService'; 
import { CacheService } from './cacheService'; 
import { Alert } from 'react-native';

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';
const OSRM_API_URL = 'https://router.project-osrm.org';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const TRAFFIC_API_URL = 'https://traffic.api.example.com';

const nominatimApi = axios.create({
  baseURL: NOMINATIM_API_URL,
  headers: {
    'User-Agent': 'RouteIQ Mobile App',
  }
});

const osrmApi = axios.create({
  baseURL: OSRM_API_URL,
});

const weatherApi = axios.create({
  baseURL: WEATHER_API_URL,
});

const trafficApi = axios.create({
  baseURL: TRAFFIC_API_URL,
});

export const routeService = {
  // Müşteri öncelik skoru hesaplama
  calculateCustomerPriorityScore(customer: Customer): number {
    const salesScore = customer.totalSales * 0.4;
    const daysSinceLastVisit = (new Date().getTime() - new Date(customer.lastVisitDate).getTime()) / (1000 * 3600 * 24);
    const visitScore = Math.max(10 - daysSinceLastVisit, 0) * 0.3;
    const potentialSalesScore = customer.potentialSales * 0.3;
    
    return salesScore + visitScore + potentialSalesScore;
  },

  // Gelişmiş rota optimizasyonu
  async calculateOptimalRoute(customers: Customer[] = [], startPoint: { lat: number; lng: number }) {
    // Giriş parametrelerinin detaylı kontrolü
    if (!customers) {
      console.error('Müşteri listesi null');
      return {
        coordinates: [],
        distance: 0,
        duration: 0
      };
    }

    if (!Array.isArray(customers)) {
      console.error('Müşteri listesi dizi değil:', typeof customers);
      return {
        coordinates: [],
        distance: 0,
        duration: 0
      };
    }

    if (customers.length === 0) {
      console.error('Müşteri listesi boş');
      return {
        coordinates: [],
        distance: 0,
        duration: 0
      };
    }

    if (!startPoint || typeof startPoint.lat !== 'number' || typeof startPoint.lng !== 'number') {
      console.error('Geçersiz başlangıç noktası:', startPoint);
      return {
        coordinates: [],
        distance: 0,
        duration: 0
      };
    }

    try {
      // Müşteri koordinatlarını detaylı olarak kontrol et
      const validCustomers = customers.filter(customer => {
        // Müşteri nesnesinin varlığını kontrol et
        if (!customer) {
          console.error('Geçersiz müşteri nesnesi');
          return false;
        }

        // Adres ve koordinatların varlığını kontrol et
        const coords = customer?.address?.coordinates;
        if (!coords) {
          console.error('Müşteri koordinatları eksik:', customer);
          return false;
        }

        // Koordinat tiplerini kontrol et
        if (typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
          console.error('Geçersiz koordinat tipi:', coords);
          return false;
        }

        return true;
      });

      // Geçerli müşteri kontrolü
      if (validCustomers.length === 0) {
        console.error('Geçerli koordinatlı müşteri bulunamadı');
        return {
          coordinates: [],
          distance: 0,
          duration: 0
        };
      }

      // OSRM için koordinat dizisi oluştur
      const coordinates: [number, number][] = [
        [startPoint.lng, startPoint.lat],
        ...validCustomers.map(c => [c.address.coordinates.lng, c.address.coordinates.lat])
      ];

      // OSRM rotası hesaplama
      const response = await this.calculateOSRMRoute(coordinates);
      
      // Eğer response null ise boş bir rota döndür
      if (!response) {
        return {
          coordinates: [],
          distance: 0,
          duration: 0
        };
      }

      return response;

    } catch (error) {
      console.error('Rota hesaplama sırasında hata:', error);
      return {
        coordinates: [],
        distance: 0,
        duration: 0
      };
    }
  },

  // OSRM rotası hesaplama
  async calculateOSRMRoute(coordinates: [number, number][]) {
    try {
      const coordinatesString = coordinates.map(c => c.join(',')).join(';');
      const response = await osrmApi.get(`/route/v1/driving/${coordinatesString}`);
      const routes = response.data?.routes;

      if (!routes || routes.length === 0) {
        console.error('OSRM rotası bulunamadı');
        return {
          coordinates: coordinates,
          distance: 0,
          duration: 0
        };
      }

      const optimalRoute = routes[0];
      const decodedCoordinates = this.decodePolyline(optimalRoute.geometry);

      return {
        coordinates: decodedCoordinates,
        distance: optimalRoute.distance / 1000, // metreyi kilometreye çevir
        duration: optimalRoute.duration / 60 // saniyeyi dakikaya çevir
      };
    } catch (error) {
      console.error('OSRM rotası hesaplama hatası:', error);
      return {
        coordinates: coordinates,
        distance: 0,
        duration: 0
      };
    }
  },

  // Hava durumu bilgisi alma
  async getWeatherConditions(location: { lat: number; lng: number }) {
    try {
      const response = await weatherApi.get('', {
        params: {
          lat: location.lat,
          lon: location.lng,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });
      
      // Detaylı hata kontrolü
      if (!response.data || !response.data.main || !response.data.weather) {
        throw new Error('Geçersiz hava durumu verisi');
      }

      return {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        windSpeed: response.data.wind.speed,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        cloudiness: response.data.clouds?.all || 0
      };
    } catch (error) {
      console.error('Hava durumu hatası:', error.response?.data || error.message);
      
      // Detaylı hata bilgisi
      if (error.response) {
        console.error('API Yanıt Hatası:', error.response.data);
        console.error('API Durum Kodu:', error.response.status);
      } else if (error.request) {
        console.error('Yanıt Alınamadı');
      }

      return {
        temperature: 20,
        feelsLike: 20,
        condition: 'Clear',
        description: 'Açık',
        windSpeed: 5,
        humidity: 50,
        pressure: 1013,
        cloudiness: 0
      };
    }
  },

  // Trafik bilgisi alma
  async getTrafficConditions(location: { lat: number; lng: number }) {
    try {
      // Mock trafik bilgisi
      return {
        congestionLevel: 'Low',
        averageSpeed: 60,
        incidents: []
      };
    } catch (error) {
      console.error('Trafik bilgisi hatası:', error);
      return {
        congestionLevel: 'Low',
        averageSpeed: 60,
        incidents: []
      };
    }
  },

  // Optimal rotayı seçme
  selectOptimalRoute(routes, weatherConditions, trafficConditions) {
    return routes.map(route => {
      const weatherPenalty = this.calculateWeatherPenalty(weatherConditions);
      const trafficPenalty = this.calculateTrafficPenalty(trafficConditions);
      
      return {
        ...route,
        adjustedDuration: route.duration * (1 + weatherPenalty + trafficPenalty)
      };
    }).sort((a, b) => a.adjustedDuration - b.adjustedDuration)[0];
  },

  // Hava durumuna göre rota cezası
  calculateWeatherPenalty(weatherConditions) {
    if (!weatherConditions) return 0;
    
    switch (weatherConditions.condition) {
      case 'Rain': return 0.2;
      case 'Snow': return 0.3;
      case 'Thunderstorm': return 0.4;
      default: return 0;
    }
  },

  // Trafik durumuna göre rota cezası
  calculateTrafficPenalty(trafficConditions) {
    if (!trafficConditions) return 0;
    
    switch (trafficConditions.congestionLevel) {
      case 'High': return 0.3;
      case 'Medium': return 0.15;
      case 'Low': return 0;
      default: return 0;
    }
  },

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
  },

  handleApiError(error: any, defaultMessage: string) {
    console.error(defaultMessage, error);
    
    // Kullanıcıya bildirim
    Alert.alert(
      'Bağlantı Hatası', 
      'Şu anda bazı hizmetler kullanılamıyor. Lütfen daha sonra tekrar deneyin.'
    );

    // Varsayılan/güvenli bir değer döndür
    return null;
  },

  fallbackRouteCalculation(customers: Customer[], startPoint: { lat: number; lng: number }) {
    // Basit bir rota hesaplama mekanizması
    const prioritizedCustomers = customers
      .map(customer => ({
        ...customer,
        priorityScore: this.calculateCustomerPriorityScore(customer)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);

    return {
      route: {
        distance: this.calculateSimpleDistance(startPoint, prioritizedCustomers[0].address.coordinates),
        duration: 30, // Varsayılan 30 dakika
        coordinates: [
          [startPoint.lng, startPoint.lat],
          [prioritizedCustomers[0].address.coordinates.lng, prioritizedCustomers[0].address.coordinates.lat]
        ]
      },
      customers: prioritizedCustomers,
      weatherConditions: null,
      trafficConditions: null
    };
  },

  calculateSimpleDistance(point1, point2) {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  },

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
};

function calculateWeatherScore(weatherConditions: {
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  windSpeed: number;
  humidity: number;
  pressure: number;
  cloudiness: number;
}): number {
  // Hava durumu skorlama algoritması
  let score = 100;

  // Sıcaklık etkisi (-20 ile +20 arasında)
  const tempDiff = Math.abs(weatherConditions.temperature - 20);
  score -= tempDiff;

  // Rüzgar hızı etkisi
  if (weatherConditions.windSpeed > 10) {
    score -= (weatherConditions.windSpeed - 10) * 2;
  }

  // Bulutluluk etkisi
  score -= weatherConditions.cloudiness / 2;

  // Nem etkisi
  if (weatherConditions.humidity > 70) {
    score -= (weatherConditions.humidity - 70) / 2;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateTrafficScore(trafficConditions: {
  congestionLevel: string;
  averageSpeed: number;
  incidents: any[];
}): number {
  // Trafik skorlama algoritması
  let score = 100;

  // Trafik yoğunluğu etkisi
  switch (trafficConditions.congestionLevel) {
    case 'High': score -= 30; break;
    case 'Medium': score -= 15; break;
    case 'Low': score -= 0; break;
    default: score -= 0; break;
  }

  // Ortalama hız etkisi
  if (trafficConditions.averageSpeed < 40) {
    score -= (40 - trafficConditions.averageSpeed) * 2;
  }

  // Olay etkisi
  score -= trafficConditions.incidents.length * 5;

  return Math.max(0, Math.min(100, score));
}
