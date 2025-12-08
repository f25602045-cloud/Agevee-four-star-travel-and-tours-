import React, { useEffect, useRef } from 'react';
import { District, Listing } from '../types';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    L: any;
  }
}

interface InteractiveMapProps {
  districts?: District[];
  listings?: Listing[];
  selectedDistrictId?: string | null;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  districts = [], 
  listings = [], 
  selectedDistrictId = null,
  className = "" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    if (!mapInstance.current) {
      // Initialize map
      mapInstance.current = window.L.map(mapRef.current, {
        center: [35.9208, 74.3089], // Default Gilgit center
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: false, // Prevent accidental zooming
        attributionControl: false
      });

      // Add Dark Theme Tiles (CartoDB Dark Matter)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const L = window.L;

    // Custom Icon Generators
    const createIcon = (color: string, iconHtml: string) => {
      return L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); color: black;">${iconHtml}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
    };

    const districtIcon = createIcon('#d4af37', '<span style="font-weight:bold; font-size: 10px;">★</span>');
    const hotelIcon = createIcon('#f59e0b', '<span style="font-size: 10px;">H</span>');
    const guideIcon = createIcon('#3b82f6', '<span style="font-size: 10px;">G</span>');
    const agencyIcon = createIcon('#10b981', '<span style="font-size: 10px;">A</span>');

    if (selectedDistrictId) {
      // DETAIL MODE: Show Listings within the selected district
      const selectedDistrict = districts.find(d => d.id === selectedDistrictId);
      
      if (selectedDistrict) {
        // Center on district
        mapInstance.current.setView([selectedDistrict.coordinates.lat, selectedDistrict.coordinates.lng], 10);

        // Add listing markers
        listings.forEach(listing => {
          if (listing.districtId === selectedDistrictId && listing.coordinates) {
             let icon = hotelIcon;
             if (listing.type === 'GUIDE') icon = guideIcon;
             if (listing.type === 'AGENCY') icon = agencyIcon;

             const marker = L.marker([listing.coordinates.lat, listing.coordinates.lng], { icon })
              .addTo(mapInstance.current)
              .bindPopup(`
                <div style="text-align: center;">
                  <strong style="display:block; margin-bottom:4px; font-family:serif;">${listing.name}</strong>
                  <span style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#d4af37;">${listing.type}</span>
                </div>
              `);
             markersRef.current.push(marker);
          }
        });
      }

    } else {
      // OVERVIEW MODE: Show all districts
      mapInstance.current.setView([35.8, 75.0], 7); // View of whole GB

      districts.forEach(district => {
        const marker = L.marker([district.coordinates.lat, district.coordinates.lng], { icon: districtIcon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="text-align: center;">
              <strong style="display:block; margin-bottom:4px; font-family:serif;">${district.name}</strong>
              <button onclick="window.location.hash = '/explore?id=${district.id}'" style="background:#d4af37; color:#0a0f1c; border:none; padding:4px 8px; border-radius:2px; font-size:10px; font-weight:bold; cursor:pointer; margin-top:4px;">EXPLORE</button>
            </div>
          `);
        
        // Add click event to navigate
        marker.on('click', () => {
           // We use the popup button for navigation to be safe with React router, 
           // but we can also trigger navigate here if we pass a callback.
           // Since navigate is a hook, we can't easily pass it into the leaflet event context effectively without closure issues sometimes.
           // But here it works fine in the effect closure.
           navigate(`/explore?id=${district.id}`);
        });

        markersRef.current.push(marker);
      });
    }

  }, [selectedDistrictId, districts, listings, navigate]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full z-0" style={{ background: '#162032' }}></div>
      <div className="absolute top-2 right-2 z-[400] bg-brand-dark/80 backdrop-blur-sm p-2 rounded border border-white/10 text-xs text-gray-400">
         <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-brand-primary"></span> District</div>
         <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Hotel</div>
         <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Guide</div>
         <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Agency</div>
      </div>
    </div>
  );
};