-- Esquema de Base de Datos Supabase - Portal Nina (Auditoría UCAM CERT)

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ESQUEMA DEL PDD (Project Design Document)
-- Tabla principal que soporta el guardado incremental (borrador) de las 14 secciones obligatorias.
CREATE TABLE IF NOT EXISTS proyectos_auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID, -- Relación con auth.users en Supabase
    estado VARCHAR(50) DEFAULT 'borrador', -- borrador, revision, validado
    cuv VARCHAR(100) UNIQUE, -- Código Único de Verificación
    tipo_proyecto VARCHAR(10), -- Ej: HPR, HC, etc.
    geografia VARCHAR(20), -- Ej: SALARG
    anio VARCHAR(4),
    lote VARCHAR(20),
    
    -- Sección 5.4: Las 14 secciones obligatorias del Standard (Usamos JSONB para permitir guardado incremental flexible)
    sec_1_encabezado JSONB DEFAULT '{}'::jsonb,
    sec_2_sintesis JSONB DEFAULT '{}'::jsonb,
    sec_3_fundamentos JSONB DEFAULT '{}'::jsonb,
    sec_4_gobernanza JSONB DEFAULT '{}'::jsonb,
    sec_5_linea_base JSONB DEFAULT '{}'::jsonb,
    sec_6_definicion_proyecto JSONB DEFAULT '{}'::jsonb,
    sec_7_metodologia JSONB DEFAULT '{}'::jsonb,
    sec_8_sistema_mrv JSONB DEFAULT '{}'::jsonb,
    sec_9_calidad_datos JSONB DEFAULT '{}'::jsonb,
    sec_10_trazabilidad JSONB DEFAULT '{}'::jsonb,
    sec_11_evidencia JSONB DEFAULT '{}'::jsonb,
    sec_12_impacto_ampliado JSONB DEFAULT '{}'::jsonb,
    sec_13_integracion_esg JSONB DEFAULT '{}'::jsonb,
    sec_14_auditoria_emision JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. MÓDULO DE DIAGNÓSTICO ADN (Pilar 1)
-- Tabla para registrar los valores iniciales de las 7 dimensiones aplicados a los Alcances 1, 2 y 3.
CREATE TABLE IF NOT EXISTS diagnostico_multihuella (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID REFERENCES proyectos_auditoria(id) ON DELETE CASCADE,
    
    -- Dimensión 1: Carbono
    carbono_alcance_1 NUMERIC DEFAULT 0,
    carbono_alcance_2 NUMERIC DEFAULT 0,
    carbono_alcance_3 NUMERIC DEFAULT 0,
    
    -- Dimensión 2: Plástica
    plastica_alcance_1 NUMERIC DEFAULT 0,
    plastica_alcance_2 NUMERIC DEFAULT 0,
    plastica_alcance_3 NUMERIC DEFAULT 0,
    
    -- Dimensión 3: Hídrica
    hidrica_alcance_1 NUMERIC DEFAULT 0,
    hidrica_alcance_2 NUMERIC DEFAULT 0,
    hidrica_alcance_3 NUMERIC DEFAULT 0,
    
    -- Dimensión 4: Química
    quimica_alcance_1 NUMERIC DEFAULT 0,
    quimica_alcance_2 NUMERIC DEFAULT 0,
    quimica_alcance_3 NUMERIC DEFAULT 0,
    
    -- Dimensión 5: Energética
    energetica_alcance_1 NUMERIC DEFAULT 0,
    energetica_alcance_2 NUMERIC DEFAULT 0,
    energetica_alcance_3 NUMERIC DEFAULT 0,
    
    -- Dimensión 6: Ecosistémica
    ecosistemica_alcance_1 NUMERIC DEFAULT 0,
    ecosistemica_alcance_2 NUMERIC DEFAULT 0,
    ecosistemica_alcance_3 NUMERIC DEFAULT 0,
    
    -- Dimensión 7: Educativa
    educativa_alcance_1 NUMERIC DEFAULT 0,
    educativa_alcance_2 NUMERIC DEFAULT 0,
    educativa_alcance_3 NUMERIC DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. LÓGICA DEL PILAR 2 (Salud Ambiental)
-- Sistema de banderas (flags) para sustancias químicas críticas.
CREATE TABLE IF NOT EXISTS salud_ambiental_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID REFERENCES proyectos_auditoria(id) ON DELETE CASCADE,
    categoria_sustancia VARCHAR(100), -- Ej: 'PFAS', 'Bisfenoles', 'Ftalatos'
    etapa_cadena_valor VARCHAR(100), -- Ej: 'Materia Prima', 'Producción', 'Fin de Vida'
    nivel_riesgo VARCHAR(20) CHECK (nivel_riesgo IN ('Bajo', 'Medio', 'Alto', 'Crítico')),
    flag_activa BOOLEAN DEFAULT true,
    evidencia_sustitucion TEXT, -- Registro de si se inició algún plan de sustitución
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. GENERACIÓN DEL ID DE TRAZABILIDAD (CUV)
-- Función PL/pgSQL para generar el CUV automáticamente siguiendo la anatomía de la Sección 8.4
-- Formato: UCAM-[TIPO]-[GEO]-[AÑO]-[LOTE]
CREATE OR REPLACE FUNCTION generar_cuv_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo generamos el CUV si los componentes básicos están presentes y el cuv está vacío
    IF NEW.tipo_proyecto IS NOT NULL AND NEW.geografia IS NOT NULL AND NEW.anio IS NOT NULL AND NEW.lote IS NOT NULL AND NEW.cuv IS NULL THEN
        NEW.cuv := 'UCAM-' || NEW.tipo_proyecto || '-' || NEW.geografia || '-' || NEW.anio || '-' || NEW.lote;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para ejecutar la función antes de insertar o actualizar un proyecto
CREATE TRIGGER tr_generar_cuv
BEFORE INSERT OR UPDATE ON proyectos_auditoria
FOR EACH ROW
EXECUTE FUNCTION generar_cuv_trigger();

-- Trigger para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_proyectos_auditoria_updated_at
BEFORE UPDATE ON proyectos_auditoria
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_diagnostico_multihuella_updated_at
BEFORE UPDATE ON diagnostico_multihuella
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_salud_ambiental_flags_updated_at
BEFORE UPDATE ON salud_ambiental_flags
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
