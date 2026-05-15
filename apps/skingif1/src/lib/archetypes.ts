export interface Archetype {
  id: string;
  name: string;
  label: string;
  description: string;
  dermatological_explanation: string;
  common_traits: string;
  suggested_scores: {
    barrera: number;
    glow: number;
    estres: number; // For the visual "Stress Res." or similar
    resiliencia: number;
  };
  visual_aesthetics: {
    colors: string[];
    mood: string;
  };
  suggested_content: string;
  emotional_problem_solved: string;
}

export const ARCHETYPES: Record<string, Archetype> = {
  "barrier_guardian": {
    id: "barrier_guardian",
    name: "Barrier Guardian",
    label: "The Resilient Protector",
    description: "Eres la definición de estabilidad. Mientras otros persiguen tendencias, tú has construido una fortaleza de calma y resistencia que nada puede perturbar.",
    dermatological_explanation: "Representa una barrera cutánea sana y optimizada. Existe un equilibrio perfecto en la producción de lípidos (ceramidas) y una baja tasa de pérdida de agua transepidérmica (TEWL).",
    common_traits: "Textura uniforme, ausencia de rojeces, tolerancia alta a cambios climáticos y una rutina enfocada en la protección.",
    suggested_scores: { barrera: 95, glow: 72, estres: 94, resiliencia: 85 }, // Extracted from Matrix (Glow 72, Barrier 95, Stress Res 94, Recovery/Resilience 85)
    visual_aesthetics: { colors: ["#879F84", "#D2B48C"], mood: "Minimalista, estructurado, quiet luxury" },
    suggested_content: "Rutinas AM minimalistas, guías de 'slow aging', e ingredientes como ectoína y ceramidas.",
    emotional_problem_solved: "Inseguridad sobre la fragilidad de la piel y el agobio por rutinas de 10 pasos."
  },
  "glow_seeker": {
    id: "glow_seeker",
    name: "Glow Seeker",
    label: "The Luminous Visionary",
    description: "Tu piel tiene su propia luz interna. No solo brillas; proyectas una energía vibrante que dice 'estoy viviendo mi mejor momento'.",
    dermatological_explanation: "Representa una alta tasa de renovación celular y una superficie cutánea lisa que maximiza la reflexión de la luz (efecto Tyndall). Es la culminación de una hidratación profunda y un microbioma equilibrado.",
    common_traits: "Piel de porcelana, poros casi invisibles, uso estratégico de antioxidantes y una luminosidad 'desde adentro'.",
    suggested_scores: { barrera: 82, glow: 98, estres: 75, resiliencia: 80 },
    visual_aesthetics: { colors: ["#FFD700", "#FFB6C1"], mood: "Gradientes holográficos, luces neón suaves, estética glass skin 2.0" },
    suggested_content: "Glass skin tutorials, uso de vitamina C y péptidos, contenido estético tipo 'clean girl'.",
    emotional_problem_solved: "Deseo de vitalidad y búsqueda de estatus visual a través de la salud cutánea."
  },
  "overworked_glow": {
    id: "overworked_glow",
    name: "Overworked Glow",
    label: "The Hustle Hero",
    description: "Tu piel cuenta la historia de tu ambición. Aunque el mundo no se detiene, tú te aseguras de que el agotamiento nunca apague tu luz.",
    dermatological_explanation: "Representa la piel afectada por el estrés oxidativo y el cortisol. Muestra signos de fatiga, como ojeras y opacidad, pero mantiene una producción de sebo reactiva.",
    common_traits: "Piel que se ve cansada al final del día, brotes ocasionales por estrés en la zona de la mandíbula, y deshidratación superficial.",
    suggested_scores: { barrera: 55, glow: 88, estres: 38, resiliencia: 42 },
    visual_aesthetics: { colors: ["#191970", "#FF8C00"], mood: "Urbano, dinámico, city life" },
    suggested_content: "Rutinas de rescate post-trabajo, 'puffy eye' hacks, y uso de adaptógenos en skincare.",
    emotional_problem_solved: "El agotamiento y la culpa por no descansar lo suficiente."
  },
  "velvet_barrier": {
    id: "velvet_barrier",
    name: "Velvet Barrier",
    label: "The Sensitive Soul",
    description: "Posees una percepción extraordinaria. Tu piel es delicada, suave y reacciona al mundo con una honestidad que te obliga a ser amable contigo misma.",
    dermatological_explanation: "Representa una piel reactiva o hipersensible con una barrera cutánea delgada. Hay una mayor densidad de terminaciones nerviosas sensoriales que reaccionan a estímulos mínimos.",
    common_traits: "Tendencia al enrojecimiento, reactividad a productos nuevos, sensación de tirantez y suavidad extrema al tacto.",
    suggested_scores: { barrera: 91, glow: 65, estres: 70, resiliencia: 96 },
    visual_aesthetics: { colors: ["#FFB6C1", "#FFFDD0"], mood: "Suave, texturas de lino y nubes. Confort y abrazo emocional." },
    suggested_content: "Rutinas de barrier repair, productos sin fragancia, safe hauls de farmacia premium.",
    emotional_problem_solved: "La frustración de la piel reactiva y la necesidad de autocompasión."
  },
  "skin_minimalist": {
    id: "skin_minimalist",
    name: "Skin Minimalist",
    label: "The Essentialist",
    description: "Menos es, definitivamente, mucho más. Has editado el ruido del mundo para quedarte solo con lo que realmente nutre tu esencia.",
    dermatological_explanation: "Representa un enfoque de 'skin streaming' o minimalismo. Es una piel que prospera con una rutina básica de 3 pasos, evitando la sobreestimulación química.",
    common_traits: "Piel equilibrada, sin congestión por exceso de productos, y una barrera cutánea resiliente gracias a la falta de agresión constante.",
    suggested_scores: { barrera: 92, glow: 80, estres: 90, resiliencia: 85 },
    visual_aesthetics: { colors: ["#FFFFFF", "#D3D3D3"], mood: "Scandi-chic, espacios abiertos, diseño editorial muy limpio." },
    suggested_content: "What's in my bag minimalista, rutinas de viaje, y reseñas de productos multiusos.",
    emotional_problem_solved: "La sobreestimulación y el agobio por el consumo excesivo de productos."
  },
  "urban_shield": {
    id: "urban_shield",
    name: "Urban Shield",
    label: "The Digital Defender",
    description: "Eres una nativa digital en un mundo que nunca duerme. Tu piel es tu armadura invisible contra el asfalto, las pantallas y el ritmo de la ciudad.",
    dermatological_explanation: "Representa la piel expuesta a la luz azul (HEV) y la contaminación urbana (PM2.5). Se enfoca en la prevención de la formación de radicales libres y la inflamación silenciosa.",
    common_traits: "Uso constante de SPF y antioxidantes, poros que necesitan limpieza profunda pero suave, y una tez que combate la oxidación diaria.",
    suggested_scores: { barrera: 88, glow: 78, estres: 94, resiliencia: 80 },
    visual_aesthetics: { colors: ["#C0C0C0", "#0047AB"], mood: "Tecnológico, ciberpunk elegante, efectos de interferencia digital." },
    suggested_content: "Tips para trabajar frente al monitor, limpieza doble, protectores solares modernos.",
    emotional_problem_solved: "El miedo al envejecimiento ambiental y la fatiga digital."
  },
  "circadian_dreamer": {
    id: "circadian_dreamer",
    name: "Circadian Dreamer",
    label: "The Sleep Strategist",
    description: "Sabes que la verdadera magia ocurre a medianoche. Priorizas tu descanso como el acto más revolucionario de autocuidado.",
    dermatological_explanation: "Representa una piel optimizada para los procesos de reparación nocturna. Maximiza el pico de producción de colágeno y la regeneración celular que ocurre entre las 11 PM y las 4 AM.",
    common_traits: "Piel descansada, ausencia de bolsas bajo los ojos, tono uniforme y una rutina de noche muy rica en activos reparadores.",
    suggested_scores: { barrera: 92, glow: 85, estres: 92, resiliencia: 98 },
    visual_aesthetics: { colors: ["#4B0082", "#FFD700"], mood: "Onírico, texturas de seda y terciopelo. Iluminación candlelight." },
    suggested_content: "Wind-down routines, higiene del sueño, aceites faciales y fundas de seda.",
    emotional_problem_solved: "La falta de tiempo para uno mismo y el agotamiento crónico."
  },
  "formula_scholar": {
    id: "formula_scholar",
    name: "Formula Scholar",
    label: "The Ingredient Intellectual",
    description: "Para ti, el conocimiento es belleza. No te conformas con promesas; exiges evidencia y entiendes la química que hay detrás de cada gota.",
    dermatological_explanation: "Representa un usuario con alta alfabetización en ingredientes. Su piel suele estar bien tratada con activos específicos como retinoides encapsulados, péptidos y NAD+.",
    common_traits: "Piel tratada con precisión, interés por los porcentajes de activos, y una rutina que evoluciona según la ciencia más reciente.",
    suggested_scores: { barrera: 94, glow: 82, estres: 98, resiliencia: 90 },
    visual_aesthetics: { colors: ["#000000", "#FFFFFF", "#0000FF"], mood: "Diseño Blueprint, clínico pero estético, laboratorio de lujo." },
    suggested_content: "Análisis de listas de ingredientes (INCI), dupes científicos, educación sobre el pH.",
    emotional_problem_solved: "La desconfianza en el marketing tradicional y el deseo de control a través del conocimiento."
  },
  "active_reset": {
    id: "active_reset",
    name: "Active Reset",
    label: "The Vitality Athlete",
    description: "Tu piel está en constante movimiento. Vives intensamente, sudas tus miedos y usas cada desafío para regenerarte con más fuerza.",
    dermatological_explanation: "Representa una piel con alta actividad metabólica, frecuente sudoración y exposición al calor. Requiere un manejo inteligente del sebo y la hidratación post-entrenamiento.",
    common_traits: "Piel con buena circulación (rosy glow), poros que necesitan atención post-gym, y preferencia por texturas ligeras y refrescantes.",
    suggested_scores: { barrera: 85, glow: 94, estres: 85, resiliencia: 91 },
    visual_aesthetics: { colors: ["#FF4500", "#00FFFF"], mood: "Alta energía, fotografía en movimiento, gotas de agua y gel fresco." },
    suggested_content: "Gym skincare bag, cuidado post-correr, uso de brumas refrescantes.",
    emotional_problem_solved: "La necesidad de equilibrio entre un estilo de vida activo y el mantenimiento de la salud cutánea."
  },
  "bio_alchemist": {
    id: "bio_alchemist",
    name: "Bio-Alchemist",
    label: "The Holistic Strategist",
    description: "Encuentras la armonía en la intersección de la naturaleza y la biotecnología. Crees en el poder de la tierra refinado por la inteligencia humana.",
    dermatological_explanation: "Representa el uso de ingredientes biotech-naturales como células madre vegetales, fermentos y bakuchiol. Se enfoca en la regeneración sin irritación.",
    common_traits: "Piel que prefiere ingredientes limpios pero potentes, un microbioma muy saludable, y una luminosidad natural.",
    suggested_scores: { barrera: 95, glow: 91, estres: 98, resiliencia: 92 },
    visual_aesthetics: { colors: ["#E2725B", "#8A9A5B"], mood: "Botánico-moderno, ilustraciones científicas, texturas orgánicas." },
    suggested_content: "Beneficios de los fermentos, cosmética sólida y sostenible, upcycled ingredients.",
    emotional_problem_solved: "La desconexión con la naturaleza y la culpa ambiental."
  },
  "longevity_visionary": {
    id: "longevity_visionary",
    name: "Longevity Visionary",
    label: "The Cellular Architect",
    description: "No estás envejeciendo, estás evolucionando. Tu enfoque está en la longevidad celular, tratando a tu piel como un activo precioso que solo mejora con el tiempo.",
    dermatological_explanation: "Representa el enfoque en la senescencia celular y la salud de las mitocondrias cutáneas. Utiliza tecnologías como exosomas y activadores de sirtuinas.",
    common_traits: "Piel firme y elástica, enfoque en pre-juvenation, uso de péptidos de última generación.",
    suggested_scores: { barrera: 94, glow: 88, estres: 98, resiliencia: 91 },
    visual_aesthetics: { colors: ["#F7E7CE", "#C0C0C0"], mood: "Futurista minimalista, lujo atemporal, líneas limpias y luz difusa." },
    suggested_content: "Biohacking para la piel, uso de dispositivos LED, nutrición para el colágeno.",
    emotional_problem_solved: "El miedo al paso del tiempo y el deseo de control sobre el propio proceso biológico."
  },
  "restorative_aura": {
    id: "restorative_aura",
    name: "Restorative Aura",
    label: "The Healing Catalyst",
    description: "Eres experta en el arte de la recuperación. Sabes cuándo presionar y cuándo retroceder, guiando a tu piel de vuelta a su estado de perfección después de cada batalla.",
    dermatological_explanation: "Representa una piel en fase de recuperación post-procedimiento o post-daño por activos. Se centra en la epitelización, y reducción de inflamación.",
    common_traits: "Piel que está siendo mimada con bálsamos, pantenol y centella asiática; curación sobre corrección.",
    suggested_scores: { barrera: 92, glow: 75, estres: 94, resiliencia: 97 },
    visual_aesthetics: { colors: ["#98FF98", "#E6E6FA"], mood: "Spa médico de lujo, texturas de crema batida y agua. Alivio inmediato." },
    suggested_content: "Skin cycling, recuperación de la barrera, mejores bálsamos reparadores.",
    emotional_problem_solved: "El pánico tras una mala reacción cutánea o el agotamiento por rutinas agresivas."
  },
  "equilibrium_type": {
    id: "equilibrium_type",
    name: "Equilibrium Type",
    label: "The Balance Master",
    description: "Has encontrado el centro exacto. Ni demasiado, ni muy poco; tu piel es un reflejo de una vida vivida con moderación inteligente y paz mental.",
    dermatological_explanation: "Representa la piel eudérmica mantenida mediante hábitos saludables. Niveles de hidratación y sebo en punto óptimo.",
    common_traits: "Piel estable todo el mes, poros pequeños, textura suave y respuesta predecible.",
    suggested_scores: { barrera: 98, glow: 92, estres: 99, resiliencia: 99 },
    visual_aesthetics: { colors: ["#F5F5DC", "#483C32"], mood: "Simetría, orden y serenidad. Composiciones equilibradas." },
    suggested_content: "Cómo mantener piel sana, hábitos diarios de bienestar, menos es más.",
    emotional_problem_solved: "El deseo de estabilidad y la evitación del drama cutáneo."
  },
  "glass_skin_potential": {
    id: "glass_skin_potential",
    name: "Glass Skin Potential",
    label: "The Clarity Seeker",
    description: "Buscas la transparencia total. Para ti, una piel clara es el reflejo de una mente despejada y un compromiso innegociable con tu propia claridad.",
    dermatological_explanation: "Representa una piel enfocada en uniformidad del tono y eliminación de congestión. Exfoliación suave e hidratación en capas.",
    common_traits: "Interés en luminosidad, uso de tónicos hidratantes, rutina que busca superficie libre de texturas.",
    suggested_scores: { barrera: 85, glow: 90, estres: 88, resiliencia: 85 },
    visual_aesthetics: { colors: ["#E0FFFF", "#FFFFFF"], mood: "Frescura, limpieza extrema y superficies reflectantes." },
    suggested_content: "7-skin method, sheet masks, cómo lograr piel traslúcida.",
    emotional_problem_solved: "La sensación de piel sucia o congestionada y el deseo de pureza."
  },
  "velvet_shield": {
    id: "velvet_shield",
    name: "Velvet Shield",
    label: "The Protective Aura",
    description: "Tu piel es un escudo suave pero impenetrable. Sabes proteger tu vulnerabilidad con elegancia, convirtiendo tu sensibilidad en tu mayor poder.",
    dermatological_explanation: "Representa la piel que utiliza agentes oclusivos y formadores de película para protegerse de climas extremos o deshidratación severa. Maestría del slugging.",
    common_traits: "Piel que se siente protegida y sellada, uso de bálsamos nocturnos, barrera fortalecida artificialmente.",
    suggested_scores: { barrera: 96, glow: 72, estres: 96, resiliencia: 92 },
    visual_aesthetics: { colors: ["#FFDAB9", "#FFFDD0"], mood: "Protección, texturas ricas y envolventes. Lujo y cuidado intensivo." },
    suggested_content: "Nighttime slugging, mejores cremas para invierno, protección en climas secos.",
    emotional_problem_solved: "La sensación de exposición y vulnerabilidad ante el entorno."
  }
};
