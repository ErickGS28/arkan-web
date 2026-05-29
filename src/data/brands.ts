export interface Category {
  name: string;
  description: string;
  images: string[];
}

export interface Brand {
  id: 'aruba' | 'bakari' | 'black-bash';
  name: string;
  logoSrc: string;
  tagline: string;
  slug: string;
  statement: {
    heading: string;
    tag: string;
    paragraphs: string[];
    features?: string[];
    ngu?: string;
    gridCols: string;
  };
  categories: Category[];
  cta: {
    heading: string;
    subheading?: string;
    detail?: string;
    body: string;
    waLink: string;
  };
  instagramUrl: string;
  footerLinks: { href: string; label: string }[];
}

const aruba: Brand = {
  id: 'aruba',
  name: 'ARUBA JEANS',
  logoSrc: '/logos/aruba.jpg',
  tagline: 'The best jeans for your body',
  slug: '/aruba',
  statement: {
    heading: 'THE BEST<br/>JEANS FOR<br/>YOUR BODY',
    tag: 'Identidad de Marca',
    paragraphs: [
      'Aruba Jeans nació con una misión clara: crear el jean definitivo para la mujer latinoamericana. Cada corte está diseñado para adaptarse a la figura real, resaltando lo que la mujer quiere resaltar sin sacrificar la comodidad.',
      'Denim colombiano de alta calidad. Costuras reforzadas. Telas con elasticidad controlada que mantienen la forma después de múltiples lavados. Una marca que el mercado femenino reconoce y busca activamente.',
      'Ideal para boutiques, tiendas de moda femenina y revendedoras enfocadas en un segmento de consumidora consciente y exigente.',
    ],
    gridCols: '1.2fr 1fr',
  },
  categories: [
    {
      name: 'Skinny Fit',
      description: 'Corte ajustado que moldea la silueta. Denim stretch colombiano con alta recuperación, ideal para uso diario.',
      images: ['/img/aruba/01.png', '/img/aruba/02.png'],
    },
    {
      name: 'Mom Jeans',
      description: 'Cintura alta, corte holgado en cadera y pierna recta. La combinación perfecta de comodidad y estilo contemporáneo.',
      images: ['/img/aruba/03.png', '/img/aruba/04.png'],
    },
    {
      name: 'Wide Leg',
      description: 'Pierna ancha y fluida con caída perfecta. Diseñado para resaltar la silueta con un toque editorial y moderno.',
      images: ['/img/aruba/05.png', '/img/aruba/06.png'],
    },
  ],
  cta: {
    heading: 'DISTRIBUYE<br/>ARUBA JEANS',
    subheading: 'MAYOREO NACIONAL',
    body: 'Conviértete en distribuidor autorizado. Precios de mayoreo, soporte de marca y catálogo completo para tu negocio.',
    waLink: 'https://wa.me/525564991943?text=' + encodeURIComponent('Hola, quiero información para distribuir Aruba Jeans.'),
  },
  instagramUrl: 'https://www.instagram.com/arubajns/',
  footerLinks: [
    { href: '/', label: 'Arkán Group' },
    { href: '/bakari', label: 'Bakari' },
    { href: '/black-bash', label: 'Black Bash' },
  ],
};

const bakari: Brand = {
  id: 'bakari',
  name: 'BKR BAKARI',
  logoSrc: '/logos/bakari.jpg',
  tagline: 'Basic & Fit Denim Stretch Comfort',
  slug: '/bakari',
  statement: {
    heading: 'BASIC.<br/>FIT.<br/>COMFORT.',
    tag: 'Identidad de Marca',
    paragraphs: [
      'Bakari es la línea que domina el volumen. Diseñada para el cliente cotidiano que busca calidad sin complicaciones: un jean que entra bien, que dura, que se lava sin perder forma.',
      'Stretch de alto desempeño. Cortes neutros y versátiles. Una paleta de colores calculada para maximizar la rotación en punto de venta. BKR Bakari es el producto que vende todos los días.',
    ],
    features: [
      'Tela stretch de alta recuperación',
      'Costuras reforzadas de 5 bolsillos',
      'Tallas amplias — cobertura total del mercado',
      'Precio mayoreo competitivo',
    ],
    gridCols: '1.1fr 1fr',
  },
  categories: [
    {
      name: 'Straight Fit',
      description: 'El corte más vendido del mercado masculino. Pierna recta, perfil limpio. Funciona para cualquier ocasión y tipo de cuerpo.',
      images: ['/img/bakari/01.png', '/img/bakari/02.png'],
    },
    {
      name: 'Slim Fit',
      description: 'Corte entallado sin restricción de movimiento gracias al stretch de alta recuperación. Define la silueta masculina moderna.',
      images: ['/img/bakari/03.png', '/img/bakari/04.png'],
    },
    {
      name: 'Relaxed Fit',
      description: 'Holgura estratégica en cadera y muslo con ligero taper en tobillo. Comodidad máxima con perfil actualizado.',
      images: ['/img/bakari/05.png', '/img/bakari/06.png'],
    },
  ],
  cta: {
    heading: 'DISTRIBUYE<br/>BKR BAKARI',
    subheading: 'MAYOREO NACIONAL',
    body: 'El jean que vende todos los días. Únete a nuestra red de distribuidores y lleva Bakari a tu punto de venta.',
    waLink: 'https://wa.me/525564991943?text=' + encodeURIComponent('Hola, quiero información para distribuir BKR Bakari.'),
  },
  instagramUrl: 'https://www.instagram.com/bakarijeans/',
  footerLinks: [
    { href: '/', label: 'Arkán Group' },
    { href: '/aruba', label: 'Aruba' },
    { href: '/black-bash', label: 'Black Bash' },
  ],
};

const blackBash: Brand = {
  id: 'black-bash',
  name: 'BLACK BASH MX',
  logoSrc: '/logos/black-bash.jpg',
  tagline: 'Never Give Up',
  slug: '/black-bash',
  statement: {
    heading: 'NEVER<br/>GIVE<br/>UP.',
    tag: 'Never Give Up · Identidad',
    paragraphs: [
      'Black Bash MX no es solo una marca de denim. Es una declaración. Para el cliente urbano que construye su identidad con lo que viste, que no sigue tendencias, que las crea.',
      'Cada pieza fue diseñada con actitud: cortes con carácter, acabados que resisten, un lenguaje visual que conecta con la cultura de calle. Una marca que genera lealtad real porque el cliente se identifica con lo que representa.',
      'Para el distribuidor, eso se traduce en recompra orgánica y clientela fidelizada. No vendes un jean. Vendes una mentalidad.',
    ],
    ngu: 'NEVER GIVE UP.',
    gridCols: '1.2fr 1fr',
  },
  categories: [
    {
      name: 'Playeras',
      description: 'Gráficas con actitud, telas de peso medio y cortes que no pierden forma. Diseñadas para comunicar antes de que el cliente diga una palabra.',
      images: ['/img/black-bash/01.png', '/img/black-bash/02.png'],
    },
    {
      name: 'Pantalones',
      description: 'Denim con carácter: lavados agresivos, cortes urbanos y acabados que resisten el uso real. El jean que elige quien sabe lo que quiere.',
      images: ['/img/black-bash/03.png', '/img/black-bash/04.png'],
    },
    {
      name: 'Gorras',
      description: 'Accesorios que completan el look. Bordados, estampados y materiales seleccionados para mantener la identidad visual de la marca en cada pieza.',
      images: ['/img/black-bash/05.png', '/img/black-bash/06.png'],
    },
  ],
  cta: {
    heading: 'DISTRIBUYE<br/>BLACK BASH MX',
    subheading: 'NEVER GIVE UP',
    body: 'Una marca que genera lealtad real. Sé parte de la red de distribución y lleva Black Bash a tu mercado.',
    waLink: 'https://wa.me/525564991943?text=' + encodeURIComponent('Hola, quiero información para distribuir Black Bash MX.'),
  },
  instagramUrl: 'https://www.instagram.com/blackbashmx/',
  footerLinks: [
    { href: '/', label: 'Arkán Group' },
    { href: '/aruba', label: 'Aruba' },
    { href: '/bakari', label: 'Bakari' },
  ],
};

export const brands: Brand[] = [aruba, bakari, blackBash];
export const getBrand = (id: string): Brand | undefined =>
  brands.find((b) => b.id === id);
