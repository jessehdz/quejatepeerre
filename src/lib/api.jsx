import { supabase } from "./supabase";

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