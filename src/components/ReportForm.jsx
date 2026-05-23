import { useState } from 'react';
import { CATEGORIES } from '../lib/constants';
import { submitReport } from '../lib/api';
import './ReportForm.css';
import { CgCloseO } from "react-icons/cg";

/* ReportForm - A form component for submitting new reports.
Props:
- isOpen: boolean - whether the form is currently open/visible
- onClose: function() - callback to close the form
- lng: longitude coordinates of the report location
- lat: latitude coordinates of the report location
- municipality: string - the name of the municipality (for display)
- onSubmit: function(reportData) - callback to handle form submission, receives the report data object
*/

function ReportForm({ isOpen, onClose, lng, lat, municipality, onSubmit }) {

    const [category, setCategory] = useState(null); // category selection
    const [subcategory, setSubcategory] = useState(null); // subcategory selection

    const [title, setTitle] = useState(''); // report title input text
    const [description, setDescription] = useState(''); // report description input textarea
    const [submitting, setSubmitting] = useState(false); // submission state for showing loading indicator
    const [submitError, setSubmitError] = useState(null); // error state for submission errors
    const [errors, setErrors] = useState({}); // validation errors for form fields
    const [successMessage, setSuccessMessage] = useState(null); // success message after successful submission

    // subcategory reset when category changes
    function handleCategorySelect(catKey) {
        setCategory(catKey);
        setSubcategory(null); 
    }

    // find the selected category object based on the selected category key, used to display category-specific subcategories and colors
    const selectedCategory = CATEGORIES.find(c => c.key === category);

    // input field validation
    function validate() {
        const newErrors = {};
        // category must be selected
        if (!category) newErrors.category = 'Selecciona una categoría.';
        // if the selected category has subcategories, a subcategory must be selected
        const hasSubs = selectedCategory?.subcategories.length > 0;
        if (hasSubs && !subcategory) newErrors.category = 'Selecciona una subcategoría.';

        // title and description must not be empty (removes whitespace)
        if (!title.trim()) newErrors.title = 'El título no puede estar vacío.';
        if (!description.trim()) newErrors.description = 'La descripción no puede estar vacía.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // valid if no errors
    }

    // submit button state - grayed out and unclickable if currently submitting or if validation fails
    const isValid = category && title.trim() && description.trim().length >= 20;

    // handle form submission
    async function handleSubmit() {
        if (!validate()) return; // if validation fails, do not submit
        
        setSubmitting(true);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            // success or error response when submitting the report data to the API
            await submitReport({
                category,
                subcategory: subcategory || null,
                title: title.trim(),
                description: description.trim(),
                lng,
                lat,
                municipality: municipality || 'Puerto Rico',
                status: 'open', // new reports start with 'open' status
                vote_count: 0, // initial vote count for new reports
            });

            // successful submission
            setSuccessMessage(true);
            
        } catch (error) {
            // error during submission
            console.error("Error submitting report:", error);
            setSubmitError('Hubo un error al enviar tu reporte. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        } 
    }

    if (!isOpen) return null; // don't render anything if the form is not open

    

    // success screen after successful submission
    if (successMessage) {
        return (
            <>
                <div className="form-backdrop" onClick={onSubmit} />
                <div className='form-panel'>
                    <div className='form-handle' />
                    <div className='form-success'>
                        <div className='success-icon'>✓</div>
                        <h3 className='success-title'>Tu reporte ha sido enviado</h3>
                        <p className='success-sub'>Gracias por hacer Puerto Rico mejor.</p>
                        <button className='close-btn' style={{marginTop: 24}} onClick={onClose}>Cerrar</button>
                    </div>
                    
                </div>
            </>
        );
    }


    // main form
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
                    
                {/* municipality display - auto-populated (read only) */}
                <div className='form-field'>
                    <label className='form-label' htmlFor="formMunicipality">Municipio:</label>
                    <div className='form-static'>
                        {municipality || 'Toca el mapa para seleccionar ubicación'}
                    </div>
                </div>
                
                {/* main category picker */}
                <div className='form-field'>
                    <label className='form-label'>CATEGORÍA</label>
                    <div className='cat-grid-main'>
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat.key}
                                className={`cat-btn-main ${category === cat.key ? 'selected' : ''}`}
                                // sets cat color per button
                                style={{ '--cat-color': cat.color }} 
                                onClick={() => handleCategorySelect(cat.key)}
                            >
                                <span className='cat-btn-icon'><cat.icon /></span>
                                <span className='cat-btn-label'>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                    {/* validation error message below grid if validation fails */}
                    {errors.category && <p className='form-error'>{errors.category}</p>}
                </div>

                {/* subcategory picker - only shows if a main category is selected */}
                {selectedCategory && selectedCategory.subcategories.length > 0 && (
                    <div className='form-field'>
                        <label className='form-label'>SUBCATEGORÍA</label>
                        <div className='sub-cat-grid'>
                            {selectedCategory.subcategories.map(subcat => (
                                <button 
                                    key={subcat}
                                    className={`sub-cat-btn ${subcategory === subcat ? 'selected' : ''}`}
                                    style={{ '--cat-color': selectedCategory.color }}
                                    onClick={() => setSubcategory(subcat)}
                                >
                                    {subcat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* title input */}
                <div className='form-field'>
                    <label className='form-label'>TÍTULO</label>
                    <input
                        className={`form-input ${errors.title ? 'input-error' : ''}`}
                        type='text'
                        maxLength={80}
                        placeholder='Describe brevemente el problema'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    {errors.title && <p className='form-error'>{errors.title}</p>}
                </div>

                {/* description textarea */}
                <div className='form-field'>
                    <label className='form-label'>DESCRIPCIÓN</label>
                    <textarea
                        className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                        maxLength={500}
                        placeholder='¿Cuánto tiempo lleva así? ¿Qué tan peligroso es?'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    {/* live character count */}
                    <div className='char-count'>{description.length}/500</div>
                    {errors.description && <p className='form-error'>{errors.description}</p>}
                </div>

                {/* anonymity assurance message */}
                <p className='anon-notice'>Este reporte es 100% anónimo. No se requiere cuenta.</p>

                {/* server level error */}
                {submitError && (
                    <p className='form-error' style={{ marginBottom: 12 }}>{submitError}</p>
                )}

                {/* submit button - disabled until form is valid */}
                <button
                    className={`submit-btn ${!isValid || submitting ? 'disabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={!isValid || submitting}
                >
                    {submitting ? 'Enviando...' : 'Enviar reporte'}
                </button>
            </div>
        </>
    );
}

export default ReportForm;