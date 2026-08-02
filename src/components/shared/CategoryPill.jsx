import './CategoryPill.css';

// Split category chip: solid-color icon block + optional translucent
// subcategory chip on the right. `showLabel` renders the category's own
// name next to the icon (only ReportForm's nearby list needs that).
function CategoryPill({ catData, subcategory, showLabel = false }) {
    if (!catData) return null;
    const Icon = catData.icon;
    return (
        <div className={`cat-pill${showLabel ? ' cat-pill-labeled' : ''}`}>
            <span className="cat-pill-left" style={{ background: catData.color }}>
                <span className="cat-pill-icon">{Icon && <Icon />}</span>
                {showLabel && <span className="cat-pill-label">{catData.label.toUpperCase()}</span>}
            </span>
            {subcategory && (
                <span className="cat-pill-right">{subcategory.toUpperCase()}</span>
            )}
        </div>
    );
}

export default CategoryPill;
