import './ReportForm.css';
import { CgCloseO } from "react-icons/cg";

/* ReportForm - A form component for submitting new reports.
Props:
- isOpen: boolean - whether the form is currently open/visible
- onClose: function() - callback to close the form
- location: { lat, lng } - the coordinates of the report location
- municipality: string - the name of the municipality (for display)
- onSubmit: function(reportData) - callback to handle form submission, receives the report data object
*/

function ReportForm({ isOpen, onClose, location, municipality, onSubmit }) {
    if (!isOpen) return null; // don't render anything if the form is not open

    return (
        <>
            {/* backdrop - dark overlay behind the form */}
            <div className="form-backdrop" onClick={onClose} />
            {/* form panel */}
            <div className='form-panel'>
                    
                {/* form handle - "swipe to close" signal */}
                <div className='form-handle' />
                <div className='form-header'>
                    <h2 className='form-title'>Nuevo Reporte</h2>
                    <button className='close-btn' onClick={onClose}><CgCloseO /></button>
                </div>
                    
                {/* municipality display - auto-populated */}
                <div className='form-field'>
                    <label className='form-label' htmlFor="formMunicipality">Municipio:</label>
                    <div className='form-static'>
                        {municipality || 'Toca el mapa para seleccionar ubicación'}
                    </div>
                </div>
                
                
                {/* placeholder: field for report details */}
                <p style={{ color: 'var(--muted)', fontFamily: 'DM Mono', fontSize: 11, padding: '8px 0' }}>
                    [Aquí irían los campos para detalles del reporte - por ahora es solo un placeholder de texto.]
                </p>
            </div>
        </>
    );
}

export default ReportForm;