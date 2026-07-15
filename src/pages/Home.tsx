import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  menuOutline,
  searchOutline,
  locateOutline,
  mapOutline,
  listOutline,
  closeOutline,
  navigateOutline,
  star,
  leafOutline,
  chevronForwardOutline,
  settingsOutline,
  timeOutline,
  locationOutline,
  alertCircleOutline
} from 'ionicons/icons';
import './Home.css';

// Interface definitions
interface RecyclingCenter {
  id: number;
  name: string;
  materials: string[];
  hours: string;
  address: string;
  rating: number;
  distance: string;
  x: number; // SVG center coordinate X
  y: number; // SVG center coordinate Y
  icon: string;
}

const Home: React.FC = () => {
  // Mock recycling center locations database
  const centersData: RecyclingCenter[] = [
    {
      id: 1,
      name: 'EcoPunto Central',
      materials: ['Plástico', 'Papel', 'Vidrio'],
      hours: 'Lun - Sáb: 08:00 - 18:00',
      address: 'Av. Reforma 402, Col. Centro',
      rating: 4.8,
      distance: '0.8 km',
      x: 120,
      y: 150,
      icon: '♻️'
    },
    {
      id: 2,
      name: 'Eko-Pilas Juárez',
      materials: ['Pilas', 'Electrónicos'],
      hours: 'Lun - Vie: 09:00 - 17:00 / Sáb: 09:00 - 14:00',
      address: 'Calle Juárez 892, Col. Juárez',
      rating: 4.9,
      distance: '1.5 km',
      x: 280,
      y: 220,
      icon: '🔋'
    },
    {
      id: 3,
      name: 'Plaza Recicla Sur',
      materials: ['Plástico', 'Vidrio', 'Electrónicos', 'Papel'],
      hours: 'Lun - Dom: 10:00 - 20:00',
      address: 'Blvd. Atlixco 3409, Zona Sur',
      rating: 4.5,
      distance: '2.3 km',
      x: 190,
      y: 340,
      icon: '🏢'
    },
    {
      id: 4,
      name: 'Verde Alternativo',
      materials: ['Papel', 'Plástico', 'Pilas'],
      hours: 'Lun - Vie: 08:30 - 19:30',
      address: 'Av. 25 Poniente 1702, Volcanes',
      rating: 4.7,
      distance: '3.1 km',
      x: 80,
      y: 460,
      icon: '🌿'
    },
    {
      id: 5,
      name: 'Acopio Anzures',
      materials: ['Electrónicos', 'Pilas', 'Papel'],
      hours: 'Lun - Sáb: 09:00 - 18:00',
      address: 'Calle 39 Oriente 1204, Anzures',
      rating: 4.6,
      distance: '1.2 km',
      x: 310,
      y: 90,
      icon: '🔌'
    }
  ];

  // User location node
  const userLocation = { x: 150, y: 250 };

  // States
  const [activeTab, setActiveTab] = useState<'mapa' | 'lista'>('mapa');
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [showRoute, setShowRoute] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchBarOpen, setIsSearchBarOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [locationPulse, setLocationPulse] = useState<boolean>(false);

  // Close sheet on filter change
  useEffect(() => {
    setIsSheetOpen(false);
    setShowRoute(false);
  }, [activeFilter]);

  // Click on location button
  const handleLocateUser = () => {
    setLocationPulse(true);
    setTimeout(() => setLocationPulse(false), 2000);
  };

  // Click on a pin
  const handleSelectCenter = (center: RecyclingCenter) => {
    setSelectedCenter(center);
    setIsSheetOpen(true);
    setShowRoute(false);
  };

  // Toggle route line
  const handleToggleRoute = () => {
    setShowRoute(!showRoute);
  };

  // Navigate to map and focus a center clicked from the List
  const handleViewCenterOnMap = (center: RecyclingCenter) => {
    setSelectedCenter(center);
    setActiveTab('mapa');
    setIsSheetOpen(true);
    setShowRoute(false);
  };

  // Filter centers based on active category chip and search query
  const filteredCenters = centersData.filter(center => {
    const matchesCategory = activeFilter === 'Todos' || center.materials.includes(activeFilter);
    const matchesSearch = searchQuery === '' || 
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Helper renderer: Center details card (used on both Mobile Sheet and Desktop Overlay)
  const renderDetailPanelContent = () => {
    if (!selectedCenter) return null;
    return (
      <div className="detail-panel-sheet-content">
        <div className="detail-panel-header">
          <div>
            <div className="detail-panel-title">{selectedCenter.name}</div>
            <div className="detail-panel-subtitle">Punto Autorizado de Reciclaje</div>
          </div>
          <button className="close-panel-btn" onClick={() => {
            setIsSheetOpen(false);
            setShowRoute(false);
          }}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <div className="panel-row-info">
          <IonIcon icon={locationOutline} className="panel-row-icon" />
          <span>{selectedCenter.address} ({selectedCenter.distance})</span>
        </div>

        <div className="panel-row-info">
          <IonIcon icon={timeOutline} className="panel-row-icon" />
          <span>{selectedCenter.hours}</span>
        </div>

        <div style={{ marginTop: '14px' }}>
          <div className="materials-section-title">Materiales Aceptados:</div>
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

        <div className="panel-actions-wrapper">
          <button 
            className="route-cta-btn"
            onClick={handleToggleRoute}
          >
            <IonIcon icon={navigateOutline} />
            <span>{showRoute ? 'Cancelar Ruta' : 'Trazar Ruta'}</span>
          </button>
        </div>
      </div>
    );
  };

  // Helper renderer: Center list cards
  const renderCenterCard = (center: RecyclingCenter) => {
    return (
      <div 
        key={center.id}
        className="center-list-card"
        onClick={() => handleViewCenterOnMap(center)}
      >
        <div className="card-title-row">
          <div className="card-title">{center.name}</div>
          <div className="card-distance">{center.distance}</div>
        </div>
        <div className="card-address">{center.address}</div>
        
        <div className="card-badge-row">
          {center.materials.map((mat) => (
            <span 
              key={mat}
              className={`card-material-badge ${activeFilter === mat ? 'card-material-badge-active' : ''}`}
            >
              {mat}
            </span>
          ))}
        </div>

        <div className="card-meta-row">
          <div className="card-rating-wrap">
            <IonIcon icon={star} className="star-icon" />
            <span>{center.rating}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--color-accent)' }}>
            <span>Ver en Mapa</span>
            <IonIcon icon={chevronForwardOutline} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-no-padding">
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
                {['Todos', 'Plástico', 'Pilas', 'Electrónicos', 'Vidrio', 'Papel'].map((cat) => (
                  <button 
                    key={cat}
                    className={`chip-button ${activeFilter === cat ? 'active' : ''}`}
                    onClick={() => setActiveFilter(cat)}
                  >
                    <span className="chip-icon">
                      {cat === 'Todos' && '♻️'}
                      {cat === 'Plástico' && '🥤'}
                      {cat === 'Pilas' && '🔋'}
                      {cat === 'Electrónicos' && '💻'}
                      {cat === 'Vidrio' && '🍾'}
                      {cat === 'Papel' && '📦'}
                    </span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

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
                    Centros de Reciclaje ({filteredCenters.length})
                  </div>
                  
                  {filteredCenters.length > 0 ? (
                    filteredCenters.map((center) => renderCenterCard(center))
                  ) : (
                    <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No se encontraron centros coincidentes.
                    </div>
                  )}
                </div>
              </aside>

              {/* MAP & MOBILE CONTENT CONTAINER */}
              <div className="desktop-map-view">
                <div className="mobile-pane-switcher">

                  {/* 1. MAP VIEW TAB (Visible on Mobile or Desktop) */}
                  <div className={`mobile-tab-view ${activeTab === 'mapa' ? 'active' : ''}`}>
                    <div className="map-canvas-container">
                      
                      {/* Responsive SVG Map canvas */}
                      <svg className="svg-map-graphics" viewBox="0 0 390 550" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                        <rect width="390" height="550" className="map-bg" />
                        <path d="M 0,80 Q 80,40 120,110 T 60,190 Z" className="map-forest" />
                        <rect x="230" y="40" width="130" height="70" rx="12" className="map-forest" />
                        <path d="M 260,340 Q 320,380 390,320 L 390,440 L 290,440 Z" className="map-forest" />
                        <path d="M -20,410 Q 120,440 200,380 T 410,480 L 410,520 Q 280,430 200,430 T -20,470 Z" className="map-water" />
                        <path d="M 0,160 L 390,160 M 0,300 L 390,300 M 0,440 L 390,440 M 150,0 Q 130,220 150,550 M 270,0 Q 290,280 270,550" className="map-road-network" />
                        <path d="M -20,60 H 410 M -20,230 H 410" className="map-main-road" />
                        
                        {/* Glowing Route path */}
                        {showRoute && selectedCenter && (
                          <path 
                            d={`M ${userLocation.x},${userLocation.y} 
                                Q ${(userLocation.x + selectedCenter.x)/2 + 20},${(userLocation.y + selectedCenter.y)/2 - 30} 
                                ${selectedCenter.x},${selectedCenter.y}`} 
                            className="map-glow-path" 
                          />
                        )}

                        {/* Responsive User Location Marker inside SVG */}
                        <g 
                          className={`user-marker-svg ${locationPulse ? 'pulsing' : ''}`}
                          transform={`translate(${userLocation.x}, ${userLocation.y})`}
                        >
                          <circle r="18" className="user-pulse-ring-svg" />
                          <circle r="6" fill="var(--color-accent)" stroke="#ffffff" strokeWidth="2" />
                        </g>

                        {/* Responsive Center Markers inside SVG */}
                        {filteredCenters.map((center) => (
                          <g 
                            key={center.id}
                            className={`map-pin-svg ${selectedCenter?.id === center.id ? 'active' : ''}`}
                            transform={`translate(${center.x}, ${center.y})`}
                            onClick={() => handleSelectCenter(center)}
                          >
                            <path 
                              d="M 0,0 C -12,-16 -18,-24 -18,-36 C -18,-47 -9,-55 0,-55 C 9,-55 18,-47 18,-36 C 18,-24 12,-16 0,0 Z" 
                              className="pin-bubble-svg" 
                            />
                            <text y="-32" textAnchor="middle" className="pin-text-svg">
                              {center.icon}
                            </text>
                          </g>
                        ))}
                      </svg>

                      {/* Floating locator action buttons */}
                      <div className={`floating-actions-container ${isSheetOpen && selectedCenter ? 'has-sheet' : ''}`}>
                        <button className="floating-action-btn" onClick={handleLocateUser} title="Mi Ubicación">
                          <IonIcon icon={locateOutline} style={{ color: locationPulse ? 'var(--color-accent)' : '' }} />
                        </button>
                      </div>

                      {/* Detail Panel Card (Slides up on Mobile, floats on Desktop Map) */}
                      <div className={`detail-panel-sheet ${isSheetOpen && selectedCenter ? 'visible' : ''}`}>
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
                        {filteredCenters.length > 0 ? (
                          filteredCenters.map((center) => renderCenterCard(center))
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 10px', color: 'var(--text-secondary)' }}>
                            <IonIcon icon={alertCircleOutline} style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text-muted)' }} />
                            <div style={{ fontSize: '13.5px', fontWeight: 500 }}>No hay centros</div>
                          </div>
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

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
