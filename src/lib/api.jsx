import { supabase } from "./supabase";

// uploadImage - uploads an image file to Supabase storage and returns the public URL
export async function uploadImage(file) {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
        .from('report-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });
    if (error) {
        console.error("Error uploading image:", error);
        throw error;
    }

    // store the public URL of the uploaded image to save in the report
    const { data } = supabase.storage
        .from('report-images')
        .getPublicUrl(fileName);
    
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
        throw error;
    }
    
    return data; // return the inserted report data
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