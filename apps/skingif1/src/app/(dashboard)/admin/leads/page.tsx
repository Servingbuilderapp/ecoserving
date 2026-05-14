import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LeadsAdminPage() {
  const supabase = await createClient()

  // Solo permitir admin o servir como vista segura
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Traer los leads. Ajusta el nombre de la tabla si no es leads_y_clientes
  const { data: leads, error } = await supabase
    .from('leads_y_clientes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Directorio de Leads (SkinIQ)</h1>
        <p className="text-neutral-400">Consulta los prospectos capturados por los aliados.</p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-[#1a1a1a] text-xs uppercase text-neutral-400 font-bold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Aliado (Referente)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-400">
                    Error cargando leads: {error.message}. ¿Ejecutaste el script SQL?
                  </td>
                </tr>
              ) : leads && leads.length > 0 ? (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      {lead.nombre}
                    </td>
                    <td className="px-6 py-4">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                        {lead.referred_by || 'organic'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        {lead.status || 'nuevo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    Aún no hay leads capturados. Comparte tu enlace /scan-gratis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
