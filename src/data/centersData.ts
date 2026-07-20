// ─── Interfaces ───────────────────────────────────────────────────────────────

export type Categoria =
  | 'Orgánicos'
  | 'Aceite'
  | 'Medicamentos'
  | 'Ropa'
  | 'Electrónicos'
  | 'Escuelas'
  | 'Talleres';

export interface RecyclingCenter {
  id: number;
  name: string;
  categoria: Categoria;
  /** Tags específicos de qué materiales aceptan, sirven para el sub-filtro */
  materials: string[];
  hours: string;
  address: string;
  distance: string;
  /** Coordenadas reales (WGS84). Solo se llenan cuando se conoce una dirección precisa y geocodificable. */
  lat?: number;
  lng?: number;
  icon: string;
  contact: {
    whatsapp?: string;
    tel?: string[];
    email?: string;
  };
  details: string;
  link?: string;
  isMultipleSites?: boolean;
  isHomePickup?: boolean;
}

/** Los talleres/pláticas son programas educativos, no puntos de acopio físicos,
 *  por eso tienen su propia interfaz en vez de forzarlos dentro de RecyclingCenter. */
export interface Taller {
  id: number;
  nombre: string;
  institucion: string;
  escuelasDondeAplica: string;
  ubicacionDependencia: string;
  lat?: number;
  lng?: number;
  tel: string[];
  link?: string;
  icon: string;
}

// ─── Sub-filtros por categoría ─────────────────────────────────────────────────
// Solo las categorías que tienen diversidad interna muestran sub-filtros.

export interface SubFilterGroup {
  label: string;
  /** Keywords que se comparan contra el array `materials` del centro */
  keywords: string[];
}

export const SUB_FILTER_GROUPS: Partial<Record<Categoria, SubFilterGroup[]>> = {
  Escuelas: [
    { label: 'PET / Plástico', keywords: ['PET', 'Tapitas'] },
    { label: 'Papel / Cartón', keywords: ['Papel', 'Cartón', 'Libros viejos', 'Archivos muertos', 'Útiles escolares usados', 'Cuadernos', 'Hojas', 'Lápices'] },
    { label: 'Electrónicos', keywords: ['Residuos electrónicos', 'Cables', 'Computadoras viejas', 'Teclados', 'Tarjetas madre', 'Monitores'] },
    { label: 'Aluminio / Latas', keywords: ['Aluminio', 'Latas de aluminio', 'Envases de Tetra Pak'] },
  ],
  Electrónicos: [
    { label: 'Computadoras', keywords: ['Computadoras', 'Laptops', 'CPU', 'Monitores', 'Equipos electrónicos'] },
    { label: 'Celulares', keywords: ['Celulares'] },
    { label: 'Cables / Accesorios', keywords: ['Cables', 'Teclados', 'Módems', 'Impresoras'] },
    { label: 'Chatarra / Metales', keywords: ['Metales', 'Chatarra', 'Residuos reciclables', 'Materiales reciclables', 'Reciclables', 'Electrónicos'] },
  ],
  Ropa: [
    { label: 'Ropa / Calzado', keywords: ['Ropa', 'Calzado', 'Zapatos'] },
    { label: 'Abrigos / Cobijas', keywords: ['Cobijas', 'Artículos de higiene', 'Pañales para adulto'] },
    { label: 'Juguetes / Artículos', keywords: ['Juguetes', 'Artículos de uso personal', 'Artículos para bazares', 'Alimentos'] },
  ],
};

// ─── Datos ────────────────────────────────────────────────────────────────────
// Nota sobre lat/lng: varios centros no publican una dirección fija (recolección
// a domicilio, "consultar", múltiples sucursales, etc.). Para esos se deja
// lat/lng sin definir a propósito en vez de inventar una ubicación — el mapa los
// omite como pin, pero siguen apareciendo en la lista y el botón "Cómo llegar"
// cae a una búsqueda por nombre en vez de una ruta con coordenadas falsas.

export const centersData: RecyclingCenter[] = [

  // ── ORGÁNICOS ──────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Las plantas de Bruce',
    categoria: 'Orgánicos',
    materials: ['Restos de frutas', 'Verduras', 'Café', 'Hojas', 'Residuos orgánicos'],
    hours: 'Consultar',
    address: 'Consultar (Servicio o Recolección)',
    distance: '--',
    icon: '🌿',
    details: 'Restos de frutas y verduras, café, hojas, residuos orgánicos de hogares, negocios y organizaciones.',
    contact: { whatsapp: '2224607173' },
    link: 'https://lasplantasdebruce.com/?utm_source=chatgpt.com',
    isHomePickup: true,
  },
  {
    id: 2,
    name: 'OOSL - Puebla Capital',
    categoria: 'Orgánicos',
    materials: ['Residuos orgánicos'],
    hours: 'Consultar',
    address: 'Depende del programa vigente / Puebla',
    distance: '--',
    lat: 19.034321064451202, lng: -98.2045021,
    icon: '🌿',
    details: 'Dependiendo del programa vigente, canalizan residuos orgánicos para procesos de compostaje y campañas ambientales.',
    contact: { tel: ['222 309 4400', '222 309 4300'] },
    link: 'https://www.pueblacapital.gob.mx/convocatorias',
  },
  {
    id: 3,
    name: 'Ecorganic',
    categoria: 'Orgánicos',
    materials: ['Residuos orgánicos'],
    hours: 'Consultar',
    address: 'Recolección a domicilio',
    distance: '--',
    icon: '🌿',
    details: 'Empresa que recoge a domicilio residuos orgánicos en botes que ellos proporcionan para regresarlos en tierra. (Se paga el servicio)',
    contact: { whatsapp: '221 657 6754' },
    link: 'https://www.organicpuebla.com/',
    isHomePickup: true,
  },
  {
    id: 4,
    name: 'Green Carson',
    categoria: 'Orgánicos',
    materials: ['Residuos orgánicos'],
    hours: 'Consultar',
    address: 'Recolección a domicilio',
    distance: '--',
    icon: '🌿',
    details: 'Empresa que recoge a domicilio residuos orgánicos en botes que ellos proporcionan para regresarlos en tierra. (Se paga el servicio)',
    contact: { tel: ['8119667900'] },
    isHomePickup: true,
    // Sin link propio confirmado: el PDF cita pasa.mx como referencia de otra
    // empresa (PASA) al hablar de Green Carson, no como su sitio oficial.
  },

  // ── ACEITE ────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'DEA (Depósito Ecológico Ambiental)',
    categoria: 'Aceite',
    materials: ['Residuos de aceite', 'Lubricante gastado', 'Residuos sólidos industriales'],
    hours: 'Consultar',
    address: 'Consultar',
    distance: '--',
    lat: 19.06389728709129, lng: -98.10954940184904,
    icon: '🛢️',
    details: 'Residuos de aceite, lubricante gastado, residuos sólidos industriales.',
    contact: { whatsapp: '2226272498', tel: ['01 (222) 286 62 38'] },
    link: 'https://deambiental.com/',
  },
  {
    id: 6,
    name: 'Convertidora de Aceites Usados',
    categoria: 'Aceite',
    materials: ['Aceite lubricante usado automotriz', 'Aceite lubricante usado industrial'],
    hours: 'Consultar',
    address: 'Autopista Federal Puebla-Orizaba No. 13, Parque Industrial Chachapa, Amozoc',
    distance: '--',
    lat: 19.0527869, lng: -98.1040437,
    icon: '🛢️',
    details: 'Aceite lubricante usado automotriz e industrial para reciclaje y valorización. Recomendable contactarlos en primera instancia.',
    contact: { tel: ['(222) 286 6238'] },
  },
  {
    id: 7,
    name: 'Reciclados Ecológicos de Puebla',
    categoria: 'Aceite',
    materials: ['Aceites usados', 'Residuos de manejo especial'],
    hours: 'Consultar',
    address: 'Carretera Industrial #17 Parque Industrial Chachapa, Puebla. Amozoc, Puebla.',
    distance: '--',
    lat: 19.0524, lng: -98.1035,
    icon: '🛢️',
    details: 'Aceites usados y otros residuos de manejo especial (principalmente mediante convenios con empresas).',
    contact: { tel: ['(222) 268 7102'], email: 'informes@reepsa.com.mx' },
    link: 'https://reepsa.com.mx/',
  },

  // ── MEDICAMENTOS ──────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'EXITIUM',
    categoria: 'Medicamentos',
    materials: ['Medicamentos caducos', 'Residuos peligrosos', 'Residuos especiales'],
    hours: 'Consultar',
    address: 'Priv. 7-A Sur 4933, Col. Prados Agua Azul, Puebla, Pue.',
    distance: '--',
    lat: 19.0293686, lng: -98.2148563,
    icon: '💊',
    details: 'Medicamentos caducos, residuos peligrosos y residuos especiales para disposición final autorizada.',
    contact: { tel: ['(222) 262 2398'] },
    link: 'https://www.exitium.mx/',
  },
  {
    id: 9,
    name: 'SINGREM',
    categoria: 'Medicamentos',
    materials: ['Medicamentos caducos de uso doméstico', 'Tabletas', 'Cápsulas', 'Jarabes', 'Pomadas'],
    hours: 'Consultar',
    address: 'Consulta los puntos de acopio en su sitio web.',
    distance: '--',
    icon: '💊',
    details: 'Medicamentos caducos de uso doméstico (tabletas, cápsulas, jarabes, pomadas, etc.).',
    contact: {},
    link: 'https://www.singrem.org.mx/',
    isMultipleSites: true,
  },
  {
    id: 10,
    name: 'Farmacias (Ahorro, Guadalajara, YZA)',
    categoria: 'Medicamentos',
    materials: ['Medicamentos caducos'],
    hours: 'Consultar',
    address: 'Sucursales participantes',
    distance: '--',
    lat: 19.120012513598862, lng: -98.23952072698653,
    icon: '💊',
    details: 'Medicamentos caducos mediante contenedores de SINGREM instalados en sucursales participantes. Farmacias del Ahorro: 800 711 2222. Farmacias Guadalajara: 800 220 2020. Farmacias YZA: consultar sitio web (yza.mx/sostenibilidad.html).',
    contact: { tel: ['800 711 2222', '800 220 2020'] },
    link: 'https://www.fahorro.com/',
    isMultipleSites: true,
  },
  {
    id: 11,
    name: 'Fundación Cáritas Puebla (Medicamentos)',
    categoria: 'Medicamentos',
    materials: ['Medicamentos no usados o caducados (etiquetados)'],
    hours: 'Consultar',
    address: 'Consultar',
    distance: '--',
    icon: '💊',
    details: 'Pueden recibir medicamentos que no se ocupen o caducados. En caso de medicamentos caducados, etiquetarlos para señalar su condición.',
    contact: { tel: ['222 211 7330'] },
    link: 'https://www.caritaspuebla.org/',
  },

  // ── ROPA ──────────────────────────────────────────────────────────────────
  {
    id: 12,
    name: 'Asilo Particular de Caridad para Ancianos San José María de Yermo y Parres',
    categoria: 'Ropa',
    materials: ['Ropa', 'Cobijas', 'Pañales para adulto', 'Artículos de higiene', 'Alimentos'],
    hours: 'Consultar (Llamar antes)',
    address: 'Consultar',
    distance: '--',
    icon: '👕',
    details: 'Ropa para adultos mayores (limpia y en buen estado), cobijas, pañales para adulto, artículos de higiene, alimentos y donativos económicos. Conviene llamar antes para confirmar necesidades.',
    contact: { tel: ['222 242 2034'] },
    link: 'https://asilodecaridad.org/html/galeria_01.html',
  },
  {
    id: 13,
    name: 'Fundación Cáritas Puebla (Ropa)',
    categoria: 'Ropa',
    materials: ['Ropa', 'Zapatos', 'Cobijas', 'Juguetes', 'Alimentos'],
    hours: 'Consultar',
    address: 'Consultar',
    distance: '--',
    icon: '👕',
    details: 'Ropa, zapatos, cobijas, juguetes, alimentos no perecederos y otros artículos para personas en situación vulnerable.',
    contact: { tel: ['222 211 7330'] },
    link: 'https://www.caritaspuebla.org/',
  },
  {
    id: 14,
    name: 'Casa del Sol',
    categoria: 'Ropa',
    materials: ['Ropa', 'Calzado', 'Juguetes', 'Artículos de uso personal'],
    hours: 'Consultar antes de acudir',
    address: 'Av. del Sol 2910, Reserva Territorial Atlixcáyotl, Concepción la Cruz, 72197 San Bernardino Tlaxcalancingo, Pue.',
    distance: '--',
    lat: 19.031473672077905, lng: -98.2451318,
    icon: '👕',
    details: 'Ropa para niños, jóvenes y familias, además de calzado, juguetes y artículos de uso personal.',
    contact: { tel: ['221 656 8961'] },
    link: 'https://casadelsolpuebla.org/',
  },
  {
    id: 15,
    name: 'AMANC Puebla',
    categoria: 'Ropa',
    materials: ['Ropa'],
    hours: 'Consultar',
    address: 'C. 3 3, San José Vista Hermosa, 72190 Heroica Puebla de Zaragoza, Pue.',
    distance: '--',
    lat: 19.038464439451268, lng: -98.24316298465769,
    icon: '👕',
    details: 'Ropa en buen estado para apoyar a niñas, niños y adolescentes con cáncer y sus familias; también aceptan otros donativos según sus campañas.',
    contact: { tel: ['222 242 2672'] },
    link: 'https://www.amancpuebla.org/',
  },
  {
    id: 16,
    name: 'Donadores Altruistas de Puebla A.C.',
    categoria: 'Ropa',
    materials: ['Ropa', 'Zapatos', 'Cobijas', 'Artículos para bazares'],
    hours: 'Consultar',
    address: 'C. de La Niñez 1007, Reserva Territorial Atlixcáyotl, Concepción la Cruz, 72197 San Bernardino Tlaxcalancingo, Pue.',
    distance: '--',
    lat: 19.03469506419997, lng: -98.24593291349328,
    icon: '👕',
    details: 'Ropa, zapatos, cobijas y artículos para bazares solidarios que benefician a familias de pacientes hospitalizados.',
    contact: { tel: ['222 295 18522'] },
    link: 'https://www.donadoresaltruistas.org/',
  },

  // ── ELECTRÓNICOS ──────────────────────────────────────────────────────────
  {
    id: 17,
    name: 'Salva al mar (UPAEP)',
    categoria: 'Electrónicos',
    materials: ['Electrónicos en buen uso', 'Electrónicos inservibles'],
    hours: 'Dos veces al año (consultar fechas)',
    address: 'UPAEP, Puebla',
    distance: '--',
    icon: '💻',
    details: 'Campaña dos veces al año para recolección de electrónicos en buen uso e inservibles.',
    contact: { tel: ['222 193 8697'] },
    link: 'https://www.facebook.com/salvaalmar/',
  },
  {
    id: 18,
    name: 'Secretaría de Medio Ambiente (SMADSOT) — Puntos Verdes',
    categoria: 'Electrónicos',
    materials: ['Electrónicos', 'Reciclables varios'],
    hours: 'Consultar (jornadas: Reciclatón, Flextival)',
    address: 'Puntos Verdes en la zona Metropolitana',
    distance: '--',
    icon: '💻',
    details: 'Organiza jornadas constantes en la zona Metropolitana. Consulta ubicación de "Puntos Verdes" y eventos como Reciclatón y Flextival en su cuenta oficial.',
    contact: {},
    link: 'https://smadsot.puebla.gob.mx/residuos',
    isMultipleSites: true,
  },
  {
    id: 19,
    name: 'Recicla Electrónica (RECIELEC)',
    categoria: 'Electrónicos',
    materials: ['Computadoras', 'Laptops', 'Celulares', 'Impresoras', 'Cables', 'Módems', 'Teclados', 'Monitores', 'Residuos electrónicos'],
    hours: 'lunes, 9 a.m.–6 p.m.',
    address: 'Primero de Mayo 5, Villa Guadalupe, 72229 Heroica Puebla de Zaragoza, Pue.',
    distance: '--',
    lat: 19.069275511451977, lng: -98.12407565767116,
    icon: '💻',
    details: 'Computadoras, laptops, celulares, impresoras, cables, módems, teclados, monitores y otros residuos electrónicos.',
    contact: { tel: ['221 167 6739'] },
    link: 'https://reciclamexico.com.mx/centros-de-reciclaje/recicla-electronica-recielec/',
  },
  {
    id: 20,
    name: 'Reciclacentro',
    categoria: 'Electrónicos',
    materials: ['Equipos electrónicos', 'Metales', 'Chatarra', 'Residuos reciclables'],
    hours: 'Consultar',
    address: 'Antiguo Camino a La Resurrección 10813, Indios Verdes, 72228 Heroica Puebla de Zaragoza, Pue.',
    distance: '--',
    lat: 19.08647801225997, lng: -98.15691778280862,
    icon: '💻',
    details: 'Equipos electrónicos, metales, chatarra y residuos reciclables.',
    contact: { tel: ['222 271 3022'] },
    link: 'https://reciclamexico.com.mx/centros-de-reciclaje/recicla-electronica-recielec/',
  },
  {
    id: 21,
    name: 'Puntos Limpios del Organismo de Limpia de Puebla',
    categoria: 'Electrónicos',
    materials: ['Electrónicos', 'CPU', 'Teclados', 'Celulares', 'Cables', 'Impresoras', 'Reciclables'],
    hours: 'Consultar',
    address: 'Parque Juárez, Parque Ecológico, Mercado Madero y Walmart Las Ánimas.',
    distance: '--',
    icon: '💻',
    details: 'Electrónicos pequeños y medianos (CPU, teclados, celulares, cables, impresoras, etc.), además de otros reciclables. Pin ubicado en Parque Juárez; consulta el resto de puntos limpios en la ciudad.',
    contact: { tel: ['222 409 0636'] },
    isMultipleSites: true,
  },
  {
    id: 22,
    name: 'Reciclajes Talismán',
    categoria: 'Electrónicos',
    materials: ['Electrónicos', 'Metales', 'Materiales reciclables'],
    hours: 'Consultar',
    address: 'Consultar',
    distance: '--',
    icon: '💻',
    details: 'Electrónicos, metales y otros materiales reciclables (conviene llamar para confirmar el tipo de equipo).',
    contact: { tel: ['222 224 4905'] },
    link: 'https://reciclamexico.com.mx/centros-de-reciclaje/recicla-electronica-recielec/',
    isMultipleSites: true,
  },

  // ── ESCUELAS ──────────────────────────────────────────────────────────────
  {
    id: 23,
    name: 'UPAEP',
    categoria: 'Escuelas',
    materials: ['PET', 'Cartón', 'Papel', 'Vidrio', 'Aluminio', 'Envases de Tetra Pak', 'Tapitas'],
    hours: 'Consultar',
    address: 'Calle 21 Sur 1103, Barrio de Santiago, Puebla, Pue.',
    distance: '--',
    lat: 19.0485386, lng: -98.2166069,
    icon: '🏫',
    details: 'PET, cartón, papel, vidrio, aluminio y envases de Tetra Pak. Campaña permanente de tapitas.',
    contact: { tel: ['222 229 9400'] },
    link: 'https://upaep.mx',
  },
  {
    id: 24,
    name: 'Facultad de Ciencias de la Electrónica BUAP',
    categoria: 'Escuelas',
    materials: ['Residuos electrónicos', 'Cables', 'Computadoras viejas', 'Teclados', 'Tarjetas madre', 'Monitores'],
    hours: 'Consultar',
    address: 'Av. San Claudio y 18 Sur, Ciudad Universitaria, Col. San Manuel, Puebla, Pue.',
    distance: '--',
    lat: 18.9998493, lng: -98.1991511,
    icon: '🏫',
    details: 'Residuos electrónicos (cables, computadoras viejas, teclados, tarjetas madre, monitores, etc.).',
    contact: { tel: ['222 229 5500 Ext. 7400'] },
    link: 'https://electronica.buap.mx',
  },
  {
    id: 25,
    name: 'Escuela de Enfermería de la Cruz Roja Mexicana',
    categoria: 'Escuelas',
    materials: ['Papel', 'Cartón', 'Libros viejos', 'Archivos muertos', 'PET'],
    hours: 'Consultar',
    address: 'Av. 20 Oriente 1001, Centro, Puebla, Pue.',
    distance: '--',
    lat: 19.0481484, lng: -98.1878593,
    icon: '🏫',
    details: 'Papel, cartón, libros viejos, archivos muertos y PET.',
    contact: { tel: ['222 213 7700', '222 235 8786'] },
    link: 'https://cruzrojapuebla.org',
  },
  {
    id: 26,
    name: 'Instituto Cultural Alemán',
    categoria: 'Escuelas',
    materials: ['PET', 'Cartón'],
    hours: 'Consultar',
    address: 'Calle 5 Poniente 1303, Centro, Puebla, Pue.',
    distance: '--',
    lat: 19.0451204, lng: -98.2047549,
    icon: '🏫',
    details: 'PET y Cartón. Cuentan con contenedores accesibles en sus instalaciones.',
    contact: { tel: ['222 211 6050'] },
    link: 'https://correoaleman.edu.mx',
  },
  {
    id: 27,
    name: 'Planteles COBAEP',
    categoria: 'Escuelas',
    materials: ['Latas de aluminio'],
    hours: 'Consultar',
    address: 'Planteles 1, 2 y 3 en Puebla Capital.',
    distance: '--',
    icon: '🏫',
    details: 'Latas de aluminio. Programa de recolección interna y comunitaria.',
    contact: { tel: ['222 211 4660'] },
    link: 'https://cobaep.edu.mx',
    isMultipleSites: true,
  },
  {
    id: 28,
    name: 'Ludoteca de la SEP Puebla',
    categoria: 'Escuelas',
    materials: ['Útiles escolares usados', 'Cuadernos', 'Hojas', 'Lápices', 'Papel', 'Cartón'],
    hours: 'Consultar',
    address: 'Av. Jesús Reyes Heroles S/N, Col. Nueva Antequera, Puebla, Pue.',
    distance: '--',
    lat: 19.0740307, lng: -98.2110685,
    icon: '🏫',
    details: 'Útiles escolares usados (cuadernos a medio usar, hojas, lápices), además de papel y cartón.',
    contact: { tel: ['222 229 6900'] },
    link: 'https://sep.puebla.gob.mx',
  },
  {
    id: 29,
    name: 'Reciclim',
    categoria: 'Escuelas',
    materials: ['PET', 'Cartón', 'Metales', 'Envases de Tetra Pak'],
    hours: 'Consultar',
    address: 'Calle 48 norte N°1824, Joaquín Colombres, Puebla, Pue.',
    distance: '--',
    icon: '🏫',
    details: 'Reciben PET, cartón, metales y Tetra Pak.',
    contact: {},
    link: 'https://www.facebook.com/ecolanamx/videos/1022879786585978/',
  },
];

// ─── Talleres / Pláticas / Cursos ───────────────────────────────────────────

export const talleresData: Taller[] = [
  {
    id: 1,
    nombre: 'Talleres de Reciclado y Aprovechamiento de Residuos Sólidos Urbanos (RSU)',
    institucion: 'Organismo Operador del Servicio de Limpia del Municipio de Puebla (OOSLMP)',
    escuelasDondeAplica: 'Escuelas de educación básica y media, como la Primaria Rafael Molina Betancourt, Primaria Gonzalo Bautista Castillo y Bachillerato Guillermo Haro.',
    ubicacionDependencia: 'Blvd. Capitán Carlos Camacho Espíritu 237, Zona Sin Asignación de Nombre de Col 49, Bugambilias, 72580 Heroica Puebla de Zaragoza, Pue.',
    tel: ['222 573 9273'],
    link: 'https://pueblacapital.gob.mx',
    icon: '📋',
  },
  {
    id: 2,
    nombre: 'Manejo Integral de Residuos y Consumo Responsable',
    institucion: 'Secretaría de Medio Ambiente, Desarrollo Sustentable y Ordenamiento Territorial (SMADSOT)',
    escuelasDondeAplica: 'Dirigido a estudiantes de nivel básico (kínder, primaria, secundaria) y nivel superior de la capital.',
    ubicacionDependencia: 'Calle Lateral Recta Cholula Km. 5.5 No.2401, 72805 San Andrés Cholula, Pue.',
    tel: ['222 273 6800'],
    link: 'https://smadsot.puebla.gob.mx',
    icon: '📋',
  },
  {
    id: 3,
    nombre: 'Capacitación de Manejo Integral, Caracterización de Residuos y Regla de las 7Rs',
    institucion: 'Secretaría de Medio Ambiente y Recursos Naturales (SEMARNAT) / Convenio Río Atoyac',
    escuelasDondeAplica: 'Escuelas Secundarias Generales de la capital, como la Secundaria General No. 13 "Ignacio Manuel Altamirano".',
    ubicacionDependencia: 'Calle 3 Poniente 2926, Col. La Paz, Puebla, Pue.',
    tel: ['222 249 7622'],
    link: 'https://gob.mx/semarnat',
    icon: '📋',
  },
  {
    id: 4,
    nombre: 'Estrategia de Reciclaje Sustentable (Convenio FlexSportA)',
    institucion: 'Colegio de Bachilleres del Estado de Puebla (COBAEP)',
    escuelasDondeAplica: 'Aplicado internamente en los planteles de Puebla Capital (Plantel 1 San Jerónimo, Plantel 2 Amalucan, Plantel 3, etc.).',
    ubicacionDependencia: 'Av. 11 Poniente 1104, Col. Centro, Puebla, Pue.',
    tel: ['222 211 4660'],
    link: 'https://cobaep.edu.mx',
    icon: '📋',
  },
];

// ─── Cómo solicitar pláticas para una escuela (texto de referencia del PDF) ─
export const comoSolicitarPlaticas = [
  {
    via: 'OOSLMP (Municipio de Puebla)',
    descripcion: 'Cualquier director de escuela o comité de padres de familia de Puebla Capital puede meter un oficio formal dirigido al Organismo de Limpia solicitando los "Talleres de Reciclado en Escuelas". Ellos agendan la fecha y asisten con material lúdico para los niños sin costo.',
  },
  {
    via: 'SMADSOT (Gobierno del Estado)',
    descripcion: 'A través de la Dirección de Educación Ambiental, la secretaría estatal cuenta con un catálogo permanente de pláticas (enfocadas en separación, biofiltros y consumo sustentable) que se solicitan mediante oficio institucional.',
  },
];

export function isTaller(item: unknown): item is Taller {
  return !!item && typeof item === 'object' && 'escuelasDondeAplica' in item;
}