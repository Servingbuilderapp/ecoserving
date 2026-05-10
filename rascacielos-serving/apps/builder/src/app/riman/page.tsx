"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Brain, Target, Users, Globe, Award, Droplets, Leaf } from "lucide-react";

// Massive Dictionary for i18n
const dictionary = {
  es: {
    nav_tech: "Patentes",
    nav_com: "Métricas",
    nav_hub: "Entrar al Hub",
    badge: "K-Beauty Global OS",
    title_1: "El Legado Riman, Potenciado por ",
    title_highlight: "Inteligencia Artificial",
    subtitle: "Únete a la marca #1 de Skincare en Corea. Combina el poder de la Centella Asiática Gigante patentada con un ecosistema SaaS para multiplicar tus ventas globales.",
    btn_start: "Comenzar Ahora",
    btn_dash: "Ir a mi Dashboard",
    stat_sales: "$4 Billones USD",
    stat_sales_p: "En ventas globales acumuladas sin precedentes.",
    stat_clients: "40 Millones",
    stat_clients_p: "De clientes satisfechos, garantizando retención masiva.",
    stat_patents: "Patentes Únicas",
    stat_patents_p: "Fórmulas imposibles de replicar en el mercado.",
    feat1_title: "Centella Asiática Gigante",
    feat1_desc: "25% más grande y 3 veces más potente en activos puros. Cultivada bajo estrictos estándares científicos. Una patente exclusiva de Riman.",
    feat2_title: "Agua del Volcán Hallasan",
    feat2_desc: "Agua de lava volcánica enriquecida naturalmente. Base de hidratación extrema que define nuestro rigor científico y laboratorios propios.",
    feat3_title: "Rigor y Premios Globales",
    feat3_desc: "Múltiples galardones internacionales de dermatología y biotecnología. Un producto 100% probado con liderazgo comprobado."
  },
  en: {
    nav_tech: "Patents",
    nav_com: "Metrics",
    nav_hub: "Enter Hub",
    badge: "K-Beauty Global OS",
    title_1: "The Riman Legacy, Powered by ",
    title_highlight: "Artificial Intelligence",
    subtitle: "Join the #1 Skincare brand in Korea. Combine the power of patented Giant Centella Asiatica with a SaaS ecosystem to multiply your global sales.",
    btn_start: "Start Now",
    btn_dash: "Go to Dashboard",
    stat_sales: "$4 Billion USD",
    stat_sales_p: "In unprecedented cumulative global sales.",
    stat_clients: "40 Million",
    stat_clients_p: "Satisfied customers, guaranteeing massive retention.",
    stat_patents: "Unique Patents",
    stat_patents_p: "Formulas impossible to replicate in the market.",
    feat1_title: "Giant Centella Asiatica",
    feat1_desc: "25% larger and 3 times more potent in pure active ingredients. Cultivated under strict scientific standards. An exclusive Riman patent.",
    feat2_title: "Hallasan Volcano Water",
    feat2_desc: "Naturally enriched volcanic lava water. Extreme hydration base that defines our scientific rigor and proprietary laboratories.",
    feat3_title: "Global Awards & Rigor",
    feat3_desc: "Multiple international awards in dermatology and biotechnology. A 100% proven product with proven leadership."
  },
  ko: {
    nav_tech: "특허",
    nav_com: "지표",
    nav_hub: "허브 입장",
    badge: "K-뷰티 글로벌 OS",
    title_1: "리만 레거시, ",
    title_highlight: "인공 지능으로 구동",
    subtitle: "한국 스킨케어 1위 브랜드에 합류하세요. 특허 받은 자이언트 병풀의 힘과 SaaS 생태계를 결합하여 글로벌 매출을 배가하십시오.",
    btn_start: "지금 시작하다",
    btn_dash: "대시보드로 이동",
    stat_sales: "40억 달러",
    stat_sales_p: "전례 없는 누적 글로벌 매출.",
    stat_clients: "4천만 명",
    stat_clients_p: "만족한 고객, 대규모 유지 보장.",
    stat_patents: "독점 특허",
    stat_patents_p: "시장에서 복제 불가능한 포뮬러.",
    feat1_title: "자이언트 병풀",
    feat1_desc: "25% 더 크고 순수 활성 성분이 3배 더 강력합니다. 엄격한 과학적 기준에 따라 재배. 리만의 독점 특허.",
    feat2_title: "한라산 화산수",
    feat2_desc: "자연적으로 풍부한 화산 용암수. 리만의 과학적 엄격함과 자체 연구소를 정의하는 극강의 수분 베이스.",
    feat3_title: "글로벌 어워드",
    feat3_desc: "피부과학 및 생명공학 분야의 수많은 국제 상. 입증된 리더십이 있는 100% 검증된 제품."
  },
  pt: {
    nav_tech: "Patentes",
    nav_com: "Métricas",
    nav_hub: "Entrar no Hub",
    badge: "K-Beauty Global OS",
    title_1: "O Legado Riman, Impulsionado por ",
    title_highlight: "Inteligência Artificial",
    subtitle: "Junte-se à marca #1 de Skincare na Coreia. Combine o poder da Centella Asiática Gigante patenteada com um ecossistema SaaS para multiplicar suas vendas globais.",
    btn_start: "Começar Agora",
    btn_dash: "Ir para o Dashboard",
    stat_sales: "$4 Bilhões USD",
    stat_sales_p: "Em vendas globais acumuladas sem precedentes.",
    stat_clients: "40 Milhões",
    stat_clients_p: "De clientes satisfeitos, garantindo retenção massiva.",
    stat_patents: "Patentes Únicas",
    stat_patents_p: "Fórmulas impossíveis de replicar no mercado.",
    feat1_title: "Centella Asiática Gigante",
    feat1_desc: "25% maior e 3 vezes mais potente em ingredientes ativos. Cultivada sob rigorosos padrões científicos. Patente exclusiva da Riman.",
    feat2_title: "Água do Vulcão Hallasan",
    feat2_desc: "Água de lava vulcânica naturalmente enriquecida. Base de hidratação extrema que define nosso rigor científico.",
    feat3_title: "Prêmios Globais",
    feat3_desc: "Múltiplos prêmios internacionais de dermatologia e biotecnologia. Um produto 100% comprovado."
  },
  fr: {
    nav_tech: "Brevets",
    nav_com: "Métriques",
    nav_hub: "Entrer au Hub",
    badge: "K-Beauty Global OS",
    title_1: "L'Héritage Riman, Propulsé par ",
    title_highlight: "L'Intelligence Artificielle",
    subtitle: "Rejoignez la marque n°1 de soins de la peau en Corée.",
    btn_start: "Commencer",
    btn_dash: "Mon Tableau de Bord",
    stat_sales: "4 Milliards USD",
    stat_sales_p: "En ventes globales cumulées.",
    stat_clients: "40 Millions",
    stat_clients_p: "De clients satisfaits.",
    stat_patents: "Brevets Uniques",
    stat_patents_p: "Formules impossibles à reproduire.",
    feat1_title: "Centella Asiatica Géante",
    feat1_desc: "Brevet exclusif. 3 fois plus puissant en principes actifs purs.",
    feat2_title: "Eau du Volcan Hallasan",
    feat2_desc: "Base d'hydratation extrême, définissant notre rigueur scientifique.",
    feat3_title: "Prix Internationaux",
    feat3_desc: "Récompensé mondialement pour son innovation biotechnologique."
  },
  de: {
    nav_tech: "Patente",
    nav_com: "Metriken",
    nav_hub: "Zum Hub",
    badge: "K-Beauty Global OS",
    title_1: "Das Riman-Erbe, Angetrieben durch ",
    title_highlight: "Künstliche Intelligenz",
    subtitle: "Treten Sie der Hautpflegemarke Nr. 1 in Korea bei.",
    btn_start: "Jetzt Starten",
    btn_dash: "Zum Dashboard",
    stat_sales: "4 Milliarden USD",
    stat_sales_p: "An kumulierten weltweiten Verkäufen.",
    stat_clients: "40 Millionen",
    stat_clients_p: "Zufriedene Kunden weltweit.",
    stat_patents: "Exklusive Patente",
    stat_patents_p: "Unmögliche Reproduktion auf dem Markt.",
    feat1_title: "Riesige Centella Asiatica",
    feat1_desc: "3-mal wirksamer in reinen Wirkstoffen. Ein exklusives Riman-Patent.",
    feat2_title: "Hallasan-Vulkanwasser",
    feat2_desc: "Extreme Feuchtigkeitsbasis, die unsere wissenschaftliche Strenge definiert.",
    feat3_title: "Globale Auszeichnungen",
    feat3_desc: "Mehrfach international für Biotechnologie ausgezeichnet."
  },
  zh: {
    nav_tech: "专利",
    nav_com: "指标",
    nav_hub: "进入枢纽",
    badge: "K-Beauty Global OS",
    title_1: "Riman 遗产，",
    title_highlight: "人工智能驱动",
    subtitle: "加入韩国第一护肤品牌。将专利巨型积雪草的力量与 SaaS 生态系统相结合。",
    btn_start: "现在开始",
    btn_dash: "仪表板",
    stat_sales: "40 亿美元",
    stat_sales_p: "空前的累计全球销售额。",
    stat_clients: "4000 万",
    stat_clients_p: "满意的客户，保证大规模保留。",
    stat_patents: "独家专利",
    stat_patents_p: "市场上无法复制的配方。",
    feat1_title: "巨型积雪草",
    feat1_desc: "独家专利，纯活性成分的效力是其 3 倍。",
    feat2_title: "汉拿山火山水",
    feat2_desc: "极度补水的基础，定义了我们的科学严谨性。",
    feat3_title: "全球奖项",
    feat3_desc: "获得多项生物技术和皮肤病学国际奖项。"
  },
  jp: {
    nav_tech: "特許",
    nav_com: "メトリクス",
    nav_hub: "ハブに入る",
    badge: "K-Beauty Global OS",
    title_1: "人工知能を搭載した",
    title_highlight: "Rimanの遺産",
    subtitle: "韓国No.1スキンケアブランドに参加してください。",
    btn_start: "今すぐ始める",
    btn_dash: "ダッシュボード",
    stat_sales: "40億ドル",
    stat_sales_p: "前例のない累積グローバル売上高。",
    stat_clients: "4000万人",
    stat_clients_p: "満足している顧客。",
    stat_patents: "独占特許",
    stat_patents_p: "市場で再現不可能な処方。",
    feat1_title: "巨大ツボクサ",
    feat1_desc: "純粋な有効成分で3倍強力。独占特許。",
    feat2_title: "漢拏山火山水",
    feat2_desc: "科学的厳密さを定義する究極の保湿ベース。",
    feat3_title: "グローバルアワード",
    feat3_desc: "バイオテクノロジーと皮膚科学の国際賞。"
  }
};

type Language = "es" | "en" | "ko" | "pt" | "fr" | "de" | "zh" | "jp";

export default function RimanLanding() {
  const [lang, setLang] = useState<Language>("es");
  const t = dictionary[lang];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-[#D4AF37] selection:text-black flex flex-col scroll-smooth">
      {/* HEADER */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-neutral-800 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          <span className="font-extrabold text-xl tracking-widest uppercase">Skingif1</span>
        </div>
        
        <nav className="hidden md:flex gap-6 text-sm font-bold text-neutral-400">
          <a href="#patents" className="hover:text-white transition-colors">{t.nav_tech}</a>
          <a href="#metrics" className="hover:text-white transition-colors">{t.nav_com}</a>
        </nav>

        <div className="flex items-center gap-4">
          {/* Multi-Language Switcher */}
          <div className="flex items-center gap-1 bg-[#111] border border-neutral-800 rounded-lg p-1 hover:border-[#D4AF37] transition-colors">
            <Globe className="w-4 h-4 text-[#D4AF37] ml-2" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer py-1 pr-2 appearance-none"
            >
              <option value="es" className="bg-[#111]">ES (Español)</option>
              <option value="en" className="bg-[#111]">EN (English)</option>
              <option value="pt" className="bg-[#111]">PT (Português)</option>
              <option value="ko" className="bg-[#111]">KO (한국어)</option>
              <option value="zh" className="bg-[#111]">ZH (中文)</option>
              <option value="jp" className="bg-[#111]">JP (日本語)</option>
              <option value="fr" className="bg-[#111]">FR (Français)</option>
              <option value="de" className="bg-[#111]">DE (Deutsch)</option>
            </select>
          </div>
          
          <Link href="/riman/dashboard" className="text-sm font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors hidden sm:block">
            {t.nav_hub}
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main className="flex flex-col items-center justify-center px-4 py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-[#050505]/0 to-[#050505] pointer-events-none" />
        
        <div className="z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
            </span>
            {t.badge}
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight">
            {t.title_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] block md:inline">{t.title_highlight}</span>
          </h1>
          <p className="text-lg md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/riman/onboarding" 
              className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold px-8 py-5 rounded-xl shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-2 text-lg"
            >
              {t.btn_start} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/riman/dashboard" 
              className="bg-[#111] border border-neutral-800 text-white font-bold px-8 py-5 rounded-xl hover:bg-neutral-900 hover:border-neutral-600 transition-colors flex items-center justify-center text-lg"
            >
              {t.btn_dash}
            </Link>
          </div>
        </div>
      </main>

      {/* METRICS SECTION */}
      <section id="metrics" className="py-20 bg-black border-y border-neutral-900 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          <div className="p-4">
            <h3 className="text-5xl font-black text-white mb-2">{t.stat_sales}</h3>
            <p className="text-neutral-500 font-medium">{t.stat_sales_p}</p>
          </div>
          <div className="p-4">
            <h3 className="text-5xl font-black text-white mb-2">{t.stat_clients}</h3>
            <p className="text-neutral-500 font-medium">{t.stat_clients_p}</p>
          </div>
          <div className="p-4">
            <h3 className="text-5xl font-black text-[#D4AF37] mb-2">{t.stat_patents}</h3>
            <p className="text-neutral-500 font-medium">{t.stat_patents_p}</p>
          </div>
        </div>
      </section>

      {/* PATENTS & SCIENCE SECTION */}
      <section id="patents" className="py-24 bg-[#050505] relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Card 1: Centella */}
          <div className="bg-[#0a0a0a] border border-neutral-800 p-10 rounded-3xl hover:border-[#10b981]/50 transition-colors group">
            <div className="bg-[#10b981]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Leaf className="w-8 h-8 text-[#10b981]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{t.feat1_title}</h3>
            <p className="text-neutral-400 leading-relaxed text-lg">{t.feat1_desc}</p>
          </div>

          {/* Card 2: Volcano Water */}
          <div className="bg-[#0a0a0a] border border-neutral-800 p-10 rounded-3xl hover:border-[#3b82f6]/50 transition-colors group">
            <div className="bg-[#3b82f6]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Droplets className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{t.feat2_title}</h3>
            <p className="text-neutral-400 leading-relaxed text-lg">{t.feat2_desc}</p>
          </div>

          {/* Card 3: Awards */}
          <div className="bg-[#0a0a0a] border border-neutral-800 p-10 rounded-3xl hover:border-[#D4AF37]/50 transition-colors group">
            <div className="bg-[#D4AF37]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{t.feat3_title}</h3>
            <p className="text-neutral-400 leading-relaxed text-lg">{t.feat3_desc}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-neutral-900 text-center text-neutral-600 text-sm">
        <p>© 2026 Skingif1 by Riman. Global Technology Hub.</p>
        <p className="mt-2 text-xs opacity-50">Skingif1 is an independent SaaS operating system empowering Riman Planners globally.</p>
      </footer>
    </div>
  );
}
