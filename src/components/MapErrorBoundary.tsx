import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// Si el mapa de Leaflet llega a fallar (p. ej. una condición de carrera al
// animar la vista), esto evita que tumbe toda la aplicación: sin un error
// boundary, un error sin capturar en cualquier parte del árbol hace que React
// desmonte TODO, no solo el mapa.
class MapErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('El mapa falló, mostrando estado de respaldo:', error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="map-error-fallback">
          <p>No se pudo mostrar el mapa.</p>
          <button onClick={this.handleRetry}>Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
