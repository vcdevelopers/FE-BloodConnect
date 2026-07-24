import { useState, useEffect } from 'react';

interface GoogleAddressTextProps {
  query: string;
  fallback: string;
  className?: string;
}

export function GoogleAddressText({ query, fallback, className }: GoogleAddressTextProps) {
  const [address, setAddress] = useState<string>(fallback);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) return;
        
        // Use Geocoding API to extract exact location formatted address
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`);
        const data = await res.json();
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const result = data.results[0];
          
          // Google Geocoding API sometimes returns a generic city or postal code 
          // if it can't find the exact hospital/business. 
          // We reject generic results and stick to the fallback (which contains the hospital name).
          const genericTypes = ['postal_code', 'locality', 'administrative_area_level_1', 'administrative_area_level_2', 'country', 'neighborhood', 'sublocality'];
          const isGeneric = result.types.some((t: string) => genericTypes.includes(t)) && !result.types.includes('establishment');
          
          if (!isGeneric) {
            setAddress(result.formatted_address);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exact address from Google Maps API:', err);
      }
    };

    fetchAddress();
  }, [query]);

  return (
    <span className={className}>
      {address}
    </span>
  );
}
