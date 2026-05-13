
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserAccessibleApps } from '@/lib/access'
import { AppsGrid } from '@/components/apps/AppsGrid'

import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AppsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isEcoServing = host.toLowerCase().includes('ecoserving') || host.toLowerCase().includes('localhost') // For local testing we can show Eco or just default to servingbuilder. Let's make localhost show ServingBuilder. Wait, if I just do `host.toLowerCase().includes('ecoserving')`, localhost is ServingBuilder. That's fine.
  
  if (!user) {
    redirect('/login')
  }

  // 1. Obtener apps accesibles
  const accessibleSlugs = await getUserAccessibleApps(user.id, user.email)
  const ADMIN_EMAIL = 'servingbuilderapp@gmail.com';

  // Fetch app limit and overrides count
  const { data: userData } = await supabase
    .from('users')
    .select('plans(app_limit)')
    .eq('id', user.id)
    .single()

  const { count: overridesCount } = await supabase
    .from('user_app_overrides')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const appLimit = (userData?.plans as any)?.app_limit || 0;
  const usedCredits = overridesCount || 0;

  // 2. Obtener TODAS las apps de la DB
  let { data: appsData } = await supabase
    .from('micro_apps')
    .select('*')
    .order('created_at', { ascending: true })

  let apps = appsData || [];

  // 3. Filtrar según el portal (Ocultar las que no corresponden)
  apps = apps.filter(app => {
    const isEcoApp = !!(app.name_es?.match(/^(I|II|III|IV|V|VI)\.\s/i));
    if (isEcoServing) {
      return isEcoApp;
    } else {
      return !isEcoApp;
    }
  });

  // Para SkinIQ, mostramos las apps de Riman por defecto
  const demoApps = [
    { id: 'd1', slug: 'rutina-gen', name_es: 'Generador de Rutinas IA', description_es: 'Crea rutinas de skincare hiper-personalizadas basadas en los resultados del mapa térmico.', icon: 'Sparkles', category: 'Cuidado Personal' },
    { id: 'd2', slug: 'ingredients-analyzer', name_es: 'Analizador de Ingredientes', description_es: 'Escanea y analiza los componentes de cualquier producto cosmético en segundos.', icon: 'Search', category: 'Análisis' },
    { id: 'd3', slug: 'ventas-riman', name_es: 'Asistente de Ventas Riman', description_es: 'Simula conversaciones para ayudarte a cerrar ventas de los sets BotaLab y EX-Incell.', icon: 'MessageCircle', category: 'Ventas' },
    { id: 'd4', slug: 'progress-sim', name_es: 'Simulador de Progreso', description_es: 'Proyecta visualmente cómo mejorará la piel del cliente en 30, 60 y 90 días.', icon: 'Calendar', category: 'Visualización' },
  ] as any[];

  // Combinar con los de la DB, evitando duplicados por slug
  const existingSlugs = new Set((apps || []).map(a => a.slug));
  const mergedApps = [...(apps || [])];
  
  demoApps.forEach(da => {
    if (!existingSlugs.has(da.slug)) {
      mergedApps.push(da);
      // Todos pueden verlas en el portal SkinIQ
      if (!accessibleSlugs.includes(da.slug)) accessibleSlugs.push(da.slug);
    }
  });
  
  apps = mergedApps;

  // Asegurar que el admin tiene acceso a TODO lo que ve en la lista
  if (user.email === ADMIN_EMAIL) {
    apps.forEach(a => {
      if (!accessibleSlugs.includes(a.slug)) accessibleSlugs.push(a.slug);
    });
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-color-base-content tracking-tight">
          Mis Aplicaciones
        </h1>
        <p className="text-color-base-content/60">
          Explora las herramientas de IA disponibles en tu plan
        </p>
      </div>

      <AppsGrid 
        apps={apps || []} 
        accessibleSlugs={accessibleSlugs} 
        userEmail={user.email}
        appLimit={appLimit}
        usedCredits={usedCredits}
      />
    </div>
  )
}
