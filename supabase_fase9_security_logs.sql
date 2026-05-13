-- Fase 9: Security Logs & Tracking
-- Crea la tabla de logs de acceso a los portales

CREATE TABLE IF NOT EXISTS public.access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    portal_name TEXT NOT NULL,
    is_authorized BOOLEAN DEFAULT true,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo administradores pueden ver los logs, pero cualquier usuario autenticado puede insertar su propio log
CREATE POLICY "Users can insert their own access logs" 
    ON public.access_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Only admins can view access logs" 
    ON public.access_logs 
    FOR SELECT 
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE email = 'iagif1964@gmail.com'));

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_access_logs_email ON public.access_logs(email);
CREATE INDEX IF NOT EXISTS idx_access_logs_portal ON public.access_logs(portal_name);
CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON public.access_logs(created_at);
