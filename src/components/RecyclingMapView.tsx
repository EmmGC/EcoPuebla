import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RecyclingMapView.css';
import { RecyclingCenter } from '../data/centersData';

// Puebla capital, usado como centro inicial antes de encuadrar los pines reales
const PUEBLA_CENTER: [number, number] = [19.0414, -98.2063];

interface UserPosition {
  lat: number;
  lng: number;
}

interface RecyclingMapViewProps {
  centers: RecyclingCenter[];
  selectedCenter: RecyclingCenter | null;
  onSelectCenter: (center: RecyclingCenter) => void;
  userPosition: UserPosition | null;
  activeTab: 'mapa' | 'lista';
}

function makePinIcon(emoji: string, active: boolean): L.DivIcon {
  return L.divIcon({
    className: 'leaflet-pin-icon-wrapper',
    html: `<div class="leaflet-pin-bubble${active ? ' active' : ''}"><span>${emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });
}

const userIcon = L.divIcon({
  className: 'leaflet-pin-icon-wrapper',
  html: '<div class="leaflet-user-marker"><div class="leaflet-user-pulse"></div><div class="leaflet-user-dot"></div></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Encuadra el mapa una sola vez al montar, y sigue al centro seleccionado o al usuario después
function MapController({ centers, selectedCenter, userPosition, activeTab }: {
  centers: RecyclingCenter[];
  selectedCenter: RecyclingCenter | null;
  userPosition: UserPosition | null;
  activeTab: 'mapa' | 'lista';
}) {
  const map = useMap();
  const didInitialFit = useRef(false);

  useEffect(() => {
    if (didInitialFit.current) return;
    const withCoords = centers.filter((c) => c.lat != null && c.lng != null);
    if (withCoords.length > 0) {
      const bounds = L.latLngBounds(withCoords.map((c) => [c.lat as number, c.lng as number]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
      didInitialFit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCenter?.lat != null && selectedCenter?.lng != null) {
      map.flyTo([selectedCenter.lat, selectedCenter.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
    }
  }, [selectedCenter, map]);

  useEffect(() => {
    if (userPosition) {
      map.flyTo([userPosition.lat, userPosition.lng], Math.max(map.getZoom(), 14), { duration: 0.8 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPosition]);

  // Leaflet calcula su tamaño al montar; en móvil la pestaña de mapa puede estar
  // oculta (display:none) al inicio, así que hay que forzar el recálculo al mostrarse.
  useEffect(() => {
    if (activeTab === 'mapa') {
      const id = setTimeout(() => map.invalidateSize(), 60);
      return () => clearTimeout(id);
    }
  }, [activeTab, map]);

  return null;
}

const RecyclingMapView: React.FC<RecyclingMapViewProps> = ({ centers, selectedCenter, onSelectCenter, userPosition, activeTab }) => {
  const pinnedCenters = useMemo(() => centers.filter((c) => c.lat != null && c.lng != null), [centers]);

  return (
    <MapContainer center={PUEBLA_CENTER} zoom={12} className="leaflet-map-root" zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      {pinnedCenters.map((center) => (
        <Marker
          key={center.id}
          position={[center.lat as number, center.lng as number]}
          icon={makePinIcon(center.icon, selectedCenter?.id === center.id)}
          eventHandlers={{ click: () => onSelectCenter(center) }}
        />
      ))}

      {userPosition && <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} />}

      <MapController centers={centers} selectedCenter={selectedCenter} userPosition={userPosition} activeTab={activeTab} />
    </MapContainer>
  );
};

export default RecyclingMapView;
