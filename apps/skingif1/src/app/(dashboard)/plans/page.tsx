
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PricingTable } from '@/components/plans/PricingTable'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 1. Obtener usuario actual para marcar su plan
  const { data: userData } = await supabase
    .from('users')
    .select('plan_id')
    .eq('id', user.id)
    .single()

  // 2. Obtener planes activos de la DB para tener los IDs correctos
  let { data: dbPlans } = await supabase
    .from('plans')
    .select('*, plan_apps(app_id, micro_apps(name_en, name_es))')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Definición de contenido local (Source of Truth para presentación)
  const localPlans = [
    { 
      slug: 'basico', name_en: 'Essential Set', name_es: 'Rutina Esencial', 
      description_en: 'Perfect start for glowing skin.', 
      description_es: 'El inicio perfecto para una piel radiante.', 
      price_monthly: 89.00, 
      items_en: ['Cleanser', 'Toner', 'Basic Moisturizer'], 
      items_es: ['Limpiador Activo', 'Tónico Equilibrante', 'Hidratante Básica'] 
    },
    { 
      slug: 'botalab', name_en: 'BotaLab Protocol', name_es: 'Protocolo BotaLab', 
      description_en: 'Advanced botanical care.', 
      description_es: 'Cuidado botánico avanzado para restauración.', 
      price_monthly: 149.00, 
      items_en: ['Everything in Essential, PLUS:', 'BotaLab Serum', 'Targeted Treatment', 'VIP Consultation'], 
      items_es: ['Todo lo del set Esencial, MÁS:', 'Suero BotaLab', 'Tratamiento Específico', 'Consulta VIP'] 
    },
    { 
      slug: 'ex-incell', name_en: 'EX-Incell Premium', name_es: 'Set Premium EX-Incell', 
      description_en: 'The ultimate skin transformation.', 
      description_es: 'La máxima transformación a nivel celular.', 
      price_monthly: 299.00, 
      items_en: ['Everything in BotaLab, PLUS:', 'EX-Incell Cream', 'Dermatologist Review', 'Priority Support'], 
      items_es: ['Todo lo del protocolo BotaLab, MÁS:', 'Crema EX-Incell', 'Revisión Dermatológica con IA', 'Soporte Prioritario'] 
    }
  ];

  // Combinar: Usar localPlans para el contenido, pero mantener IDs de la DB si existen
  const plans = localPlans.map(lp => {
    const dbPlan = dbPlans?.find(dbp => dbp.slug === lp.slug);
    return {
      ...lp,
      id: dbPlan?.id || `temp-${lp.slug}`, // Importante para que el checkout funcione con el slug
      plan_apps: dbPlan?.plan_apps || []
    };
  });


  return (
    <div className="max-w-[90rem] mx-auto w-full space-y-12 py-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-color-base-content tracking-tight">
          Impulsa tu <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-accent-pink">Creatividad</span>
        </h1>
        <p className="text-color-base-content/60 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y comienza a generar contenido con IA profesional hoy mismo.
        </p>
      </div>

      <PricingTable 
        plans={plans || []} 
        currentPlanId={userData?.plan_id || null} 
      />

      <div className="text-center p-8 border border-dashed border-color-base-content/10 rounded-3xl bg-color-base-content/5">
        <p className="text-sm text-color-base-content/60">
          ¿Necesitas un plan a medida? <a href="https://wa.me/573227008727?text=Hola,%20necesito%20información%20sobre%20un%20plan%20a%20medida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Contacta con soporte</a>
        </p>
      </div>
    </div>
  )
}
