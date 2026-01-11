import './EventForm.css';

const EventCard = ({ event, onEdit, onDelete }) => {
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="event-card">
            <div className="event-card-header">
                <h4 className="event-card-title">{event.title}</h4>
                <div className="event-card-actions">
                    <button onClick={() => onEdit(event)} title="Edit">
                        ✏️
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => onDelete(event.id)}
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            </div>
            <div className="event-card-time">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </div>
            <div className="event-card-date">
                {formatDate(event.event_date)}
            </div>
            {event.description && (
                <p className="event-card-description">{event.description}</p>
            )}
        </div>
    );
};

export default EventCard;
