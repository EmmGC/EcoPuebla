import React, { useState, useEffect, useRef } from 'react';
import { IonPage, IonContent, IonIcon, IonToast } from '@ionic/react';
import {
  menuOutline,
  searchOutline,
  locateOutline,
  mapOutline,
  listOutline,
  closeOutline,
  navigateOutline,
  leafOutline,
  chevronForwardOutline,
  locationOutline,
  alertCircleOutline,
  callOutline,
  logoWhatsapp,
  mailOutline,
  linkOutline
} from 'ionicons/icons';
import './Home.css';
import { centersData, RecyclingCenter, SUB_FILTER_GROUPS, Categoria, talleresData, Taller, comoSolicitarPlaticas, isTaller } from '../data/centersData';
import RecyclingMapView from '../components/RecyclingMapView';
import MapErrorBoundary from '../components/MapErrorBoundary';

const Home: React.FC = () => {

  // ── Estados ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'mapa' | 'lista'>('mapa');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | Taller | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchBarOpen, setIsSearchBarOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [locationPulse, setLocationPulse] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);

  const [sheetTranslateY, setSheetTranslateY] = useState<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Calcula la distancia en kilómetros usando la fórmula de Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Sub-filtros disponibles para la categoría activa
  const currentSubFilters = SUB_FILTER_GROUPS[activeFilter as Categoria] ?? [];

  // Resetear sub-filtro y cerrar panel cuando cambia el filtro principal
  useEffect(() => {
    setIsSheetOpen(false);
    setActiveSubFilter(null);
  }, [activeFilter]);

  // Intentar obtener la ubicación del usuario de manera silenciosa al iniciar la app
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.log('Geolocalización silenciosa al iniciar omitida:', error.message);
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  }, []);

  // Control de gestos táctiles para deslizar y cerrar el panel de detalles en móvil
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle-bar') || target.closest('.detail-panel-header')) {
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = true;
      const sheet = document.querySelector('.detail-panel-sheet') as HTMLElement;
      if (sheet) {
        sheet.style.transition = 'none';
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      setSheetTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const sheet = document.querySelector('.detail-panel-sheet') as HTMLElement;
    if (sheet) {
      sheet.style.transition = '';
    }

    if (sheetTranslateY > 90) {
      setIsSheetOpen(false);
    }
    setSheetTranslateY(0);
  };

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

  // Click on location button — pide la ubicación real del navegador
  const handleLocateUser = () => {
    if (!('geolocation' in navigator)) {
      setToastMessage('Tu navegador no soporta geolocalización.');
      return;
    }
    setLocationPulse(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        setTimeout(() => setLocationPulse(false), 2000);
      },
      () => {
        setLocationPulse(false);
        setToastMessage('No se pudo obtener tu ubicación. Revisa los permisos del navegador.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Click on a pin
  const handleSelectCenter = (center: RecyclingCenter | Taller) => {
    setSelectedCenter(center);
    setIsSheetOpen(true);
  };

  // Abre la ruta hacia el centro seleccionado en Google Maps: usa la ubicación
  // real del usuario si ya la compartió, y si el centro no tiene coordenadas
  // precisas cae a una búsqueda por nombre en vez de inventar una ubicación.
  const handleGetDirections = () => {
    if (!selectedCenter) return;
    let queryTerm = '';
    
    if (isTaller(selectedCenter) || ('ubicacionDependencia' in selectedCenter)) {
      const taller = selectedCenter as Taller;
      if (taller.id === 1) {
        queryTerm = `ORGANISMO OPERADOR DEL SERVICIO DE LIMPIA, ${taller.ubicacionDependencia}`;
      } else if (taller.id === 2) {
        queryTerm = `Secretaría de Medio Ambiente, Desarrollo Sustentable y Ordenamiento Territorial., ${taller.ubicacionDependencia}`;
      } else {
        queryTerm = `${taller.institucion}, ${taller.ubicacionDependencia}`;
      }
    } else {
      const isVirtualAddress = selectedCenter.address.toLowerCase().includes('consultar') || selectedCenter.address.toLowerCase().includes('recolección');
      queryTerm = isVirtualAddress
        ? `${selectedCenter.name}, Puebla, México`
        : `${selectedCenter.name}, ${selectedCenter.address}, Puebla, México`;
    }
    
    const query = encodeURIComponent(queryTerm);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Navigate to map and focus a center clicked from the List
  const handleViewCenterOnMap = (center: RecyclingCenter | Taller) => {
    setSelectedCenter(center);
    setActiveTab('mapa');
    setIsSheetOpen(true);
  };

  // Filtrado: categoría principal → sub-filtro → búsqueda libre
  const filteredCenters = centersData.filter(center => {
    // 1. Filtro principal por categoría
    const matchesCategory = activeFilter === 'Todos' || center.categoria === activeFilter;

    // 2. Sub-filtro: compara keywords del sub-filtro contra materials del centro
    const matchesSubFilter = !activeSubFilter
      ? true
      : (() => {
          const group = currentSubFilters.find(sf => sf.label === activeSubFilter);
          if (!group) return true;
          return center.materials.some(m =>
            group.keywords.some(kw => m.toLowerCase().includes(kw.toLowerCase()))
          );
        })();

    // 3. Búsqueda libre
    const q = searchQuery.toLowerCase();
    const matchesSearch = q === '' ||
      center.name.toLowerCase().includes(q) ||
      center.address.toLowerCase().includes(q) ||
      center.details.toLowerCase().includes(q) ||
      center.materials.some(m => m.toLowerCase().includes(q));

    return matchesCategory && matchesSubFilter && matchesSearch;
  });

  // Ordenar los centros por distancia si se tiene la ubicación del usuario
  const sortedAndFilteredCenters = React.useMemo(() => {
    const list = [...filteredCenters];
    if (userPosition) {
      list.sort((a, b) => {
        const hasA = a.lat != null && a.lng != null;
        const hasB = b.lat != null && b.lng != null;

        if (hasA && !hasB) return -1;
        if (!hasA && hasB) return 1;
        if (!hasA && !hasB) return 0;

        const distA = calculateDistance(userPosition.lat, userPosition.lng, a.lat!, a.lng!);
        const distB = calculateDistance(userPosition.lat, userPosition.lng, b.lat!, b.lng!);
        return distA - distB;
      });
    }
    return list;
  }, [filteredCenters, userPosition]);

  // Filtrado específico para talleres
  const filteredTalleres = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return talleresData.filter(taller => {
      return q === '' ||
        taller.nombre.toLowerCase().includes(q) ||
        taller.institucion.toLowerCase().includes(q) ||
        taller.escuelasDondeAplica.toLowerCase().includes(q) ||
        taller.ubicacionDependencia.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  // Helper renderer: Center/Taller details card (used on both Mobile Sheet and Desktop Overlay)
  const renderDetailPanelContent = () => {
    if (!selectedCenter) return null;

    if (isTaller(selectedCenter)) {
      const { tel, link, nombre, institucion, escuelasDondeAplica, ubicacionDependencia } = selectedCenter;
      return (
        <div className="detail-panel-sheet-content">
          <div className="detail-panel-header">
            <div>
              <div className="detail-panel-title">{nombre}</div>
              <div className="detail-panel-subtitle">📋 Taller o Plática Escolar</div>
              <div className="badges-container">
                <span className="badge-taller-tag">🏫 {institucion}</span>
              </div>
            </div>
            <button className="close-panel-btn" onClick={() => setIsSheetOpen(false)}>
              <IonIcon icon={closeOutline} />
            </button>
          </div>

          {/* Ubicación de la dependencia */}
          {ubicacionDependencia && (
            <div className="panel-row-info">
              <IonIcon icon={locationOutline} className="panel-row-icon" />
              <span>{ubicacionDependencia}</span>
            </div>
          )}

          {/* Dónde aplica */}
          <div className="panel-row-info" style={{ alignItems: 'flex-start' }}>
            <IonIcon icon={alertCircleOutline} className="panel-row-icon" style={{ marginTop: '2px' }} />
            <span style={{ fontSize: '12.5px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              <strong>Aplica en: </strong> {escuelasDondeAplica}
            </span>
          </div>

          {/* Contacto */}
          {tel && tel.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div className="materials-section-title">Teléfonos de Contacto:</div>
              {tel.map((t) => (
                <div className="panel-row-info" key={t}>
                  <IonIcon icon={callOutline} className="panel-row-icon" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}

          {/* Acciones */}
          <div className="panel-actions-wrapper">
            <button
              className="route-cta-btn route-cta-primary"
              onClick={handleGetDirections}
            >
              <IonIcon icon={navigateOutline} />
              <span>Cómo llegar</span>
            </button>
            <button
              className="route-cta-btn route-cta-secondary"
              onClick={() => {
                if (link) {
                  const targetUrl = link.startsWith('http') ? link : `https://${link}`;
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                } else {
                  setToastMessage('Aún no se cuenta con un enlace de información para este taller.');
                }
              }}
              style={{ opacity: link ? 1 : 0.6 }}
            >
              <IonIcon icon={linkOutline} />
              <span>{link ? 'Más info' : 'Sin enlace'}</span>
            </button>
          </div>
        </div>
      );
    }

    const { contact, link, details } = selectedCenter;
    return (
      <div className="detail-panel-sheet-content">
        <div className="detail-panel-header">
          <div>
            <div className="detail-panel-title">{selectedCenter.name}</div>
            <div className="detail-panel-subtitle">Punto de Acopio — {selectedCenter.materials.join(', ')}</div>
            {(selectedCenter.isHomePickup || selectedCenter.isMultipleSites) && (
              <div className="badges-container">
                {selectedCenter.isHomePickup && <span className="badge-home-pickup">🚚 Servicio a Domicilio</span>}
                {selectedCenter.isMultipleSites && <span className="badge-multiple-sites">📍 Múltiples Sucursales</span>}
              </div>
            )}
          </div>
          <button className="close-panel-btn" onClick={() => setIsSheetOpen(false)}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        {/* Dirección */}
        <div className="panel-row-info">
          <IonIcon icon={locationOutline} className="panel-row-icon" />
          <span>
            {selectedCenter.address}
            {userPosition && selectedCenter.lat != null && selectedCenter.lng != null && (
              <strong style={{ marginLeft: '6px', color: 'var(--color-accent)' }}>
                ({(() => {
                  const dist = calculateDistance(userPosition.lat, userPosition.lng, selectedCenter.lat, selectedCenter.lng);
                  return dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
                })()})
              </strong>
            )}
          </span>
        </div>

        {/* Qué reciben */}
        {details && (
          <div className="panel-row-info" style={{ alignItems: 'flex-start' }}>
            <IonIcon icon={leafOutline} className="panel-row-icon" style={{ marginTop: '2px' }} />
            <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{details}</span>
          </div>
        )}

        {/* Contacto */}
        {(contact.whatsapp || (contact.tel && contact.tel.length > 0) || contact.email) && (
          <div style={{ marginTop: '12px' }}>
            <div className="materials-section-title">Contacto:</div>
            {contact.whatsapp && (
              <div className="panel-row-info">
                <IonIcon icon={logoWhatsapp} className="panel-row-icon" style={{ color: '#25d366' }} />
                <span>{contact.whatsapp}</span>
              </div>
            )}
            {contact.tel?.map((t) => (
              <div className="panel-row-info" key={t}>
                <IonIcon icon={callOutline} className="panel-row-icon" />
                <span>{t}</span>
              </div>
            ))}
            {contact.email && (
              <div className="panel-row-info">
                <IonIcon icon={mailOutline} className="panel-row-icon" />
                <span>{contact.email}</span>
              </div>
            )}
          </div>
        )}

        {/* Materiales */}
        <div style={{ marginTop: '12px' }}>
          <div className="materials-section-title">Categoría:</div>
          <div className="materials-pills-wrap">
            {selectedCenter.materials.map((mat) => (
              <span
                key={mat}
                className={`material-chip-tag ${activeFilter === mat ? 'accented' : ''}`}
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="panel-actions-wrapper">
          <button
            className="route-cta-btn route-cta-primary"
            onClick={handleGetDirections}
          >
            <IonIcon icon={navigateOutline} />
            <span>Cómo llegar</span>
          </button>
          <button
            className="route-cta-btn route-cta-secondary"
            onClick={() => {
              if (link) {
                // Si el link no tiene protocolo, agregar https://
                const targetUrl = link.startsWith('http') ? link : `https://${link}`;
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
              } else {
                setToastMessage('Aún no se cuenta con un enlace de información para este sitio.');
              }
            }}
            style={{ opacity: link ? 1 : 0.6 }}
          >
            <IonIcon icon={linkOutline} />
            <span>{link ? 'Más info' : 'Sin enlace'}</span>
          </button>
        </div>
      </div>
    );
  };

  // Helper renderer: Center list cards
  const renderCenterCard = (center: RecyclingCenter) => {
    // Calcular distancia real si disponemos de ubicación
    let distanceStr = '--';
    if (userPosition && center.lat != null && center.lng != null) {
      const dist = calculateDistance(userPosition.lat, userPosition.lng, center.lat, center.lng);
      distanceStr = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
    }

    return (
      <div 
        key={center.id}
        className="center-list-card"
        onClick={() => handleViewCenterOnMap(center)}
      >
        <div className="card-title-row">
          <div className="card-title">{center.name}</div>
          <div className="card-distance">{distanceStr}</div>
        </div>
        <div className="card-address">{center.address}</div>
        
        {(center.isHomePickup || center.isMultipleSites) && (
          <div className="badges-container" style={{ margin: '4px 0 2px' }}>
            {center.isHomePickup && <span className="badge-home-pickup">🚚 A Domicilio</span>}
            {center.isMultipleSites && <span className="badge-multiple-sites">📍 Múltiples Sedes</span>}
          </div>
        )}

        <div className="card-badge-row">
          {center.materials.slice(0, 3).map((mat) => (
            <span
              key={mat}
              className={`card-material-badge ${activeFilter === mat || center.categoria === activeFilter ? 'card-material-badge-active' : ''}`}
            >
              {mat}
            </span>
          ))}
          {center.materials.length > 3 && (
            <span className="card-material-badge card-material-badge-more">
              +{center.materials.length - 3}
            </span>
          )}
        </div>

        <div className="card-meta-row">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {center.categoria}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--color-accent)' }}>
            <span>Ver detalles</span>
            <IonIcon icon={chevronForwardOutline} />
          </div>
        </div>
      </div>
    );
  };

  // Helper renderer: Taller list cards
  const renderTallerCard = (taller: Taller) => {
    return (
      <div 
        key={`taller-${taller.id}`}
        className="center-list-card taller-list-card"
        onClick={() => handleViewCenterOnMap(taller)}
      >
        <div className="card-title-row">
          <div className="card-title">{taller.nombre}</div>
          <span className="badge-taller-tag">📋 Taller</span>
        </div>
        <div className="card-institution">🏫 {taller.institucion}</div>
        <div className="card-detail-text">
          <strong>Aplica en:</strong> {taller.escuelasDondeAplica}
        </div>
        
        {taller.ubicacionDependencia && (
          <div className="card-address" style={{ marginTop: '8px' }}>
            📍 {taller.ubicacionDependencia}
          </div>
        )}

        <div className="card-meta-row">
          <div style={{ display: 'flex', gap: '8px' }}>
            {taller.tel && taller.tel.length > 0 && (
              <span className="card-taller-meta-action">📞 {taller.tel[0]}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--color-accent)' }}>
            <span>Ver detalles</span>
            <IonIcon icon={chevronForwardOutline} />
          </div>
        </div>
      </div>
    );
  };

  // Helper renderer: Solicitud de pláticas information box
  const renderComoSolicitarBlock = () => {
    return (
      <div className="solicitar-platicas-banner">
        <div className="solicitar-platicas-title">
          🎓 ¿Cómo solicitar pláticas de reciclaje para tu escuela?
        </div>
        <div className="solicitar-platicas-content">
          {comoSolicitarPlaticas.map((item, idx) => (
            <div key={idx} className="solicitar-item">
              <div className="solicitar-via">🔹 {item.via}</div>
              <div className="solicitar-desc">{item.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} className="ion-no-padding">
        <div className="home-container">
          <div className="app-viewport">
            
            {/* Header bar (Mobile Menu + App Title + Mobile Search toggle) */}
            <header className="header-wireframe">
              <button className="hamburger-btn" onClick={() => setIsDrawerOpen(true)}>
                <IonIcon icon={menuOutline} />
              </button>
              <div className="app-title">
                <IonIcon icon={leafOutline} className="app-title-leaf" />
                <span>EcoMapa</span>
              </div>
              <button className="search-btn" onClick={() => setIsSearchBarOpen(true)}>
                <IonIcon icon={searchOutline} />
              </button>
            </header>

            {/* Inline search bar (Mobile search panel toggle) */}
            <div className={`search-overlay-container ${isSearchBarOpen ? 'open' : ''}`}>
              <input 
                type="text" 
                className="search-input-field" 
                placeholder="Buscar punto de recolección..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-close-button" onClick={() => {
                setIsSearchBarOpen(false);
                setSearchQuery('');
              }}>
                Cancelar
              </button>
            </div>

            {/* Filter buttons (Mobile Chips container) */}
            <div className="chips-bar-container">
              <div className="chips-bar-scrollable no-scrollbar">
                {[
                  { label: 'Todos', icon: '♻️' },
                  { label: 'Orgánicos', icon: '🌿' },
                  { label: 'Aceite', icon: '🛢️' },
                  { label: 'Medicamentos', icon: '💊' },
                  { label: 'Ropa', icon: '👕' },
                  { label: 'Electrónicos', icon: '💻' },
                  { label: 'Escuelas', icon: '🏫' },
                  { label: 'Talleres', icon: '📋' },
                ].map((cat) => (
                  <button
                    key={cat.label}
                    className={`chip-button ${activeFilter === cat.label ? 'active' : ''}`}
                    onClick={() => setActiveFilter(cat.label)}
                  >
                    <span className="chip-icon">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-filtros (aparecen solo cuando la categoría activa los tiene) */}
            {currentSubFilters.length > 0 && (
              <div className="chips-bar-container sub-filter-bar">
                <div className="chips-bar-scrollable no-scrollbar">
                  <button
                    className={`chip-button sub-chip ${!activeSubFilter ? 'active' : ''}`}
                    onClick={() => setActiveSubFilter(null)}
                  >
                    <span>Todos</span>
                  </button>
                  {currentSubFilters.map((sf) => (
                    <button
                      key={sf.label}
                      className={`chip-button sub-chip ${activeSubFilter === sf.label ? 'active' : ''}`}
                      onClick={() => setActiveSubFilter(prev => prev === sf.label ? null : sf.label)}
                    >
                      <span>{sf.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RESPONSIVE LAYOUT ENGINE */}
            <div className="split-pane-layout">
              
              {/* DESKTOP SIDEBAR PANEL (Only rendered on desktop/web screens) */}
              <aside className="desktop-sidebar no-scrollbar">
                <div style={{ padding: '20px 16px 12px' }}>
                  <div className="search-field-wrapper">
                    <IonIcon icon={searchOutline} className="list-search-icon" />
                    <input 
                      type="text" 
                      className="list-search-input" 
                      placeholder="Buscar por nombre o material..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="list-scroll-area no-scrollbar">
                  <div className="materials-section-title" style={{ padding: '0 4px 4px' }}>
                    {activeFilter === 'Talleres' ? `Talleres y Pláticas (${filteredTalleres.length})` : `Centros de Reciclaje (${sortedAndFilteredCenters.length})`}
                  </div>
                  
                  {activeFilter === 'Talleres' ? (
                    filteredTalleres.length > 0 ? (
                      <>
                        {renderComoSolicitarBlock()}
                        {filteredTalleres.map((taller) => renderTallerCard(taller))}
                      </>
                    ) : (
                      <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        No se encontraron talleres coincidentes.
                      </div>
                    )
                  ) : (
                    sortedAndFilteredCenters.length > 0 ? (
                      sortedAndFilteredCenters.map((center) => renderCenterCard(center))
                    ) : (
                      <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        No se encontraron centros coincidentes.
                      </div>
                    )
                  )}
                </div>
              </aside>

              {/* MAP & MOBILE CONTENT CONTAINER */}
              <div className="desktop-map-view">
                <div className="mobile-pane-switcher">

                  {/* 1. MAP VIEW TAB (Visible on Mobile or Desktop) */}
                  <div className={`mobile-tab-view ${activeTab === 'mapa' ? 'active' : ''}`}>
                    <div className="map-canvas-container">

                      <MapErrorBoundary>
                        <RecyclingMapView
                          centers={sortedAndFilteredCenters}
                          selectedCenter={selectedCenter}
                          onSelectCenter={handleSelectCenter}
                          userPosition={userPosition}
                        />
                      </MapErrorBoundary>

                      {/* Floating locator action buttons */}
                      <div className={`floating-actions-container ${isSheetOpen && selectedCenter ? 'has-sheet' : ''}`}>
                        <button className="floating-action-btn" onClick={handleLocateUser} title="Mi Ubicación">
                          <IonIcon icon={locateOutline} style={{ color: locationPulse ? 'var(--color-accent)' : '' }} />
                        </button>
                      </div>

                      {/* Detail Panel Card (Slides up on Mobile, floats on Desktop Map) */}
                      <div 
                        className={`detail-panel-sheet ${isSheetOpen && selectedCenter ? 'visible' : ''}`}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={
                          isSheetOpen && selectedCenter && sheetTranslateY > 0 && isMobile()
                            ? { transform: `translateY(${sheetTranslateY}px)` }
                            : undefined
                        }
                      >
                        <div className="drag-handle-bar" onClick={() => setIsSheetOpen(false)}></div>
                        {renderDetailPanelContent()}
                      </div>

                    </div>
                  </div>

                  {/* 2. LIST VIEW TAB (Mobile list container, hidden on desktop layout) */}
                  <div className={`mobile-tab-view mobile-tab-list ${activeTab === 'lista' ? 'active' : ''}`}>
                    <div className="list-view-container">
                      <div className="list-view-header">
                        <div className="search-field-wrapper">
                          <IonIcon icon={searchOutline} className="list-search-icon" />
                          <input 
                            type="text" 
                            className="list-search-input" 
                            placeholder="Filtra centros por nombre..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="list-scroll-area no-scrollbar">
                        {activeFilter === 'Talleres' ? (
                          filteredTalleres.length > 0 ? (
                            <>
                              {renderComoSolicitarBlock()}
                              {filteredTalleres.map((taller) => renderTallerCard(taller))}
                            </>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 10px', color: 'var(--text-secondary)' }}>
                              <IonIcon icon={alertCircleOutline} style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text-muted)' }} />
                              <div style={{ fontSize: '13.5px', fontWeight: 500 }}>No hay talleres</div>
                            </div>
                          )
                        ) : (
                          sortedAndFilteredCenters.length > 0 ? (
                            sortedAndFilteredCenters.map((center) => renderCenterCard(center))
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 10px', color: 'var(--text-secondary)' }}>
                              <IonIcon icon={alertCircleOutline} style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text-muted)' }} />
                              <div style={{ fontSize: '13.5px', fontWeight: 500 }}>No hay centros</div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Mobile Footer Tab Bar */}
            <footer className="fixed-nav-bar">
              <button 
                className={`nav-tab-btn ${activeTab === 'mapa' ? 'active' : ''}`}
                onClick={() => setActiveTab('mapa')}
              >
                <IonIcon icon={mapOutline} className="nav-tab-icon" />
                <span className="nav-tab-label">Mapa</span>
              </button>
              
              <button 
                className={`nav-tab-btn ${activeTab === 'lista' ? 'active' : ''}`}
                onClick={() => setActiveTab('lista')}
              >
                <IonIcon icon={listOutline} className="nav-tab-icon" />
                <span className="nav-tab-label">Lista</span>
              </button>
            </footer>

            {/* Menu drawer sidebar backdrop */}
            <div 
              className={`drawer-backdrop ${isDrawerOpen ? 'visible' : ''}`}
              onClick={() => setIsDrawerOpen(false)}
            ></div>

            {/* Mobile Hamburger Drawer Menu */}
            <aside className={`side-menu-drawer ${isDrawerOpen ? 'open' : ''}`}>
              <div className="drawer-header">
                <IonIcon icon={leafOutline} className="drawer-app-logo" />
                <span className="drawer-app-title">EcoMapa</span>
              </div>

              <nav className="drawer-nav-list">
                <div className={`drawer-nav-item ${activeTab === 'mapa' ? 'active' : ''}`} onClick={() => { setActiveTab('mapa'); setIsDrawerOpen(false); }}>
                  <IonIcon icon={mapOutline} className="drawer-nav-icon" />
                  <span>Mapa de Reciclaje</span>
                </div>

                <div className={`drawer-nav-item ${activeTab === 'lista' ? 'active' : ''}`} onClick={() => { setActiveTab('lista'); setIsDrawerOpen(false); }}>
                  <IonIcon icon={listOutline} className="drawer-nav-icon" />
                  <span>Listado de Centros</span>
                </div>
              </nav>

              <div className="drawer-footer">
                <span>© 2026 EcoMapa Inc.</span>
              </div>
            </aside>

            <IonToast
              isOpen={toastMessage !== null}
              onDidDismiss={() => setToastMessage(null)}
              message={toastMessage ?? ''}
              duration={3500}
              position="bottom"
              style={{ '--background': 'var(--bg-tertiary)', '--color': 'var(--text-primary)' }}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
