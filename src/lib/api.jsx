import { supabase } from "./supabase";

const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

// validatePhoto - client-side photo check before upload. Returns an error message string or null.
export function validatePhoto(file) {
    if (file.size > MAX_PHOTO_SIZE) {
        return `La foto es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)} MB). El límite es 10 MB.`;
    }
    // Allow all common image types; the type can be empty for HEIC on some devices
    if (file.type && !ALLOWED_PHOTO_TYPES.includes(file.type.toLowerCase())) {
        return 'Solo se aceptan fotos JPG, PNG, WEBP o HEIC (iPhone).';
    }
    return null;
}

function makeError(message, original, source) {
    const err = new Error(message);
    err.userMessage = message;
    err.originalError = original;
    err.source = source; // 'photo' | 'submit'
    return err;
}

// uploadImage - uploads an image file to Supabase storage and returns the public URL
export async function uploadImage(file) {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
        .from('report-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
        console.error("StorageApiError uploading image:", error);
        const msg = error.message?.toLowerCase() ?? '';
        const status = String(error.statusCode ?? '');
        if (status === '413' || msg.includes('too large') || msg.includes('payload')) {
            throw makeError('La foto es demasiado grande. El límite es 10 MB.', error, 'photo');
        }
        if (status === '415' || msg.includes('mime') || msg.includes('type')) {
            throw makeError('Tipo de archivo no permitido. Solo se aceptan fotos JPG, PNG, WEBP o HEIC.', error, 'photo');
        }
        if (status === '403' || msg.includes('unauthorized') || msg.includes('security policy')) {
            throw makeError('Sin permiso para subir fotos. Intenta de nuevo más tarde.', error, 'photo');
        }
        if (status === '404' || msg.includes('bucket')) {
            throw makeError('Error de configuración al subir la foto. Contacta al administrador.', error, 'photo');
        }
        throw makeError('Error al subir la foto. Verifica tu conexión e intenta de nuevo.', error, 'photo');
    }

    const { data } = supabase.storage.from('report-images').getPublicUrl(fileName);
    return data.publicUrl;
}

// submitReport - saves new reports to the Supabase database
export async function submitReport(reportData) {
    const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();

    if (error) {
        console.error("Error submitting report:", error);
        const msg = error.message?.toLowerCase() ?? '';
        const code = error.code ?? '';
        if (code === '23502' || msg.includes('null value')) {
            throw makeError('Faltan datos requeridos. Revisa todos los campos del formulario.', error, 'submit');
        }
        if (code === '23505') {
            throw makeError('Ya existe un reporte idéntico. Verifica si ya fue enviado.', error, 'submit');
        }
        if (code === '42501' || msg.includes('row-level security') || msg.includes('policy')) {
            throw makeError('Sin permiso para enviar reportes ahora mismo. Intenta de nuevo más tarde.', error, 'submit');
        }
        if (msg.includes('network') || msg.includes('failed to fetch')) {
            throw makeError('Sin conexión a internet. Verifica tu red e intenta de nuevo.', error, 'submit');
        }
        throw makeError('Error inesperado al enviar el reporte. Por favor intenta de nuevo.', error, 'submit');
    }

    return data;
}

// upvoteReport - RPC-first, read-then-update-fallback vote increment.
// Returns the new vote_count, or throws on hard failure. Callers own their
// own local voted/voting UI state — that legitimately differs per component.
export async function upvoteReport(reportId, fallbackCount = 0) {
    const { data, error } = await supabase.rpc('increment_vote', { report_id: reportId });
    if (!error) {
        return typeof data === 'number' ? data : fallbackCount + 1;
    }
    // RPC not available — fallback: read fresh count then update
    const { data: fresh } = await supabase
        .from('reports').select('vote_count').eq('id', reportId).single();
    const current = fresh?.vote_count ?? fallbackCount;
    const { error: ue } = await supabase
        .from('reports').update({ vote_count: current + 1 }).eq('id', reportId);
    if (ue) throw ue;
    return current + 1;
}

// getReports - returns all open reports, newest first (to implement later: filter by municipality and status)
export async function getReports() {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'open') // only get open reports
        .order('created_at', { ascending: false }); // newest first
    
    if (error) {
        console.error("Error fetching reports:", error);
        throw error;
    }
    
    return data; // return the array of report objects
}