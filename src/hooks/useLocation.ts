import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';

export type Location = {
  lat: number;
  lon: number;
};

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLoading(false);
          setError(null);
        },
        error => {
          setError(error.message);
          setLoading(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
        }
      );
    };

    getCurrentLocation();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const refreshLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLoading(false);
        setError(null);
      },
      error => {
        setError(error.message);
        setLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  };

  return {
    location,
    error,
    loading,
    refreshLocation
  };
};
