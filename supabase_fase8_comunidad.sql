-- ==========================================
-- FASE 8: FUNCIONALIDAD TOTAL Y COMUNIDAD
-- Ejecuta este script en el SQL Editor de Supabase
-- ==========================================

-- 1. TABLA DE COMUNIDAD (Feed de Testimonios)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id uuid REFERENCES public.sucursales_planners(user_id) ON DELETE CASCADE,
    author_name text NOT NULL,
    author_role text DEFAULT 'Planner',
    content text NOT NULL,
    image_url text, -- Opcional: para fotos de Antes y Después
    likes integer DEFAULT 0,
    is_approved boolean DEFAULT true, -- Para moderación de administradores
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en la comunidad (Todos los Planners pueden ver, solo el autor puede borrar su post)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos los Planners pueden ver los posts de la comunidad"
    ON public.community_posts FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Los Planners pueden insertar posts"
    ON public.community_posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);


-- 2. TABLA DE ACADEMIA (Gestión de Cursos Dinámicos)
CREATE TABLE IF NOT EXISTS public.academy_courses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    level integer DEFAULT 1, -- Nivel 1, 2, 3...
    video_url text NOT NULL, -- URL de YouTube o Vimeo
    duration_mins integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar Cursos de Ejemplo automáticamente
INSERT INTO public.academy_courses (title, description, level, video_url, duration_mins)
VALUES 
('El Arte del Cierre con el Escáner Facial', 'Aprende a convertir un diagnóstico en una venta de First Package.', 1, 'https://www.youtube.com/embed/EjXU2q_NnPQ', 15),
('Ciencia de Jeju: Centella Asiática Gigante', 'Dominio técnico de los ingredientes patentados.', 2, 'https://www.youtube.com/embed/EjXU2q_NnPQ', 25),
('Escalamiento de Rangos (De Planner a Director)', 'Estrategias de reclutamiento y liderazgo MLM.', 3, 'https://www.youtube.com/embed/EjXU2q_NnPQ', 40);

-- Habilitar RLS
ALTER TABLE public.academy_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquier usuario autenticado puede ver los cursos"
    ON public.academy_courses FOR SELECT
    USING (auth.role() = 'authenticated');

-- ==========================================
-- FIN DEL SCRIPT
-- ==========================================
