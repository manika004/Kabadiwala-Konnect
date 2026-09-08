import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapPickerProps {
  customerCoords: { lat: number; lng: number };
  collectorCoords?: { lat: number; lng: number };
  collectorName?: string;
  onLocationSelect?: (coords: { lat: number; lng: number; address: string }) => void;
  interactive?: boolean;
  height?: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  customerCoords,
  collectorCoords,
  collectorName,
  onLocationSelect,
  interactive = false,
  height = '320px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const collectorMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current).setView(
        [customerCoords.lat, customerCoords.lng], 
        14
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      if (interactive && onLocationSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (customerMarkerRef.current) {
            customerMarkerRef.current.setLatLng([lat, lng]);
          }
          onLocationSelect({
            lat: Math.round(lat * 10000) / 10000,
            lng: Math.round(lng * 10000) / 10000,
            address: `Selected Pin: Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}, Sector 14`
          });
        });
      }
    }

    const map = mapInstanceRef.current;

    // Customer Marker
    const customerIcon = L.divIcon({
      className: 'custom-customer-icon',
      html: `<div style="background-color:#059669; color:white; padding:6px 10px; border-radius:20px; font-weight:bold; font-size:11px; box-shadow:0 3px 6px rgba(0,0,0,0.3); display:flex; align-items:center; gap:4px; white-space:nowrap;">
              🏠 Household
             </div>`,
      iconSize: [80, 30],
      iconAnchor: [40, 15]
    });

    if (customerMarkerRef.current) {
      customerMarkerRef.current.setLatLng([customerCoords.lat, customerCoords.lng]);
    } else {
      customerMarkerRef.current = L.marker([customerCoords.lat, customerCoords.lng], { icon: customerIcon })
        .addTo(map)
        .bindPopup('<b>Household Pickup Point</b>');
    }

    // Collector Marker
    if (collectorCoords) {
      const collectorIcon = L.divIcon({
        className: 'custom-collector-icon',
        html: `<div style="background-color:#2563eb; color:white; padding:6px 10px; border-radius:20px; font-weight:bold; font-size:11px; box-shadow:0 3px 6px rgba(0,0,0,0.3); display:flex; align-items:center; gap:4px; white-space:nowrap;">
                🚚 ${collectorName || 'Kabadiwala'}
               </div>`,
        iconSize: [110, 30],
        iconAnchor: [55, 15]
      });

      if (collectorMarkerRef.current) {
        collectorMarkerRef.current.setLatLng([collectorCoords.lat, collectorCoords.lng]);
      } else {
        collectorMarkerRef.current = L.marker([collectorCoords.lat, collectorCoords.lng], { icon: collectorIcon })
          .addTo(map)
          .bindPopup(`<b>Collector: ${collectorName || 'Kabadiwala'}</b>`);
      }

      // Connecting route polyline
      const latlngs: [number, number][] = [
        [collectorCoords.lat, collectorCoords.lng],
        [customerCoords.lat, customerCoords.lng]
      ];

      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latlngs);
      } else {
        polylineRef.current = L.polyline(latlngs, {
          color: '#10b981',
          dashArray: '8, 8',
          weight: 4,
          opacity: 0.8
        }).addTo(map);
      }

      const bounds = L.latLngBounds([
        [customerCoords.lat, customerCoords.lng],
        [collectorCoords.lat, collectorCoords.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([customerCoords.lat, customerCoords.lng], 14);
    }

    return () => {
      // cleanup on unmount
    };
  }, [customerCoords, collectorCoords, interactive]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {interactive && (
        <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 shadow-md border border-slate-200">
          📍 Click anywhere on map to set pickup location
        </div>
      )}
    </div>
  );
};