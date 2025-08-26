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
  readOnly?: boolean;
}

export function LocationPicker({ value, onChange, readOnly = false }: LocationPickerProps) {
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
    if (readOnly) return;
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
        className="h-[250px] w-full rounded-xl overflow-hidden border border-white/10"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
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
            draggable={!readOnly}
            eventHandlers={!readOnly ? {
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handlePositionChange(position);
              },
            } : {}}
          />}
          
          <MapClickHandler onPositionChange={handlePositionChange} />
        </MapContainer>
      </div>
      
      {!readOnly && (
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={getUserLocation}
            disabled={userLocationLoading}
            className="flex-1 py-2 px-3 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/20"
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
            className="flex-1 py-2 px-3 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/20"
          >
            <IconX size={14} />
            <span>Limpiar</span>
          </button>
        </div>
      )}
      
      {position && (
        <p className="text-neutral-400 text-xs text-center">
          Ubicación: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}