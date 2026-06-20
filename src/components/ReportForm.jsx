import { useState } from 'react';
import { CATEGORIES } from '../lib/constants';
import { submitReport, uploadImage, validatePhoto } from '../lib/api';
import './ReportForm.css';
import { IoCloseCircle, IoCamera, IoImagesOutline, IoCheckmarkSharp } from "react-icons/io5";

/* ReportForm - A form component for submitting new reports.
Props:
- isOpen: boolean - whether the form is currently open/visible
- onClose: function() - callback to close the form
- lng: longitude coordinates of the report location
- lat: latitude coordinates of the report location
- municipality: string - the name of the municipality (for display)
- onSubmit: function(reportData) - callback to handle form submission, receives the report data object
*/

function ReportForm({ isOpen, onClose, lng, lat, municipality, exactLocation, onSubmit }) {

    // category and subcategory states
    const [category, setCategory] = useState(null); // category selection
    const [subcategory, setSubcategory] = useState(null); // subcategory selection

    // form input states
    const [title, setTitle] = useState(''); // report title input text
    const [description, setDescription] = useState(''); // report description input textarea
    const [photo, setPhoto] = useState(null); 
    const [photoPreview, setPhotoPreview] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // submission and validation states
    const [submitting, setSubmitting] = useState(false);
    const [photoError, setPhotoError] = useState(null); // error specific to image upload
    const [submitError, setSubmitError] = useState(null); // error specific to report submission
    const [errors, setErrors] = useState({}); // field-level validation errors
    const [successMessage, setSuccessMessage] = useState(null);

    // subcategory reset when category changes
    function handleCategorySelect(catKey) {
        setCategory(catKey);
        setSubcategory(null); 
    }

    function handlePhotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const validationError = validatePhoto(file);
        if (validationError) {
            setPhotoError(validationError);
            e.target.value = ''; // reset input so same file can be retried
            return;
        }

        setPhotoError(null);
        setPhoto(file);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    }

    function handleRemovePhoto() {
        setPhoto(null);
        setPhotoPreview(null);
        setPhotoError(null);
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

    async function handleSubmit() {
        if (!validate()) return;

        setSubmitting(true);
        setPhotoError(null);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            let imageURL = null;

            if (photo) {
                setUploadingPhoto(true);
                imageURL = await uploadImage(photo);
                setUploadingPhoto(false);
            }

            await submitReport({
                category,
                subcategory: subcategory || null,
                title: title.trim(),
                description: description.trim(),
                lng,
                lat,
                municipality: municipality || 'Puerto Rico',
                exact_location: exactLocation || null,
                image_url: imageURL,
                draft: false,
                status: 'open',
                vote_count: 0,
            });

            setSuccessMessage(true);

        } catch (error) {
            console.error("Submission error:", error);
            if (error.source === 'photo') {
                setPhotoError(error.userMessage ?? 'Error al subir la foto. Intenta de nuevo.');
            } else {
                setSubmitError(error.userMessage ?? 'Error al enviar el reporte. Por favor intenta de nuevo.');
            }
        } finally {
            setSubmitting(false);
            setUploadingPhoto(false);
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
                        <button className='close-btn' style={{marginTop: 24}} onClick={onClose}><IoCloseCircle size={28} color="var(--cel)" /></button>
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
                    <button className='close-btn' onClick={onClose}><IoCloseCircle size={28} /></button>
                </div>
                    
                {/* municipality and exact location display - auto-populated (read only) */}
                {/* <div className='form-field'>
                    <label className='form-label' htmlFor="formMunicipality">Municipio:</label>
                    <div className='form-static'>
                        {municipality || 'Toca el mapa para seleccionar ubicación'}
                    </div>
                </div>
                <div className='form-field'>
                    <label className='form-label' htmlFor="formLocation">Ubicación exacta:</label>
                    <div className='form-static-loc'>
                        {exactLocation || 'Toca el mapa para seleccionar ubicación'}
                    </div>
                </div> */}

                <div className='loc-block'>
                    <div className='loc-label'>UBICACIÓN</div>
                    <div className='loc-muni'>{municipality || 'Toca el mapa para seleccionar ubicación'}</div>
                    <div className='loc-exact'>{exactLocation || ''}</div>
                    <div className='loc-badge'>GPS <IoCheckmarkSharp /></div>
                    <button className='loc-change-btn' >
                        Corregir ubicación
                    </button>
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

                {/* photo upload */}
                <div className='form-field'>
                    <label className='form-label'>FOTO DE EVIDENCIA</label>
                    {photoPreview ? (
                        <div className='photo-preview-wrap'>
                            <img src={photoPreview} alt='Evidencia' className='photo-preview' />
                            <button className='remove-photo-btn' onClick={handleRemovePhoto}>
                                <IoCloseCircle size={28} />
                            </button>
                        </div>
                    ) : (
                        <div className='photo-upload-group'>
                            {/* primary: open camera directly */}
                            <label className='photo-upload-btn camera-btn'>
                                <IoCamera className='photo-upload-icon' size={20} />
                                <span className='photo-upload-label'>Tomar foto</span>
                                <input
                                    type='file'
                                    accept='image/*'
                                    capture='environment'
                                    onChange={handlePhotoChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {/* secondary: pick from gallery */}
                            <label className='photo-upload-btn gallery-btn'>
                                <IoImagesOutline size={18} />
                                <span className='photo-upload-label'>Elegir de galería</span>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handlePhotoChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    )}

                    {photoError && <p className='form-error photo-field-error'>{photoError}</p>}

                    <p className='photo-note'>
                        La foto debe mostrar claramente el problema. Se usará como evidencia para que las autoridades tomen acción. No subas fotos de personas o información privada.
                    </p>
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
                    {uploadingPhoto ? 'Subiendo foto...' : submitting ? 'Enviando...' : 'Enviar reporte'}
                </button>
            </div>
        </>
    );
}

export default ReportForm;