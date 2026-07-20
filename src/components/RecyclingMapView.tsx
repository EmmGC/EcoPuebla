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

// Zoom/pan seguro. Se probó con map.flyTo() (la animación "curva" de Leaflet)
// pero su matemática interna a veces produce NaN y truena en pleno vuelo
// (bug conocido de Leaflet, ver https://github.com/Leaflet/Leaflet/issues/3871
// y similares) — eso tumbaba toda la app antes de tener MapErrorBoundary.
// setView usa la animación de pan/zoom estándar (mismo resultado visual,
// sin la curva "voladora"), que no tiene ese problema. El try/catch se deja
// como red de seguridad adicional.
function safeFlyTo(map: L.Map, latlng: [number, number], minZoom: number) {
  try {
    const currentZoom = map.getZoom();
    const zoom = Number.isFinite(currentZoom) ? Math.max(currentZoom, minZoom) : minZoom;
    map.stop();
    map.setView(latlng, zoom, { animate: true });
  } catch (err) {
    console.error('No se pudo mover el mapa:', err);
  }
}

// Encuadra el mapa una sola vez al montar, y sigue al centro seleccionado o al usuario después
function MapController({ centers, selectedCenter, userPosition }: {
  centers: RecyclingCenter[];
  selectedCenter: RecyclingCenter | null;
  userPosition: UserPosition | null;
}) {
  const map = useMap();
  const didInitialFit = useRef(false);

  // Un solo ResizeObserver cubre todo: mantiene a Leaflet al tanto del
  // tamaño real del contenedor (cambios de pestaña móvil, orientación,
  // fuentes que cargan tarde y desplazan el layout, etc.) y, la primera vez
  // que el contenedor mide algo distinto de cero, hace el encuadre inicial.
  // Antes esto era un fitBounds animado disparado al montar sin esperar a
  // que el layout se asentara: a veces corría con un tamaño de contenedor
  // aún incorrecto y calculaba un zoom equivocado (la mayoría de los pines
  // quedaban fuera de la vista), y si el usuario seleccionaba un centro
  // mientras esa animación seguía viva, el flyTo chocaba con ella.
  useEffect(() => {
    const container = map.getContainer();
    const ro = new ResizeObserver((entries) => {
      map.invalidateSize();
      if (didInitialFit.current) return;
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;
      const withCoords = centers.filter((c) => c.lat != null && c.lng != null);
      if (withCoords.length > 0) {
        try {
          const bounds = L.latLngBounds(withCoords.map((c) => [c.lat as number, c.lng as number]));
          map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14, animate: false });
        } catch (err) {
          console.error('No se pudo encuadrar el mapa:', err);
        }
      }
      didInitialFit.current = true;
    });
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (selectedCenter?.lat != null && selectedCenter?.lng != null) {
      safeFlyTo(map, [selectedCenter.lat, selectedCenter.lng], 15);
    }
  }, [selectedCenter, map]);

  useEffect(() => {
    if (userPosition) {
      safeFlyTo(map, [userPosition.lat, userPosition.lng], 14);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPosition]);

  return null;
}

const RecyclingMapView: React.FC<RecyclingMapViewProps> = ({ centers, selectedCenter, onSelectCenter, userPosition }) => {
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

      <MapController centers={centers} selectedCenter={selectedCenter} userPosition={userPosition} />
    </MapContainer>
  );
};

export default RecyclingMapView;
