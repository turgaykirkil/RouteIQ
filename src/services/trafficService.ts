import axios from 'axios';

const TRAFFIC_API_URL = 'https://traffic.example.com/api';

export class TrafficService {
  private static instance: TrafficService;
  private api = axios.create({ baseURL: TRAFFIC_API_URL });

  private constructor() {}

  public static getInstance(): TrafficService {
    if (!TrafficService.instance) {
      TrafficService.instance = new TrafficService();
    }
    return TrafficService.instance;
  }

  async getTrafficConditions(lat: number, lon: number, radius: number = 5) {
    try {
      const response = await this.api.get('/conditions', {
        params: {
          latitude: lat,
          longitude: lon,
          radius
        }
      });

      return {
        congestionLevel: this.calculateCongestionLevel(response.data.averageSpeed),
        averageSpeed: response.data.averageSpeed,
        incidents: response.data.incidents.map(incident => ({
          type: incident.type,
          severity: incident.severity,
          description: incident.description,
          location: incident.location
        }))
      };
    } catch (error) {
      console.error('Trafik bilgisi alınamadı:', error);
      throw error;
    }
  }

  private calculateCongestionLevel(averageSpeed: number): string {
    if (averageSpeed < 20) return 'High';
    if (averageSpeed < 40) return 'Medium';
    return 'Low';
  }

  async getRouteTrafficInfo(coordinates: [number, number][]) {
    try {
      const response = await this.api.post('/route-traffic', {
        coordinates
      });

      return response.data.segments.map(segment => ({
        startPoint: segment.startPoint,
        endPoint: segment.endPoint,
        trafficFactor: segment.trafficFactor,
        estimatedDelay: segment.estimatedDelay
      }));
    } catch (error) {
      console.error('Rota trafik bilgisi alınamadı:', error);
      throw error;
    }
  }
}
