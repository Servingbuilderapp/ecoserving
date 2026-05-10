export type SubSectionType = 'text' | 'alert' | 'highlight' | 'list';

export type MethodologySubSection = {
  id: string;
  title: string;
  content: string;
  type?: SubSectionType;
};

export type MethodologySection = {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  category: 'Introducción' | 'Pilares' | 'UCAMs' | 'MRV' | 'Sello' | 'Alcances';
  subsections: MethodologySubSection[];
};

export const ucamMethodologyData: MethodologySection[] = [
  {
    id: "intro-ucam",
    title: "¿Qué es UCAM CERT SIIA?",
    shortDesc: "Sistema Internacional de Integridad Ambiental",
    icon: "🌍",
    category: "Introducción",
    subsections: [
      {
        id: "intro-def",
        title: "Definición Global",
        content: "UCAM CERT SIIA es un sistema global de certificación, gestión y contabilidad ambiental multihuella, diseñado para medir, verificar, registrar y transformar los impactos ambientales en activos verificables, trazables e integrables dentro de la economía real.",
        type: "highlight"
      },
      {
        id: "intro-transform",
        title: "Transformaciones, no intenciones",
        content: "UCAM CERT SIIA certifica transformaciones verificadas. No declaraciones de intención, no compromisos futuros: impacto real, medido, auditado y trazado con evidencia.",
        type: "text"
      },
      {
        id: "intro-dimension",
        title: "Dimensiones del Impacto",
        content: "1. Dimensión ambiental: el impacto sobre ecosistemas y huellas medibles.\n2. Dimensión sanitaria: la exposición humana a contaminantes.\n3. Dimensión económica: integración del impacto como activo verificable.",
        type: "list"
      }
    ]
  },
  {
    id: "pilar-1",
    title: "Pilar 1: Impacto Ambiental Multihuella",
    shortDesc: "Evaluación sistémica e integral de todas las huellas",
    icon: "🎯",
    category: "Pilares",
    subsections: [
      {
        id: "p1-func",
        title: "Función",
        content: "Identificar y medir de forma sistemática todas las huellas ambientales que genera el actor evaluado, considerando los tres alcances de cada huella. Es el diagnóstico base.",
        type: "text"
      },
      {
        id: "p1-dim",
        title: "Dimensiones Evaluadas",
        content: "Huella de Carbono, Huella Plástica, Huella Hídrica, Huella Química, Huella Energética, Servicios Ecosistémicos y Educación Ambiental.",
        type: "highlight"
      }
    ]
  },
  {
    id: "pilar-2",
    title: "Pilar 2: Salud Ambiental y Química",
    shortDesc: "Impacto de contaminantes sobre la salud humana",
    icon: "🧬",
    category: "Pilares",
    subsections: [
      {
        id: "p2-func",
        title: "Función",
        content: "Evaluar la presencia, exposición y gestión de contaminantes químicos en los procesos, con especial atención a aquellos con efectos sobre la salud humana y ecosistemas.",
        type: "text"
      },
      {
        id: "p2-import",
        title: "¿Por qué importa?",
        content: "El impacto ambiental se traduce en exposición humana real. La evidencia confirma que la exposición a químicos persistentes ocurre a través de la cadena alimentaria y productos cotidianos.",
        type: "alert"
      }
    ]
  },
  {
    id: "pilar-3",
    title: "Pilar 3: Gestión y Transformación",
    shortDesc: "Acciones concretas con horizonte Cero Vertedero",
    icon: "🔄",
    category: "Pilares",
    subsections: [
      {
        id: "p3-func",
        title: "Horizonte Cero Disposición",
        content: "Estructurar el plan de transformación con acciones verificables. El principio rector es Cero Disposición Final de Residuos en Vertederos (CDFRV). Un residuo en vertedero es un recurso no valorizado.",
        type: "highlight"
      }
    ]
  },
  {
    id: "pilar-4",
    title: "Pilar 4: Contabilidad Ambiental",
    shortDesc: "El impacto como activo verificable",
    icon: "📊",
    category: "Pilares",
    subsections: [
      {
        id: "p4-func",
        title: "El Cambio de Lógica",
        content: "Convierte el impacto (históricamente tratado como externalidad) en un activo verificable que incide en decisiones de inversión, operación y reporte.",
        type: "text"
      }
    ]
  },
  {
    id: "pilar-5",
    title: "Pilar 5: MRV y Trazabilidad CUV",
    shortDesc: "Garantía de credibilidad e independencia",
    icon: "🔍",
    category: "Pilares",
    subsections: [
      {
        id: "p5-func",
        title: "Independencia Operativa",
        content: "Garantizar que todo impacto sea Medible, Reportable y Verificable. Cada acción genera un CUV inalterable. Separa estructuralmente ejecución, verificación y validación.",
        type: "highlight"
      }
    ]
  },
  {
    id: "pilar-6",
    title: "Pilar 6: Gobernanza y Cumplimiento",
    shortDesc: "Integración institucional del impacto",
    icon: "⚖️",
    category: "Pilares",
    subsections: [
      {
        id: "p6-func",
        title: "Regulación Emergente",
        content: "Asegura la integración en la estructura institucional y marcos regulatorios (CSRD, CBAM, Taxonomía Verde). El panorama global avanza hacia la exigencia de impacto verificable como condición de acceso a mercados.",
        type: "text"
      }
    ]
  },
  {
    id: "pilar-7",
    title: "Pilar 7: Implementación y Proyectos",
    shortDesc: "Ejecución real del impacto en territorio",
    icon: "🏗️",
    category: "Pilares",
    subsections: [
      {
        id: "p7-func",
        title: "El PDD como Instrumento",
        content: "Estructurar y ejecutar proyectos ambientales que materializan las transformaciones. Todo proyecto se documenta en un Project Design Document (PDD) de 14 secciones estandarizadas.",
        type: "text"
      }
    ]
  },
  // UCAMs
  {
    id: "ucam-hpr",
    title: "UCAM HPR: Huella Plástica Recuperador",
    shortDesc: "1.000 kg de plástico recuperado",
    icon: "♻️",
    category: "UCAMs",
    subsections: [
      {
        id: "uhpr-func",
        title: "Unidad Funcional",
        content: "1 UCAM HPR = 1.000 kg de residuos plásticos post-consumo recuperados, acopiados y entregados a un operador formal de valorización.",
        type: "highlight"
      },
      {
        id: "uhpr-cert",
        title: "¿Qué certifica?",
        content: "La recuperación estructurada mediante recolección selectiva, clasificación y acopio controlado (Alcance 3).",
        type: "text"
      }
    ]
  },
  {
    id: "ucam-hp",
    title: "UCAM HP: Huella Plástica Valorización",
    shortDesc: "250 kg de plástico valorizado en planta",
    icon: "🏭",
    category: "UCAMs",
    subsections: [
      {
        id: "uhp-func",
        title: "Unidad Funcional",
        content: "1 UCAM HP = 250 kg de residuos plásticos procesados efectivamente en planta certificada (reciclaje, pirólisis).",
        type: "highlight"
      },
      {
        id: "uhp-diff",
        title: "Diferencia con HPR",
        content: "HPR certifica recuperación. HP certifica el procesamiento efectivo en planta. Son etapas consecutivas de la cadena de valor.",
        type: "alert"
      }
    ]
  },
  {
    id: "ucam-hc",
    title: "UCAM HC: Huella de Carbono",
    shortDesc: "1 tCO₂e reducida o capturada",
    icon: "☁️",
    category: "UCAMs",
    subsections: [
      {
        id: "uhc-func",
        title: "Unidad Funcional",
        content: "1 UCAM HC = 1 tonelada de CO₂ equivalente reducida, sustituida o capturada y verificada bajo MRV en los tres alcances.",
        type: "highlight"
      }
    ]
  },
  {
    id: "ucam-hh",
    title: "UCAM HH: Huella Hídrica",
    shortDesc: "10.000 litros de agua gestionada",
    icon: "💧",
    category: "UCAMs",
    subsections: [
      {
        id: "uhh-func",
        title: "Unidad Funcional",
        content: "1 UCAM HH = 10.000 litros de agua gestionada verificablemente mediante ahorro, tratamiento, reutilización o restauración.",
        type: "highlight"
      }
    ]
  },
  {
    id: "ucam-ce",
    title: "UCAM CE: Circularidad Energética",
    shortDesc: "Energía limpia, eficiencia y sustitución",
    icon: "⚡",
    category: "UCAMs",
    subsections: [
      {
        id: "uce-func",
        title: "Unidad Funcional Variable",
        content: "1 UCAM CE varía según la modalidad (kWh generado, kWh ahorrado, o equivalente tCO₂e por sustitución) según el Protocolo PTV-CE-01.",
        type: "highlight"
      }
    ]
  },
  {
    id: "ucam-se",
    title: "UCAM SE: Servicios Ecosistémicos",
    shortDesc: "1 hectárea/año de ecosistema conservado",
    icon: "🌳",
    category: "UCAMs",
    subsections: [
      {
        id: "use-func",
        title: "Unidad Funcional",
        content: "1 UCAM SE = 1 hectárea/año de ecosistema nativo conservado, restaurado o gestionado de forma verificable.",
        type: "highlight"
      }
    ]
  },
  {
    id: "ucam-ed",
    title: "UCAM ED: Educación Ambiental",
    shortDesc: "1 actividad educativa verificada",
    icon: "📚",
    category: "UCAMs",
    subsections: [
      {
        id: "ued-func",
        title: "Unidad Funcional",
        content: "1 UCAM ED = 1 actividad de educación ambiental verificada bajo MRV, con audiencia definida y evidencia de impacto.",
        type: "highlight"
      }
    ]
  },
  // MRV
  {
    id: "mrv-system",
    title: "Sistema MRV",
    shortDesc: "Medible, Reportable y Verificable",
    icon: "✅",
    category: "MRV",
    subsections: [
      {
        id: "mrv-m",
        title: "M - Medible",
        content: "El impacto es cuantificable mediante variables técnicas, instrumentos validados y criterio conservador.",
        type: "text"
      },
      {
        id: "mrv-r",
        title: "R - Reportable",
        content: "Documentado de forma estructurada y auditable en el Project Design Document (PDD) de 14 secciones.",
        type: "text"
      },
      {
        id: "mrv-v",
        title: "V - Verificable",
        content: "Auditado en dos instancias: interna por EVA acreditada y externa por verificador independiente. Validado por Comité Técnico.",
        type: "highlight"
      }
    ]
  },
  {
    id: "cuv",
    title: "CUV: Código Único de Verificación",
    shortDesc: "Identificador individual inalterable",
    icon: "🔐",
    category: "MRV",
    subsections: [
      {
        id: "cuv-def",
        title: "Identidad Inalterable",
        content: "Es la firma técnica del sistema. Ningún actor puede modificar un CUV emitido (solo transferir o retirar). Opera bajo infraestructura blockchain con integridad criptográfica.",
        type: "highlight"
      },
      {
        id: "cuv-struct",
        title: "Estructura del CUV",
        content: "Ejemplo: UCAM-HPR-SALARG-2026-SANCA001\n(Sistema)-(Tipo UCAM)-(Geografía)-(Año)-(Lote)",
        type: "text"
      }
    ]
  },
  // Alcances
  {
    id: "alcance-1",
    title: "Alcance 1: Impacto Directo",
    shortDesc: "Bajo control de la organización",
    icon: "🏭",
    category: "Alcances",
    subsections: [
      {
        id: "a1-def",
        title: "Definición",
        content: "Impactos generados directamente por las actividades que la organización controla: instalaciones, procesos productivos, flota propia.",
        type: "text"
      }
    ]
  },
  {
    id: "alcance-2",
    title: "Alcance 2: Indirecto Energético",
    shortDesc: "Asociado a la energía adquirida",
    icon: "🔌",
    category: "Alcances",
    subsections: [
      {
        id: "a2-def",
        title: "Definición",
        content: "Impactos de la energía que la organización consume pero no genera: electricidad de la red, vapor, calefacción.",
        type: "text"
      }
    ]
  },
  {
    id: "alcance-3",
    title: "Alcance 3: Cadena de Valor",
    shortDesc: "El mayor impacto (proveedores a fin de vida)",
    icon: "🌐",
    category: "Alcances",
    subsections: [
      {
        id: "a3-def",
        title: "Definición",
        content: "Impactos indirectos de toda la cadena hacia atrás (proveedores) y hacia adelante (uso y disposición del producto). Representa a menudo entre el 70% y 90% del impacto total.",
        type: "highlight"
      }
    ]
  },
  // Sello A+
  {
    id: "sello-a",
    title: "Sello A+ CERT",
    shortDesc: "Reconocimiento institucional verificado",
    icon: "🎖️",
    category: "Sello",
    subsections: [
      {
        id: "sello-l1",
        title: "Nivel 1: Inicio",
        content: "Diagnóstico completo de huellas aplicables (Alcance 1 y 2 medidos, Alcance 3 identificado). Punto de partida documentado.",
        type: "text"
      },
      {
        id: "sello-l2",
        title: "Nivel 2: Verificado",
        content: "Implementación de acciones y adquisición de UCAMs para compensar huellas prioritarias.",
        type: "text"
      },
      {
        id: "sello-l3",
        title: "Nivel 3: Equilibrado",
        content: "Impacto residual compensado al 100% en todas las huellas aplicables (los 3 alcances). Equilibrio ambiental verificable.",
        type: "highlight"
      },
      {
        id: "sello-l4",
        title: "Nivel 4: Pleno",
        content: "Impacto neto positivo. El actor devuelve más al sistema de lo que impacta. Transformación sistémica en toda la cadena de valor.",
        type: "highlight"
      }
    ]
  }
];
