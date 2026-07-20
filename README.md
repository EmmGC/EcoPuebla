# 🌿 EcoMapa - EcoPuebla

**EcoMapa** es una aplicación web y móvil progresiva (PWA) diseñada para conectar a los ciudadanos de Puebla con centros de reciclaje y acopio especializado. Su objetivo es facilitar la recolección responsable de residuos orgánicos, aceites usados, medicamentos caducos, ropa, electrónicos y puntos comunitarios escolares.

El proyecto está diseñado de forma responsiva (mobile-first), simulando la experiencia de una app nativa en dispositivos móviles mediante navegación por pestañas y menús laterales, y adaptándose a un panel completo estilo dashboard en pantallas de escritorio.

---

## 🛠️ Stack Tecnológico

- **Framework principal**: React
- **Componentes de interfaz**: [Ionic React](https://ionicframework.com/docs/react) (para un comportamiento responsivo y táctil nativo).
- **Mapa**: [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) con tiles de OpenStreetMap/CARTO (100% gratis, sin API key). Geolocalización real vía la Geolocation API del navegador. El botón "Cómo llegar" abre la ruta calculada en Google Maps (deep link, sin motor de rutas propio).
- **Tipado y robustez**: TypeScript
- **Compilador y servidor dev**: Vite
- **Estilos**: Vanilla CSS con variables personalizadas y un diseño moderno estilo Dark Mode.

---

## 📦 Arquitectura de Datos: Monolito Local

Los datos de los centros de acopio se manejan de manera **local** en el archivo:
`src/data/centersData.ts`

### Ventajas de este enfoque:
1. **Despliegues Automáticos (CI/CD)**: Integrado completamente con Netlify. Cada vez que actualices el archivo de datos y hagas un `git push`, Netlify compilará el código y desplegará la versión actualizada al instante.
2. **Sin Dependencias ni Cuotas**: No requiere bases de datos externas (como Firebase o Supabase) para el lanzamiento inicial, eliminando problemas de latencia, configuración de APIs o cobros por lectura/escritura.
3. **Alto Rendimiento**: La velocidad de carga y filtrado es instantánea ya que la información ya reside en el bundle de la aplicación.

---

## 🏷️ Categorías y Sub-filtros Implementados

Para mejorar la experiencia de usuario y acelerar la búsqueda de centros específicos, la aplicación cuenta con un flujo de **doble filtrado**:

1. **Orgánicos** 🌿: Las plantas de Bruce, OOSL, Ecorganic.
2. **Aceite** 🛢️: DEA, Convertidora de Aceites, REEPSA.
3. **Medicamentos** 💊: EXITIUM, SINGREM, Farmacias participantes.
4. **Ropa** 👕: Con sub-filtros de *Ropa/Calzado*, *Abrigos/Cobijas* y *Juguetes/Artículos*.
5. **Electrónicos** 💻: Con sub-filtros de *Computadoras*, *Celulares*, *Cables/Accesorios* y *Chatarra/Metales*.
6. **Escuelas** 🏫: Con sub-filtros de *PET/Plástico*, *Papel/Cartón*, *Electrónicos* y *Aluminio/Latas*.

---

## 🚀 Inicio Rápido en Local

Para correr este proyecto en tu entorno local:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   *Por defecto, iniciará el proyecto en `http://localhost:5173`*.

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## ➕ ¿Cómo agregar un nuevo centro de acopio?

Añadir o actualizar información es sumamente sencillo. Abre el archivo `src/data/centersData.ts` y agrega un nuevo objeto a la lista `centersData` respetando la interfaz `RecyclingCenter`:

```typescript
{
  id: 29, // ID único incremental
  name: 'Nombre del Centro',
  categoria: 'Orgánicos', // Una de las categorías válidas
  materials: ['Hojas secas', 'Residuos de café'], // Tags útiles para búsqueda y filtros
  hours: 'Lun a Vie 9:00 - 18:00',
  address: 'Dirección completa, Puebla, Pue.',
  distance: '--',
  lat: 19.0414, // Latitud real (opcional, ver nota abajo)
  lng: -98.2063, // Longitud real (opcional, ver nota abajo)
  icon: '🌿', // Emoji descriptivo
  contact: {
    whatsapp: '2221234567', // Opcional
    tel: ['2223094400'],     // Opcional
    email: 'info@sitio.com'  // Opcional
  },
  details: 'Descripción detallada de lo que reciben y sus dinámicas.',
  link: 'https://tusitio.com' // Opcional (si no tiene, se mostrará como "Sin enlace")
}
```

### Sobre `lat` / `lng`

El mapa usa [Leaflet](https://leafletjs.com/) con coordenadas reales (WGS84), no posiciones simuladas.
- Si conoces la dirección exacta, obtén `lat`/`lng` gratis en [Nominatim](https://nominatim.openstreetmap.org/ui/search.html) (buscador de OpenStreetMap) o haciendo clic derecho en Google Maps → "¿Qué hay aquí?".
- Si **no** conoces una ubicación precisa (recolección a domicilio, "consultar", múltiples sucursales), deja `lat`/`lng` sin definir. El centro seguirá apareciendo en la lista y el botón "Cómo llegar" hará una búsqueda por nombre en Google Maps en vez de trazar una ruta con coordenadas inventadas — es preferible eso a mostrar un pin en el lugar equivocado.

Una vez guardes y empujes los cambios en tu repo remoto, Netlify se encargará del resto de manera transparente.
