import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IconLoader2, IconMapPin, IconX } from "@tabler/icons-react";
import L from "leaflet";

// Component to handle map clicks
function MapClickHandler({ 
  onPositionChange 
}: { 
  onPositionChange: (latlng: L.LatLng) => void 
}) {
  useMapEvents({
    click: (e) => {
      onPositionChange(e.latlng);
    },
  });
  return null;
}

interface LocationPickerProps {
  value?: { longitude: number; latitude: number } | null;
  onChange: (location: { longitude: number; latitude: number } | null) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [userLocationLoading, setUserLocationLoading] = useState(false);
  const [position, setPosition] = useState<L.LatLng | null>(
    value ? L.latLng(value.latitude, value.longitude) : null
  );

  // Fix Leaflet's default icon issue on component mount
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // Handle marker position changes
  const handlePositionChange = (latlng: L.LatLng) => {
    setPosition(latlng);
    onChange({ longitude: latlng.lng, latitude: latlng.lat });
  };

  // Get user's current location
  const getUserLocation = () => {
    setUserLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const newLatLng = L.latLng(latitude, longitude);
          
          // Update marker position
          setPosition(newLatLng);
          onChange({ longitude, latitude });
          setUserLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocationLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setUserLocationLoading(false);
    }
  };

  // Clear the marker
  const clearLocation = () => {
    setPosition(null);
    onChange(null);
  };

  // Default center (Maracaibo, Venezuela)
  const defaultCenter = L.latLng(10.666206584865682, -71.62435770034791);

  return (
    <div className="space-y-3">
      <div 
        className="h-[250px] w-full rounded-xl overflow-hidden border"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <MapContainer
          center={position || defaultCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {position && <Marker 
            position={position} 
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handlePositionChange(position);
              },
            }}
          />}
          
          <MapClickHandler onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>
      
      <div className="flex gap-2">
        <button 
          type="button" 
          onClick={getUserLocation}
          disabled={userLocationLoading}
          className="flex-1 py-2 px-3 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            boxShadow: '0 4px 16px rgba(34, 197, 94, 0.1)'
          }}
        >
          {userLocationLoading ? (
            <IconLoader2 size={14} className="animate-spin" />
          ) : (
            <IconMapPin size={14} />
          )}
          <span>Mi ubicación</span>
        </button>
        
        <button 
          type="button" 
          onClick={clearLocation}
          disabled={!position}
          className="flex-1 py-2 px-3 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.1)'
          }}
        >
          <IconX size={14} />
          <span>Limpiar</span>
        </button>
      </div>
      
      {position && (
        <p className="text-slate-400 text-xs text-center">
          Ubicación: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}