import { Megaphone } from 'lucide-react';
import './UpvoteButton.css';

// Translucent by default, solid red once voted. `variant="pill"` is the
// compact inline shape (ReportCard, ReportDetail); `variant="block"` is the
// bigger column tap-target (ReportForm's nearby-report list). `label` and
// `count` are independent — most callers pass only one, but the photo
// preview's full-width row passes both.
function UpvoteButton({
    variant = 'pill', count, voted = false, voting = false, disabled = false,
    onClick, label, title, ariaLabel = 'Yo también', className = '',
}) {
    return (
        <button
            className={`upvote-btn upvote-btn-${variant}${voted ? ' voted' : ''}${className ? ` ${className}` : ''}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
            aria-label={ariaLabel}
        >
            <Megaphone size={variant === 'pill' ? 18 : 20} />
            {label && <span className="upvote-btn-label">{voting ? '...' : label}</span>}
            {count !== undefined && <span className="upvote-btn-text">{count}</span>}
        </button>
    );
}

export default UpvoteButton;
