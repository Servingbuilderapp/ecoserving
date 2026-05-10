import { NextResponse } from 'next/server';

/**
 * Lógicas de Validación MRV - Fase 2 (Medición)
 * Implementa los filtros de integridad del ADN UCAM CERT SIIA
 */

// 1. Validador de Metadata (Requisito Crítico)
// Verifica que la evidencia fotográfica contenga coordenadas GPS, fecha y hora en los metadatos EXIF.
export function validarMetadataEvidencia(exifData: any) {
  // Verificamos si los datos EXIF existen y contienen GPS y Fecha/Hora original
  const hasGPS = exifData?.gpsLatitude && exifData?.gpsLongitude;
  const hasDateTime = exifData?.dateTimeOriginal || exifData?.dateTime;

  if (!hasGPS || !hasDateTime) {
    return {
      isValid: false,
      message: 'Evidencia rechazada: La fotografía no contiene metadatos de georreferenciación. Por favor, captura la imagen nuevamente asegurándote de tener activada la ubicación en tu dispositivo para garantizar la trazabilidad del CUV.',
    };
  }

  return { isValid: true };
}

// 2. Lógica de Criterio Conservador (Principio 5)
// Aplica automáticamente el límite inferior verificable cuando se ingresa un rango.
export function aplicarCriterioConservador(valorMagnitud: string | number | { min: number; max: number }) {
  let valorAplicado: number;

  if (typeof valorMagnitud === 'number') {
    valorAplicado = valorMagnitud;
  } else if (typeof valorMagnitud === 'string') {
    if (valorMagnitud.includes('-')) {
      valorAplicado = parseFloat(valorMagnitud.split('-')[0].trim());
    } else {
      valorAplicado = parseFloat(valorMagnitud);
    }
  } else if (typeof valorMagnitud === 'object' && valorMagnitud !== null && 'min' in valorMagnitud) {
    valorAplicado = valorMagnitud.min;
  } else {
    valorAplicado = 0;
  }

  return {
    valor: valorAplicado,
    message: `Se ha aplicado el Criterio Conservador según el Standard v1.0. Se registrará el valor mínimo de ${valorAplicado} para asegurar la integridad de la auditoría.`,
  };
}

// 3. Verificación de Cadena de Custodia
// Verifica soporte documental para huellas materiales.
export function verificarCadenaCustodia(tipoHuella: 'Plástica' | 'Hídrica' | 'Química' | string, documentoAdjunto: boolean) {
  const huellasMateriales = ['Plástica', 'Hídrica', 'Química'];

  if (huellasMateriales.includes(tipoHuella)) {
    if (!documentoAdjunto) {
      return {
        isValid: false,
        message: `Sección incompleta: Para validar el impacto en la Huella ${tipoHuella}, es obligatorio cargar el documento de cadena de custodia que vincule el origen con el destino final.`,
      };
    }
  }

  return { isValid: true };
}

// 4. Alerta de Doble Conteo (Principio 4)
// Verifica en BD si un lote/ubicación ya generó activos similares en el mismo periodo.
export async function verificarDobleConteo(
  loteId: string, 
  ubicacion: string, 
  periodo: string, 
  verificarEnBD: (lote: string, ubi: string, per: string) => Promise<boolean>
) {
  // La función 'verificarEnBD' simula la consulta a Supabase
  const existeDuplicado = await verificarEnBD(loteId, ubicacion, periodo);

  if (existeDuplicado) {
    return {
      isValid: false,
      message: 'Alerta de Doble Conteo detectada: Ya existen activos registrados para este lote/ubicación en el mismo periodo. El proceso ha sido detenido. Por favor, presente una aclaración técnica sobre la Adicionalidad de este impacto.',
    };
  }

  return { isValid: true };
}
