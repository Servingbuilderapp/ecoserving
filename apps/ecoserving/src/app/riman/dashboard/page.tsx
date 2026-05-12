"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Users, Target, CircleDollarSign, Brain, ShoppingBag, FolderOpen, 
  Sparkles, MessageCircle, AlertCircle, TrendingUp, GraduationCap,
  Calculator, PaintBucket, Users2, ShieldCheck, Zap,
  Link as LinkIcon, MessageSquare, ShoppingCart, Award, BookOpen, Video, FileText,
  Wallet, Network, Gift, Image as ImageIcon, Globe, Megaphone,
  CalendarDays, Trophy, Tent, Settings, Headset, HelpCircle,
  Home, Stethoscope, Activity, HeartPulse, PlayCircle, Star, Music, Mail, X
} from "lucide-react";

interface PlannerData {
  id_skingif: string;
  nombre_completo: string;
}

// ==========================================
// 10 LANGUAGES DICTIONARY (DASHBOARD)
// ==========================================
const translations = {
  es: {
    back: "Volver a Landing",
    welcome_title: "Bienvenido a tu Central Operativa",
    welcome_p1: "Skingif1 es tu SaaS integral para dominar y escalar Riman globalmente.",
    welcome_s1: "1. Usa el Escáner Facial con tus clientes para diagnósticos ultra-precisos.",
    welcome_s2: "2. Gasta XP, completa misiones y sube de rango en la academia K-Beauty.",
    welcome_s3: "3. Explora más de 70 Módulos de gestión y obtén acceso a las Master Apps PRO.",
    gamification: "Tu Ruta de Rango",
    missions: "Retos y Misiones Activas",
    m1: "Escanea 5 clientes nuevos",
    m2: "Sube 1 video K-Pop Trend",
    m3: "Reto: Ritual K-Beauty 7 días",
    cat_sales: "Ventas & Diagnóstico",
    cat_academy: "Academia & K-Beauty",
    cat_master: "Master Strategies (PRO)",
    cat_medical: "Medical & Derma (PRO)",
    cat_finance: "Finanzas & Red",
    cat_com: "Comunidad Global",
    cat_settings: "Configuración & Soporte",
    tier_basic: "Básico",
    tier_pro: "SuperPro",
    modal_pro_title: "Módulo SuperPro",
    modal_pro_desc: "Esta aplicación requiere la suscripción de $49/mes. Incluye 70 apps, contenido médico y Master Strategies.",
    modal_pro_btn: "Hacer Upgrade ahora ($49/mes)",
    close: "Cerrar",
    link_mall: "Tu Mall Riman",
    link_join: "Afiliar Socios",
    copy_scanner: "Copiar Enlace Escáner",
    hub_title: "Hub de Aplicaciones (70+ Módulos)",
    hub_desc: "Desliza horizontalmente. Las Apps PRO requieren suscripción.",
    lang_selector: "ES"
  },
  en: {
    back: "Back to Landing",
    welcome_title: "Welcome to your Operations Center",
    welcome_p1: "Skingif1 is your SaaS to dominate Riman.",
    welcome_s1: "1. Use the AI Scanner with clients.",
    welcome_s2: "2. Earn XP and rank up in the academy.",
    welcome_s3: "3. Build your global network with official links.",
    gamification: "Your Rank Path",
    missions: "Active Challenges",
    m1: "Scan 5 new clients",
    m2: "Upload 1 K-Pop Trend video",
    m3: "Challenge: 7-Day K-Beauty Ritual",
    cat_sales: "Sales & Diagnosis",
    cat_academy: "Academy & K-Beauty",
    cat_master: "Master Strategies (PRO)",
    cat_medical: "Medical & Derma (PRO)",
    cat_finance: "Finance & Network",
    cat_com: "Global Community",
    cat_settings: "Settings & Support",
    tier_basic: "Basic",
    tier_pro: "SuperPro",
    modal_pro_title: "SuperPro Module",
    modal_pro_desc: "This app requires the $49/mo subscription. Includes 70 apps, medical content, and Master Strategies.",
    modal_pro_btn: "Upgrade Now ($49/mo)",
    close: "Close",
    link_mall: "Your Riman Mall",
    link_join: "Enroll Partners",
    copy_scanner: "Copy Scanner Link",
    hub_title: "App Hub (70+ Modules)",
    hub_desc: "Scroll horizontally. PRO apps require subscription.",
    lang_selector: "EN"
  },
  ko: {
    back: "랜딩 페이지로",
    welcome_title: "오퍼레이션 센터에 오신 것을 환영합니다",
    welcome_p1: "Skingif1은 Riman을 마스터하기 위한 SaaS입니다.",
    welcome_s1: "1. 고객과 함께 AI 스캐너를 사용하세요.",
    welcome_s2: "2. 아카데미에서 XP를 얻고 순위를 올리세요.",
    welcome_s3: "3. 공식 링크로 글로벌 네트워크를 구축하세요.",
    gamification: "당신의 랭크 경로",
    missions: "일일 임무",
    m1: "클라이언트 2명 스캔 (+50 XP)",
    m2: "K-뷰티 동영상 1개 시청 (+30 XP)",
    cat_sales: "판매 및 진단",
    cat_academy: "아카데미 및 K-뷰티",
    cat_master: "마스터 전략 (PRO)",
    cat_medical: "의료 및 피부 (PRO)",
    cat_finance: "금융 및 네트워크",
    cat_com: "글로벌 커뮤니티",
    cat_settings: "설정 및 지원",
    tier_basic: "기본",
    tier_pro: "슈퍼프로",
    modal_pro_title: "슈퍼프로 모듈",
    modal_pro_desc: "이 앱은 $49/월 구독이 필요합니다.",
    modal_pro_btn: "지금 업그레이드 ($49/월)",
    close: "닫기",
    link_mall: "리만 몰",
    link_join: "파트너 등록",
    copy_scanner: "스캐너 링크 복사",
    hub_title: "앱 허브 (70+ 모듈)",
    hub_desc: "가로로 스크롤하십시오.",
    lang_selector: "KO"
  },
  pt: { back: "Voltar", welcome_title: "Bem-vindo", welcome_p1: "Skingif1 é seu SaaS.", welcome_s1: "1. Scanner IA.", welcome_s2: "2. Ganhe XP.", welcome_s3: "3. Rede global.", gamification: "Caminho do Ranking", missions: "Missões Diárias", m1: "2 Scanners (+50 XP)", m2: "1 Vídeo (+30 XP)", cat_sales: "Vendas e Diagnóstico", cat_academy: "Academia K-Beauty", cat_master: "Estratégias Master (PRO)", cat_medical: "Médico e Derma (PRO)", cat_finance: "Finanças e Rede", cat_com: "Comunidade Global", cat_settings: "Configuração", tier_basic: "Básico", tier_pro: "SuperPro", modal_pro_title: "Módulo PRO", modal_pro_desc: "Requer assinatura de $49/mês.", modal_pro_btn: "Upgrade ($49/mês)", close: "Fechar", link_mall: "Seu Mall Riman", link_join: "Recrutar", copy_scanner: "Copiar Link", hub_title: "Hub de Apps", hub_desc: "Deslize horizontalmente.", lang_selector: "PT" },
  fr: { back: "Retour", welcome_title: "Bienvenue", welcome_p1: "Skingif1 est votre SaaS.", welcome_s1: "1. Scanner IA.", welcome_s2: "2. Gagnez de l'XP.", welcome_s3: "3. Réseau global.", gamification: "Votre Rang", missions: "Missions", m1: "2 Scanners (+50 XP)", m2: "1 Vidéo (+30 XP)", cat_sales: "Ventes", cat_academy: "Académie", cat_master: "Stratégies (PRO)", cat_medical: "Médical (PRO)", cat_finance: "Finances", cat_com: "Communauté", cat_settings: "Paramètres", tier_basic: "Base", tier_pro: "SuperPro", modal_pro_title: "Module PRO", modal_pro_desc: "Abonnement requis.", modal_pro_btn: "Upgrade ($49/m)", close: "Fermer", link_mall: "Boutique Riman", link_join: "Recruter", copy_scanner: "Copier le Lien", hub_title: "Hub d'Apps", hub_desc: "Faites défiler.", lang_selector: "FR" },
  de: { back: "Zurück", welcome_title: "Willkommen", welcome_p1: "Skingif1 ist Ihr SaaS.", welcome_s1: "1. KI-Scanner.", welcome_s2: "2. XP verdienen.", welcome_s3: "3. Netzwerk aufbauen.", gamification: "Dein Rang", missions: "Missionen", m1: "2 Scans (+50 XP)", m2: "1 Video (+30 XP)", cat_sales: "Verkauf", cat_academy: "Akademie", cat_master: "Strategien (PRO)", cat_medical: "Medizin (PRO)", cat_finance: "Finanzen", cat_com: "Community", cat_settings: "Einstellungen", tier_basic: "Basis", tier_pro: "SuperPro", modal_pro_title: "PRO-Modul", modal_pro_desc: "Abonnement erforderlich.", modal_pro_btn: "Upgrade ($49/m)", close: "Schließen", link_mall: "Riman Shop", link_join: "Rekrutieren", copy_scanner: "Link kopieren", hub_title: "App-Hub", hub_desc: "Scrollen.", lang_selector: "DE" },
  zh: { back: "返回", welcome_title: "欢迎", welcome_p1: "Skingif1 是您的 SaaS。", welcome_s1: "1. AI 扫描仪。", welcome_s2: "2. 赚取 XP。", welcome_s3: "3. 全球网络。", gamification: "您的排名", missions: "任务", m1: "2 次扫描 (+50 XP)", m2: "1 个视频 (+30 XP)", cat_sales: "销售", cat_academy: "学院", cat_master: "大师策略 (PRO)", cat_medical: "医疗 (PRO)", cat_finance: "财务", cat_com: "社区", cat_settings: "设置", tier_basic: "基础", tier_pro: "高级", modal_pro_title: "高级模块", modal_pro_desc: "需要订阅。", modal_pro_btn: "升级 ($49/月)", close: "关闭", link_mall: "Riman 商城", link_join: "招聘", copy_scanner: "复制链接", hub_title: "应用中心", hub_desc: "水平滚动。", lang_selector: "ZH" },
  jp: { back: "戻る", welcome_title: "ようこそ", welcome_p1: "Skingif1はあなたのSaaSです。", welcome_s1: "1. AIスキャナー。", welcome_s2: "2. XPを獲得。", welcome_s3: "3. グローバルネットワーク。", gamification: "ランク", missions: "ミッション", m1: "2回のスキャン (+50 XP)", m2: "1本の動画 (+30 XP)", cat_sales: "販売", cat_academy: "アカデミー", cat_master: "戦略 (PRO)", cat_medical: "医療 (PRO)", cat_finance: "ファイナンス", cat_com: "コミュニティ", cat_settings: "設定", tier_basic: "基本", tier_pro: "プロ", modal_pro_title: "プロモジュール", modal_pro_desc: "サブスクリプションが必要です。", modal_pro_btn: "アップグレード ($49/月)", close: "閉じる", link_mall: "Riman モール", link_join: "採用", copy_scanner: "リンクをコピー", hub_title: "アプリハブ", hub_desc: "スクロール。", lang_selector: "JP" },
  it: { back: "Indietro", welcome_title: "Benvenuto", welcome_p1: "Skingif1 è il tuo SaaS completo per dominare e scalare Riman a livello globale.", welcome_s1: "1. Usa lo Scanner Facciale con i tuoi clienti per diagnosi ultra-precise.", welcome_s2: "2. Spendi XP, completa missioni e sali di grado nell'accademia K-Beauty.", welcome_s3: "3. Esplora oltre 70 Moduli di gestione e ottieni accesso alle Master Apps PRO.", gamification: "Il tuo Grado", missions: "Sfide e Missioni Attive", m1: "Scansiona 5 nuovi clienti", m2: "Carica 1 video K-Pop Trend", m3: "Sfida: Rituale K-Beauty 7 giorni", cat_sales: "Vendite", cat_academy: "Accademia", cat_master: "Strategie (PRO)", cat_medical: "Medico (PRO)", cat_finance: "Finanza", cat_com: "Comunità", cat_settings: "Impostazioni", tier_basic: "Base", tier_pro: "SuperPro", modal_pro_title: "Modulo PRO", modal_pro_desc: "Abbonamento richiesto.", modal_pro_btn: "Upgrade ($49/m)", close: "Chiudi", link_mall: "Negozio Riman", link_join: "Reclutare", copy_scanner: "Copia Link", hub_title: "Hub di App", hub_desc: "Scorri.", lang_selector: "IT" },
  ru: { back: "Назад", welcome_title: "Добро пожаловать", welcome_p1: "Skingif1 — это ваш комплексный SaaS для доминирования и масштабирования Riman на глобальном уровне.", welcome_s1: "1. Используйте ИИ-сканер для клиентов для сверхточной диагностики.", welcome_s2: "2. Тратьте XP, выполняйте миссии и повышайте ранг в академии K-Beauty.", welcome_s3: "3. Изучите более 70 модулей управления и получите доступ к Master Apps PRO.", gamification: "Ваш Ранг", missions: "Активные вызовы и миссии", m1: "Отсканируйте 5 новых клиентов", m2: "Загрузите 1 видео K-Pop Trend", m3: "Вызов: 7-дневный ритуал K-Beauty", cat_sales: "Продажи", cat_academy: "Академия", cat_master: "Стратегии (PRO)", cat_medical: "Медицина (PRO)", cat_finance: "Финансы", cat_com: "Сообщество", cat_settings: "Настройки", tier_basic: "Базовый", tier_pro: "СуперПро", modal_pro_title: "PRO Модуль", modal_pro_desc: "Требуется подписка.", modal_pro_btn: "Обновить ($49/м)", close: "Закрыть", link_mall: "Магазин Riman", link_join: "Рекрутинг", copy_scanner: "Копировать ссылку", hub_title: "Хаб приложений", hub_desc: "Прокрутите.", lang_selector: "RU" }
};

type Language = keyof typeof translations;

// Mock User Rewards
const userRewards = {
  xp: 1250,
  level: 2,
  title: "Planner Avanzado",
  nextLevelXp: 2000,
  badges: ["Scanner Elite", "Jeju Expert"]
};

// Riman Global IDs
const OFFICIAL_RIMAN_ID = "9000736557"; // Master Sponsor ID

export default function RimanHub() {
  const router = useRouter();
  const supabase = createClient();
  
  const [planner, setPlanner] = useState<PlannerData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // States
  const [lang, setLang] = useState<Language>("es");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(true);
  const [isProUser, setIsProUser] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const fetchUserData = async () => {
      const currentId = "skingif1"; // Utilizando el ID maestro dado por el usuario
      setPlanner({
        id_skingif: currentId, 
        nombre_completo: "Administrador Skingif1"
      });
      
      // El dueño o admin siempre tiene acceso sin restricciones
      const isOwner = currentId === "skingif1" || currentId === "admin";
      const proStatus = localStorage.getItem('isProUser');
      
      if (isOwner || proStatus === 'true') {
        setIsProUser(true);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const copyScannerLink = () => {
    navigator.clipboard.writeText(`skingif1.com/${planner?.id_skingif}/scanner`);
    alert(`¡Enlace copiado!\nTu URL es: skingif1.com/${planner?.id_skingif}/scanner`);
  };

  const handleAppClick = (e: React.MouseEvent<HTMLAnchorElement>, tier: string, href: string, title: string) => {
    e.preventDefault();
    if (tier === "pro" && !isProUser) {
      setShowUpgradeModal(true);
      return;
    }
    if (href === "#") {
      alert(`MÓDULO EN CONSTRUCCIÓN:\n\n${title}`);
    } else {
      router.push(href);
    }
  };

  // URLs movidas directamente a las etiquetas <a> para evitar bloqueos de Pop-up del navegador

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div></div>;
  }

  const xpProgress = Math.min(100, Math.round((userRewards.xp / userRewards.nextLevelXp) * 100));

  // 70 APPS DYNAMIC ARRAY: 30 BÁSICAS ($12) y 40 PRO ($49)
  const appCategories = [
    { category: t.cat_sales, icon: Sparkles, color: "text-[#D4AF37]", apps: [
        { id: "scanner", title: "Escáner IA", icon: Brain, color: "from-[#ec4899] to-[#f472b6]", href: `/riman/${planner?.id_skingif}/scanner`, alert: false, tier: "basic" },
        { id: "crm", title: "CRM Global", icon: Target, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/crm", alert: true, tier: "basic" },
        { id: "pos", title: "Checkout", icon: ShoppingCart, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/checkout", alert: false, tier: "basic" },
        { id: "scripts", title: "Scripts Cierre", icon: FileText, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/scripts", alert: false, tier: "basic" },
        { id: "objeciones", title: "Objeciones IA", icon: Brain, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/objeciones", alert: false, tier: "pro" },
        { id: "prospeccion", title: "Prospección IA", icon: Users, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/app/prospeccion", alert: false, tier: "basic" },
        { id: "funnels", title: "Funnels de Venta", icon: Network, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/funnels", alert: false, tier: "pro" },
        { id: "whatsapp", title: "WhatsApp Bots", icon: MessageCircle, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/app/whatsapp", alert: false, tier: "pro" },
        { id: "followup", title: "Follow-up System", icon: CalendarDays, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/dashboard/app/followup", alert: false, tier: "basic" },
        { id: "upsell", title: "Upsell Generator", icon: TrendingUp, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/app/upsell", alert: false, tier: "pro" },
      ]
    },
    { category: t.cat_academy, icon: GraduationCap, color: "text-blue-400", apps: [
        { id: "academy", title: "Academia", icon: GraduationCap, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/academy", alert: false, tier: "basic" },
        { id: "cert", title: "Diplomas", icon: Award, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/cert", alert: false, tier: "basic" },
        { id: "glosario", title: "Glosario Jeju", icon: BookOpen, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/glosario", alert: false, tier: "basic" },
        { id: "liderazgo", title: "Liderazgo PRO", icon: Award, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/app/liderazgo", alert: false, tier: "pro" },
        { id: "mindset", title: "Mindset del Éxito", icon: Brain, color: "from-[#8b5cf6] to-[#c084fc]", href: "/riman/dashboard/app/mindset", alert: false, tier: "basic" },
        { id: "habitos", title: "Hábitos Atómicos", icon: Activity, color: "from-[#14b8a6] to-[#5eead4]", href: "/riman/dashboard/app/habitos", alert: false, tier: "basic" },
        { id: "oratoria", title: "Oratoria & Pitch", icon: Megaphone, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/oratoria", alert: false, tier: "pro" },
        { id: "kbeauty_101", title: "K-Beauty 101", icon: Sparkles, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/kbeauty_101", alert: false, tier: "basic" },
        { id: "marcapersonal", title: "Marca Personal", icon: Star, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/app/marcapersonal", alert: false, tier: "pro" },
        { id: "storytelling", title: "Storytelling IA", icon: FileText, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/storytelling", alert: false, tier: "pro" },
      ]
    },
    { category: t.cat_master, icon: Zap, color: "text-[#8b5cf6]", apps: [
        { id: "ideas", title: "Content Ideas", icon: Megaphone, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/ideas", alert: false, tier: "pro" },
        { id: "tracker", title: "Rewards Tracker", icon: TrendingUp, color: "from-[#14b8a6] to-[#5eead4]", href: "/riman/dashboard/app/tracker", alert: false, tier: "pro" },
        { id: "kpop", title: "K-Pop Ads", icon: Music, color: "from-[#8b5cf6] to-[#c084fc]", href: "/riman/dashboard/app/kpop", alert: false, tier: "pro" },
        { id: "influencer", title: "Influencers", icon: Star, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/influencer", alert: false, tier: "pro" },
        { id: "eventos", title: "Eventos Masivos", icon: Target, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/eventos", alert: false, tier: "pro" },
        { id: "tiktok_viral", title: "TikTok Viral", icon: Video, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/tiktok_viral", alert: false, tier: "pro" },
        { id: "reels_master", title: "Reels Master", icon: PlayCircle, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/dashboard/app/reels_master", alert: false, tier: "pro" },
        { id: "seo_planner", title: "SEO Planner", icon: Globe, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/seo_planner", alert: false, tier: "pro" },
        { id: "copywriting", title: "Copywriting IA", icon: FileText, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/app/copywriting", alert: false, tier: "pro" },
        { id: "ads_manager", title: "Ads Manager IA", icon: Target, color: "from-[#ef4444] to-[#f87171]", href: "/riman/dashboard/app/ads_manager", alert: false, tier: "pro" },
      ]
    },
    { category: t.cat_medical, icon: Stethoscope, color: "text-teal-400", apps: [
        { id: "derma", title: "Derma Guide IA", icon: Stethoscope, color: "from-[#14b8a6] to-[#5eead4]", href: "/riman/dashboard/app/derma", alert: false, tier: "pro" },
        { id: "diseases", title: "Afecciones", icon: Activity, color: "from-[#ef4444] to-[#f87171]", href: "/riman/dashboard/app/diseases", alert: false, tier: "pro" },
        { id: "ingredients", title: "Ingredients Wiki", icon: FileText, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/dashboard/app/ingredients", alert: false, tier: "pro" },
        { id: "fidelizacion", title: "Fidelización", icon: Star, color: "from-[#14b8a6] to-[#5eead4]", href: "/riman/dashboard/app/fidelizacion", alert: false, tier: "basic" },
        { id: "anti_aging", title: "Anti-Aging IA", icon: Sparkles, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/anti_aging", alert: false, tier: "pro" },
        { id: "rutinas", title: "Armador de Rutinas", icon: CalendarDays, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/rutinas", alert: false, tier: "basic" },
        { id: "sensibilidad", title: "Piel Sensible", icon: HeartPulse, color: "from-[#ef4444] to-[#f87171]", href: "/riman/dashboard/app/sensibilidad", alert: false, tier: "pro" },
        { id: "acne_protocol", title: "Protocolo Acné", icon: Target, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/acne_protocol", alert: false, tier: "pro" },
        { id: "sun_damage", title: "Daño Solar", icon: Zap, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/app/sun_damage", alert: false, tier: "pro" },
        { id: "nutrition", title: "Nutrición & Piel", icon: HeartPulse, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/app/nutrition", alert: false, tier: "pro" },
      ]
    },
    { category: t.cat_finance, icon: CircleDollarSign, color: "text-emerald-400", apps: [
        { id: "calculator", title: "Proyector Financiero", icon: Calculator, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/calculator", alert: false, tier: "basic" },
        { id: "wallet", title: "Billetera Virtual", icon: Wallet, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/wallet", alert: false, tier: "basic" },
        { id: "impuestos", title: "Asesor Impuestos", icon: FileText, color: "from-[#ef4444] to-[#f87171]", href: "/riman/dashboard/app/impuestos", alert: false, tier: "pro" },
        { id: "bonos", title: "Calculadora de Bonos", icon: Award, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/app/bonos", alert: false, tier: "pro" },
        { id: "presupuesto", title: "Presupuesto Ads", icon: Target, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/presupuesto", alert: false, tier: "pro" },
        { id: "roi_tracker", title: "ROI Tracker", icon: TrendingUp, color: "from-[#14b8a6] to-[#5eead4]", href: "/riman/dashboard/app/roi_tracker", alert: false, tier: "pro" },
        { id: "inversiones", title: "Guía Inversiones", icon: CircleDollarSign, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/app/inversiones", alert: false, tier: "pro" },
        { id: "inventario", title: "Gestor Inventario", icon: ShoppingBag, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/dashboard/app/inventario", alert: false, tier: "basic" },
        { id: "network_stats", title: "Estadísticas Red", icon: Network, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/network_stats", alert: false, tier: "pro" },
        { id: "viajes", title: "Metas de Viaje", icon: Globe, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/viajes", alert: false, tier: "basic" },
      ]
    },
    { category: t.cat_com, icon: Users2, color: "text-purple-400", apps: [
        { id: "community", title: "Feed Global", icon: Users2, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/dashboard/community", alert: true, tier: "basic" },
        { id: "eventos_live", title: "Eventos Live", icon: Video, color: "from-[#ef4444] to-[#f87171]", href: "/riman/dashboard/app/eventos_live", alert: false, tier: "basic" },
        { id: "podcasts", title: "Podcasts Riman", icon: Music, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/podcasts", alert: false, tier: "basic" },
        { id: "reconocimiento", title: "Muro de Fama", icon: Trophy, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/app/reconocimiento", alert: false, tier: "basic" },
        { id: "foros", title: "Foros Temáticos", icon: MessageSquare, color: "from-[#14b8a6] to-[#5eead4]", href: "/riman/dashboard/app/foros", alert: false, tier: "basic" },
        { id: "mentorias", title: "Mentorías 1-a-1", icon: Users, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/mentorias", alert: false, tier: "pro" },
        { id: "grupos", title: "Grupos Locales", icon: Network, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/grupos", alert: false, tier: "basic" },
        { id: "noticias", title: "Noticias Corea", icon: Globe, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/noticias", alert: false, tier: "basic" },
        { id: "retos_com", title: "Retos Mensuales", icon: Target, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/app/retos_com", alert: false, tier: "basic" },
        { id: "galeria", title: "Galería Testimonios", icon: ImageIcon, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/dashboard/app/galeria", alert: false, tier: "basic" },
      ]
    },
    { category: t.cat_settings, icon: Settings, color: "text-neutral-400", apps: [
        { id: "email", title: "Correos Automáticos", icon: Mail, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/email", alert: false, tier: "basic" },
        { id: "profile", title: "Perfil y SEO", icon: Settings, color: "from-[#4b5563] to-[#6b7280]", href: "/riman/dashboard/app/profile", alert: false, tier: "basic" },
        { id: "soporte", title: "Ticket Soporte", icon: Headset, color: "from-[#ef4444] to-[#f87171]", href: "/riman/dashboard/app/soporte", alert: false, tier: "basic" },
        { id: "facturacion", title: "Facturación SaaS", icon: FileText, color: "from-[#10b981] to-[#34d399]", href: "/riman/dashboard/app/facturacion", alert: false, tier: "basic" },
        { id: "integraciones", title: "Integraciones API", icon: Network, color: "from-[#8b5cf6] to-[#a78bfa]", href: "/riman/dashboard/app/integraciones", alert: false, tier: "pro" },
        { id: "dominios", title: "Dominio Personal", icon: Globe, color: "from-[#f59e0b] to-[#fbbf24]", href: "/riman/dashboard/app/dominios", alert: false, tier: "pro" },
        { id: "notificaciones", title: "Alertas Push", icon: Zap, color: "from-[#D4AF37] to-[#F3E5AB]", href: "/riman/dashboard/app/notificaciones", alert: false, tier: "basic" },
        { id: "seguridad", title: "Seguridad y 2FA", icon: ShieldCheck, color: "from-[#14b8a6] to-[#5eead4]", href: "/riman/dashboard/app/seguridad", alert: false, tier: "pro" },
        { id: "analytics", title: "Global Analytics", icon: Activity, color: "from-[#ec4899] to-[#f472b6]", href: "/riman/dashboard/app/analytics", alert: false, tier: "pro" },
        { id: "idiomas", title: "Traductor Global", icon: Globe, color: "from-[#3b82f6] to-[#60a5fa]", href: "/riman/dashboard/app/idiomas", alert: false, tier: "pro" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pb-24 overflow-x-hidden">
      
      {/* 1. WELCOME TOUR MODAL */}
      {showWelcomeTour && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#111] border-2 border-[#D4AF37] rounded-3xl p-8 max-w-lg w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.3)]">
            <button onClick={() => setShowWelcomeTour(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4">{t.welcome_title}</h2>
            <p className="text-lg text-neutral-300 mb-8">{t.welcome_p1}</p>
            <div className="space-y-4 text-left bg-black p-6 rounded-2xl border border-neutral-800 mb-8 text-sm md:text-base">
              <div className="flex items-start gap-3"><Brain className="w-6 h-6 text-[#ec4899] shrink-0 mt-0.5"/> <span className="font-bold">{t.welcome_s1}</span></div>
              <div className="flex items-start gap-3"><Trophy className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5"/> <span className="font-bold">{t.welcome_s2}</span></div>
              <div className="flex items-start gap-3"><Globe className="w-6 h-6 text-[#3b82f6] shrink-0 mt-0.5"/> <span className="font-bold">{t.welcome_s3}</span></div>
            </div>
            <button onClick={() => setShowWelcomeTour(false)} className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-xl text-lg hover:bg-white transition-colors">
              Comenzar / Start
            </button>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#8b5cf6] rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(139,92,246,0.2)] text-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#8b5cf6]/20 blur-[60px] pointer-events-none rounded-full" />
            <Zap className="w-16 h-16 text-[#8b5cf6] mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2">{t.modal_pro_title}</h2>
            <p className="text-neutral-400 mb-6 text-sm">{t.modal_pro_desc}</p>
            <Link href="/riman/checkout?plan=pro" className="block w-full bg-[#8b5cf6] text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-transform mb-3">
              {t.modal_pro_btn}
            </Link>
            <button onClick={() => setShowUpgradeModal(false)} className="text-neutral-500 font-bold">{t.close}</button>
          </div>
        </div>
      )}

      {/* HEADER CONTROLS */}
      <div className="p-4 flex justify-between items-center border-b border-neutral-900 bg-[#0a0a0a]">
        <Link href="/riman" className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-bold bg-[#111] px-4 py-2 rounded-xl">
          <Home className="w-4 h-4" /> {t.back}
        </Link>
        <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="bg-[#111] text-white border border-neutral-800 rounded-lg px-4 py-2 font-bold cursor-pointer">
          {Object.keys(translations).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
        </select>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-10">
        
        {/* GAMIFICATION & RIMAN LINKS WIDGET */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* GIANT GAMIFICATION PANEL */}
          <div className="lg:col-span-2 bg-gradient-to-r from-[#1a1500] to-[#0a0a0a] rounded-3xl p-8 border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.1)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-[#D4AF37] mb-2 flex items-center gap-3"><Trophy className="w-8 h-8" /> {t.gamification}</h2>
              <p className="text-neutral-400 font-bold uppercase tracking-widest">{userRewards.title} - Rango {userRewards.level}</p>
            </div>
            
            <div className="relative z-10 mt-8 flex flex-col gap-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{userRewards.xp} XP</span>
                <span className="text-[#D4AF37]">{userRewards.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-4 bg-black rounded-full overflow-hidden border border-neutral-800">
                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] shadow-[0_0_10px_#D4AF37]" style={{ width: `${xpProgress}%` }}></div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-red-500"/> {t.missions || "Retos y Misiones Activas"}</h3>
              <div className="flex flex-col gap-3">
                <div className="bg-black/50 border border-neutral-800 px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center hover:bg-neutral-900 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> 
                    <span>{t.m1 || "Escanea 5 clientes nuevos"}</span>
                  </div>
                  <span className="text-[#D4AF37]">+150 XP</span>
                </div>
                <div className="bg-black/50 border border-neutral-800 px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center hover:bg-neutral-900 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> 
                    <span>{t.m2 || "Sube 1 video K-Pop Trend"}</span>
                  </div>
                  <span className="text-[#D4AF37]">+80 XP</span>
                </div>
                <div className="bg-black/50 border border-[#D4AF37]/30 px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center hover:bg-[#D4AF37]/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-[#D4AF37]" /> 
                    <span>{(t as any).m3 || "Reto: Ritual K-Beauty 7 días"}</span>
                  </div>
                  <span className="text-[#D4AF37] font-black">+300 XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIMAN OFFICIAL ACTION LINKS */}
          <div className="bg-[#111] rounded-3xl p-8 border border-neutral-800 flex flex-col justify-center gap-4">
            <h3 className="text-xl font-bold mb-4">Acciones Rápidas (ID: {planner?.id_skingif})</h3>
            
            <a href={`https://mall.riman.com/${planner?.id_skingif}`} target="_blank" rel="noopener noreferrer" className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-200 transition-colors">
              <ShoppingBag className="w-6 h-6" /> {t.link_mall}
            </a>
            
            <a href={`https://us.riman.com/sign-up?referrer=${planner?.id_skingif}`} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors">
              <Users className="w-6 h-6" /> {t.link_join}
            </a>

            <button onClick={copyScannerLink} className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" /> {t.copy_scanner}
            </button>
          </div>
        </div>

        {/* APP LAUNCHER: MASSIVE ICONS NETFLIX STYLE */}
        <div className="space-y-16 pt-8">
          <div>
            <h2 className="text-3xl font-black text-white">{t.hub_title}</h2>
            <p className="text-neutral-400 mt-1">{t.hub_desc}</p>
          </div>

          {appCategories.map((cat, index) => (
            <div key={index} className="relative">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3 px-2 border-l-4 border-current pl-4" style={{ borderColor: cat.color.replace('text-', '') }}>
                {cat.category}
              </h2>
              
              {/* Horizontal Scroll with MASSIVE Cards */}
              <div className="flex overflow-x-auto gap-6 pb-12 pt-4 px-2 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {cat.apps.map(app => (
                  <a 
                    key={app.id} 
                    href={app.href} 
                    onClick={(e) => handleAppClick(e, app.tier, app.href, app.title)}
                    className={`group relative flex flex-col items-center justify-center p-8 rounded-[40px] hover:border-[#D4AF37]/50 transition-all duration-300 shadow-2xl shrink-0 snap-start w-[280px] h-[280px] overflow-hidden bg-[#0a0a0a] border-2 border-neutral-900 ${app.tier === 'pro' ? 'hover:shadow-[0_20px_60px_rgba(139,92,246,0.4)]' : 'hover:shadow-[0_20px_60px_rgba(212,175,55,0.3)]'}`}
                  >
                    <div className={`absolute inset-0 opacity-10 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${app.color}`}></div>
                    
                    {/* MASSIVE ICON */}
                    <div className="relative z-20 transform group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-500 flex flex-col items-center">
                      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-6 shadow-2xl border-4 border-black/50`}>
                        <app.icon className="w-12 h-12 text-white" />
                      </div>
                      
                      {app.tier === "pro" && (
                        <div className="mb-3 bg-[#8b5cf6] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_15px_#8b5cf6]">
                          {t.tier_pro}
                        </div>
                      )}

                      <h3 className="font-black text-2xl text-white text-center leading-tight">{app.title}</h3>
                    </div>

                    {app.alert && (
                      <div className="absolute top-6 right-6 w-4 h-4 bg-red-500 border-2 border-[#0a0a0a] rounded-full animate-pulse z-30"></div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
