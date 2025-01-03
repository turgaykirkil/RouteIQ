import axios from 'axios';
import * as turf from '@turf/turf';
import { Customer } from '../types/customer';
import { WeatherService } from './weatherService'; 
import { TrafficService } from './trafficService'; 
import { CacheService } from './cacheService'; 
import { Alert } from 'react-native';

// Güvenli ve yapılandırılabilir API URL'leri
const API_CONFIGS = {
  NOMINATIM: {
    URL: 'https://nominatim.openstreetmap.org',
    TIMEOUT: 10000,
    USER_AGENT: 'RouteIQ Mobile App/1.0'
  },
  OSRM: {
    URL: 'https://router.project-osrm.org',
    TIMEOUT: 15000
  },
  WEATHER: {
    URL: 'https://api.openweathermap.org/data/2.5/weather',
    TIMEOUT: 8000
  },
  TRAFFIC: {
    URL: 'https://traffic.api.example.com',
    TIMEOUT: 8000
  }
};

// Güvenli API instance oluşturma fonksiyonu
const createSafeApiInstance = (config) => {
  return axios.create({
    baseURL: config.URL,
    timeout: config.TIMEOUT,
    headers: {
      ...(config.USER_AGENT ? { 'User-Agent': config.USER_AGENT } : {}),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
};

const nominatimApi = createSafeApiInstance(API_CONFIGS.NOMINATIM);
const osrmApi = createSafeApiInstance(API_CONFIGS.OSRM);
const weatherApi = createSafeApiInstance(API_CONFIGS.WEATHER);
const trafficApi = createSafeApiInstance(API_CONFIGS.TRAFFIC);

export const routeService = {
  // Müşteri öncelik skoru hesaplama (Performans ve güvenlik optimizasyonu)
  calculateCustomerPriorityScore(customer: Customer): number {
    // Güvenli ve detaylı kontroller
    if (!customer) return 0;

    let priorityScore = 0;

    // Güvenli dize kontrolü
    const hasVIPNote = customer.notes?.toLowerCase().includes('vip') ?? false;
    if (hasVIPNote) {
      priorityScore += 50;
    }

    // Güvenli mesafe hesaplama
    const distance = customer.distance ?? 0;
    priorityScore += Math.max(0, 100 - distance * 2);

    // Tarih kontrolü
    const customerAge = customer.createdAt 
      ? new Date().getTime() - new Date(customer.createdAt).getTime() 
      : Infinity;
    const daysSinceCreation = customerAge / (1000 * 3600 * 24);
    
    if (daysSinceCreation < 30) {
      priorityScore += 30;
    }

    // Şirket anahtar kelime kontrolü
    const companyKeywords = ['tech', 'metal', 'sanayi', 'ticaret'];
    const hasCompanyKeyword = companyKeywords.some(keyword => 
      customer.company?.toLowerCase().includes(keyword) ?? false
    );
    
    if (hasCompanyKeyword) {
      priorityScore += 20;
    }

    // Güvenli skor sınırlandırması
    return Math.min(Math.max(priorityScore, 0), 200);
  },

  // Gelişmiş rota optimizasyonu
  async calculateOptimalRoute(customers: Customer[] = [], startPoint?: { lat: number; lng: number }) {
    // Detaylı giriş parametresi kontrolü
    if (!customers || !Array.isArray(customers) || customers.length === 0) {
      console.error('Geçersiz müşteri listesi');
      return this.createEmptyRouteResponse('Geçersiz müşteri listesi');
    }

    if (!startPoint || typeof startPoint.lat !== 'number' || typeof startPoint.lng !== 'number') {
      console.error('Geçersiz başlangıç noktası');
      return this.createEmptyRouteResponse('Geçersiz başlangıç noktası');
    }

    try {
      // Performans için paralel API çağrıları
      const [weatherConditions, trafficConditions] = await Promise.allSettled([
        this.getWeatherConditions(startPoint),
        this.getTrafficConditions(startPoint)
      ]).then(results => 
        results.map(result => 
          result.status === 'fulfilled' ? result.value : null
        )
      );

      // Müşterileri zenginleştir ve önceliklendir
      const enrichedCustomers = customers
        .map(customer => ({
          ...customer,
          priorityScore: this.calculateCustomerPriorityScore(customer),
          weatherPenalty: this.calculateWeatherPenalty(weatherConditions),
          trafficPenalty: this.calculateTrafficPenalty(trafficConditions)
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

      // Gelişmiş koordinat doğrulama
      const validCustomers = enrichedCustomers.filter(this.isValidCustomerCoordinate);

      if (validCustomers.length === 0) {
        console.error('Geçerli koordinatlı müşteri bulunamadı');
        return this.createEmptyRouteResponse('Geçerli koordinatlı müşteri bulunamadı');
      }

      // Koordinat dizisi oluşturma
      const coordinates: [number, number][] = [
        [startPoint.lng, startPoint.lat],
        ...validCustomers.map(c => [c.address.coordinates.lng, c.address.coordinates.lat])
      ];

      // Rota hesaplama
      const routeResponse = await this.calculateOSRMRoute(coordinates);

      // Detaylı optimizasyon bilgileri
      const optimizationDetails = {
        weatherConditions,
        trafficConditions,
        customerDetails: validCustomers.map(this.extractCustomerOptimizationDetails)
      };

      // Rota maliyeti hesaplama
      const routeCost = this.calculateRouteCost(
        routeResponse, 
        validCustomers, 
        weatherConditions, 
        trafficConditions
      );

      return {
        ...routeResponse,
        optimizationDetails,
        routeCost
      };

    } catch (error) {
      console.error('Rota hesaplama hatası:', error);
      return this.createEmptyRouteResponse('Rota hesaplama sırasında beklenmeyen hata');
    }
  },

  // Müşteri koordinat doğrulama
  isValidCustomerCoordinate(customer: Customer): boolean {
    const coords = customer?.address?.coordinates;
    return coords && 
           typeof coords.lat === 'number' && 
           typeof coords.lng === 'number' &&
           !isNaN(coords.lat) &&
           !isNaN(coords.lng) &&
           coords.lat !== 0 &&
           coords.lng !== 0;
  },

  // Müşteri optimizasyon detayları çıkarma
  extractCustomerOptimizationDetails(customer: Customer) {
    return {
      id: customer.id,
      name: customer.name,
      priorityScore: customer.priorityScore,
      weatherPenalty: customer.weatherPenalty,
      trafficPenalty: customer.trafficPenalty,
      coordinates: customer.address.coordinates
    };
  },

  // Boş rota yanıtı oluşturma
  createEmptyRouteResponse(errorMessage: string = 'Bilinmeyen hata') {
    return {
      coordinates: [],
      distance: 0,
      duration: 0,
      optimizationDetails: {},
      error: errorMessage
    };
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

  // Hava durumu ceza puanı hesaplama
  calculateWeatherPenalty(weatherConditions: any): number {
    if (!weatherConditions) return 0;

    let penalty = 0;

    // Sıcaklık bazlı ceza
    if (weatherConditions.temperature) {
      const temp = weatherConditions.temperature;
      if (temp < 0 || temp > 35) {
        penalty += 30; // Aşırı soğuk veya sıcak
      } else if (temp < 5 || temp > 30) {
        penalty += 15; // Orta derecede olumsuz
      }
    }

    // Yağış durumu
    if (weatherConditions.condition) {
      const condition = weatherConditions.condition.toLowerCase();
      const harshConditions = ['rain', 'snow', 'storm', 'thunderstorm'];
      if (harshConditions.some(c => condition.includes(c))) {
        penalty += 40; // Ağır hava koşulları
      }
    }

    // Rüzgar hızı
    if (weatherConditions.windSpeed) {
      const windSpeed = weatherConditions.windSpeed;
      if (windSpeed > 50) {
        penalty += 25; // Çok yüksek rüzgar
      } else if (windSpeed > 30) {
        penalty += 15; // Orta derecede yüksek rüzgar
      }
    }

    return Math.min(penalty, 100); // Maksimum %100 ceza
  },

  // Trafik ceza puanı hesaplama
  calculateTrafficPenalty(trafficConditions: any): number {
    if (!trafficConditions) return 0;

    let penalty = 0;

    // Trafik yoğunluğu
    if (trafficConditions.congestionLevel) {
      const congestion = trafficConditions.congestionLevel.toLowerCase();
      switch(congestion) {
        case 'high':
          penalty += 50; // Yüksek yoğunluk
          break;
        case 'medium':
          penalty += 25; // Orta yoğunluk
          break;
      }
    }

    // Ortalama hız
    if (trafficConditions.averageSpeed) {
      const avgSpeed = trafficConditions.averageSpeed;
      if (avgSpeed < 20) {
        penalty += 40; // Çok yavaş trafik
      } else if (avgSpeed < 40) {
        penalty += 20; // Orta derecede yavaş trafik
      }
    }

    // Trafik olayları
    if (trafficConditions.incidents && trafficConditions.incidents.length > 0) {
      penalty += Math.min(trafficConditions.incidents.length * 10, 30);
    }

    return Math.min(penalty, 100); // Maksimum %100 ceza
  },

  // Hava durumu skorunu hesaplama
  calculateWeatherScore(weatherConditions: any): number {
    if (!weatherConditions) return 0;

    let score = 0;

    // Sıcaklık değerlendirmesi
    if (weatherConditions.temperature) {
      const temp = weatherConditions.temperature;
      if (temp < 0 || temp > 35) {
        score += 40; // Aşırı soğuk veya sıcak
      } else if (temp < 5 || temp > 30) {
        score += 20; // Orta derecede olumsuz
      }
    }

    // Yağış ve hava durumu
    if (weatherConditions.condition) {
      const condition = weatherConditions.condition.toLowerCase();
      const harshConditions = ['rain', 'snow', 'storm', 'thunderstorm'];
      if (harshConditions.some(c => condition.includes(c))) {
        score += 30; // Olumsuz hava koşulları
      }
    }

    // Nem ve rüzgar faktörleri
    if (weatherConditions.humidity && weatherConditions.windSpeed) {
      const humidity = weatherConditions.humidity;
      const windSpeed = weatherConditions.windSpeed;

      if (humidity > 80 || windSpeed > 40) {
        score += 10; // Nem veya rüzgar fazla
      }
    }

    return Math.min(score, 100); // Maksimum %100 skor
  },

  // Trafik skorunu hesaplama
  calculateTrafficScore(trafficConditions: any): number {
    if (!trafficConditions) return 0;

    let score = 0;

    // Trafik yoğunluğu
    if (trafficConditions.congestionLevel) {
      const congestion = trafficConditions.congestionLevel.toLowerCase();
      switch(congestion) {
        case 'high':
          score += 50; // Yüksek yoğunluk
          break;
        case 'medium':
          score += 25; // Orta yoğunluk
          break;
      }
    }

    // Ortalama hız
    if (trafficConditions.averageSpeed) {
      const avgSpeed = trafficConditions.averageSpeed;
      if (avgSpeed < 20) {
        score += 30; // Çok yavaş trafik
      } else if (avgSpeed < 40) {
        score += 15; // Orta derecede yavaş trafik
      }
    }

    // Trafik olayları
    if (trafficConditions.incidents && trafficConditions.incidents.length > 0) {
      score += Math.min(trafficConditions.incidents.length * 5, 20);
    }

    return Math.min(score, 100); // Maksimum %100 skor
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
  },

  // Rota maliyet hesaplama fonksiyonu
  calculateRouteCost(
    routeResponse: { distance: number; duration: number }, 
    customers: Customer[], 
    weatherConditions: any, 
    trafficConditions: any
  ): number {
    // Temel rota maliyeti (mesafe ve süre)
    let baseCost = routeResponse.distance * 1 + routeResponse.duration * 0.1;

    // Hava durumu maliyet çarpanı
    const weatherPenalty = this.calculateWeatherScore(weatherConditions);
    baseCost *= (1 + weatherPenalty / 100);

    // Trafik maliyet çarpanı
    const trafficPenalty = this.calculateTrafficScore(trafficConditions);
    baseCost *= (1 + trafficPenalty / 100);

    // Müşteri öncelik düzeltmesi
    const customerPriorityAdjustment = customers.reduce((total, customer) => {
      const priorityScore = this.calculateCustomerPriorityScore(customer);
      return total + priorityScore;
    }, 0);

    // Müşteri önceliğine göre maliyeti düzelt
    baseCost /= (1 + customerPriorityAdjustment / 1000);

    return baseCost;
  },

  // En kısa rotayı hesapla
  calculateShortestRoute(customers: Customer[]) {
    // Eğer müşteri sayısı 1 veya daha azsa direkt olarak müşteriyi döndür
    if (customers.length <= 1) return customers;

    // Tüm müşterilerin koordinatlarını al
    const coordinates = customers.map(customer => ({
      id: customer.id,
      lat: customer.address.coordinates.lat,
      lng: customer.address.coordinates.lng
    }));

    // Öklid mesafesine göre en yakın müşterileri sırala
    const sortedCustomers = coordinates.sort((a, b) => {
      const distanceA = Math.sqrt(
        Math.pow(a.lat - coordinates[0].lat, 2) + 
        Math.pow(a.lng - coordinates[0].lng, 2)
      );
      const distanceB = Math.sqrt(
        Math.pow(b.lat - coordinates[0].lat, 2) + 
        Math.pow(b.lng - coordinates[0].lng, 2)
      );
      return distanceA - distanceB;
    });

    // Sıralanmış müşterileri orijinal müşteri listesinden bul
    return sortedCustomers.map(sortedCustomer => 
      customers.find(customer => customer.id === sortedCustomer.id)
    );
  },

  // Koordinatlar arası mesafe hesaplama (Haversine formülü)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // Konuma göre müşterileri sırala
  sortCustomersByDistance(customers: Customer[], currentLat: number, currentLng: number): Customer[] {
    return customers.sort((a, b) => {
      const distanceA = this.calculateDistance(
        currentLat, 
        currentLng, 
        a.address.coordinates.lat, 
        a.address.coordinates.lng
      );
      const distanceB = this.calculateDistance(
        currentLat, 
        currentLng, 
        b.address.coordinates.lat, 
        b.address.coordinates.lng
      );
      return distanceA - distanceB;
    });
  },

  // Rota optimizasyonu için yeni metod
  calculateOptimizedRoute(customers: Customer[]) {
    try {
      // Mevcut rota hesaplama mantığını buraya taşıyalım
      const weatherConditions = {
        temperature: 22,
        condition: 'Açık',
        humidity: 65,
        windSpeed: 10
      };

      const trafficConditions = {
        congestionLevel: 'Orta',
        averageSpeed: 40,
        incidents: []
      };

      // Müşterilere öncelik skoru hesaplama
      const customerDetails = customers.map((customer, index) => ({
        ...customer,
        priorityScore: Math.random() * 10, // Örnek öncelik skoru
        weatherPenalty: Math.random(), // Hava durumu etkisi
        trafficPenalty: Math.random(), // Trafik etkisi
        order: index + 1
      }));

      return {
        weatherConditions,
        trafficConditions,
        customerDetails,
        totalDistance: customers.length * 10, // Örnek mesafe
        estimatedTime: customers.length * 15 // Örnek süre
      };
    } catch (error) {
      console.error('Rota optimizasyonu hatası:', error);
      throw new Error('Rota hesaplanamadı');
    }
  },
};
