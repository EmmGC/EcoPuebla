// ─── Interfaces ───────────────────────────────────────────────────────────────

export type Categoria =
  | 'Orgánicos'
  | 'Aceite'
  | 'Medicamentos'
  | 'Ropa'
  | 'Electrónicos'
  | 'Escuelas';

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
  },
  {
    id: 2,
    name: 'OOSL - Puebla Capital',
    categoria: 'Orgánicos',
    materials: ['Residuos orgánicos'],
    hours: 'Consultar',
    address: 'Depende del programa vigente / Puebla',
    distance: '--',
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
    contact: {},
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
  },
  {
    id: 10,
    name: 'Farmacias (Ahorro, Guadalajara, YZA)',
    categoria: 'Medicamentos',
    materials: ['Medicamentos caducos'],
    hours: 'Consultar',
    address: 'Sucursales participantes',
    distance: '--',
    icon: '💊',
    details: 'Medicamentos caducos mediante contenedores de SINGREM instalados en sucursales participantes.',
    contact: {},
  },

  // ── ROPA ──────────────────────────────────────────────────────────────────
  {
    id: 13,
    name: 'Asilo Particular de Caridad / Cáritas Puebla',
    categoria: 'Ropa',
    materials: ['Ropa', 'Zapatos', 'Cobijas', 'Pañales para adulto', 'Artículos de higiene', 'Alimentos', 'Juguetes'],
    hours: 'Consultar (Llamar antes)',
    address: 'Consultar',
    distance: '--',
    icon: '👕',
    details: 'Ropa para adultos mayores, cobijas, pañales para adulto, artículos de higiene, alimentos, zapatos y juguetes.',
    contact: { tel: ['222 242 2034', '222 211 7330'] },
    link: 'https://www.caritaspuebla.org/',
  },
  {
    id: 14,
    name: 'Casa del Sol',
    categoria: 'Ropa',
    materials: ['Ropa', 'Calzado', 'Juguetes', 'Artículos de uso personal'],
    hours: 'Consultar antes de acudir',
    address: 'Consultar',
    distance: '--',
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
    address: 'Consultar',
    distance: '--',
    icon: '👕',
    details: 'Ropa en buen estado para apoyar a niñas, niños y adolescentes con cáncer y sus familias.',
    contact: { tel: ['222 242 2672'] },
    link: 'https://www.amancpuebla.org/',
  },
  {
    id: 16,
    name: 'Donadores Altruistas de Puebla A.C.',
    categoria: 'Ropa',
    materials: ['Ropa', 'Zapatos', 'Cobijas', 'Artículos para bazares'],
    hours: 'Consultar',
    address: 'Consultar',
    distance: '--',
    icon: '👕',
    details: 'Ropa, zapatos, cobijas y artículos para bazares solidarios.',
    contact: { tel: ['222 295 18522'] },
    link: 'https://www.donadoresaltruistas.org/',
  },

  // ── ELECTRÓNICOS ──────────────────────────────────────────────────────────
  {
    id: 19,
    name: 'Recicla Electrónica (RECIELEC)',
    categoria: 'Electrónicos',
    materials: ['Computadoras', 'Laptops', 'Celulares', 'Impresoras', 'Cables', 'Módems', 'Teclados', 'Monitores', 'Residuos electrónicos'],
    hours: 'Consultar',
    address: 'Consultar',
    distance: '--',
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
    address: 'Consultar',
    distance: '--',
    icon: '💻',
    details: 'Equipos electrónicos, metales, chatarra and residuos reciclables.',
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
    lat: 19.0288041, lng: -98.2042630,
    icon: '💻',
    details: 'Electrónicos pequeños y medianos (CPU, teclados, celulares, cables, impresoras, etc.), además de otros reciclables. Pin ubicado en Parque Juárez; consulta el resto de puntos limpios en la ciudad.',
    contact: { tel: ['222 409 0636'] },
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
    details: 'Electrónicos, metales y otros materiales reciclables.',
    contact: { tel: ['222 224 4905'] },
    link: 'https://reciclamexico.com.mx/centros-de-reciclaje/recicla-electronica-recielec/',
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
    address: 'Av. 20 Oriente 1001, Centro. Puebla, Pue.',
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
];
