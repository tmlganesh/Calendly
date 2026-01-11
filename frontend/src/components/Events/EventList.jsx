import EventCard from './EventCard';
import './EventForm.css';

const EventList = ({ events, onEdit, onDelete, title, emptyMessage }) => {
    if (!events || events.length === 0) {
        return (
            <div className="event-list-empty">
                <div className="event-list-empty-icon">📅</div>
                <p>{emptyMessage || 'No events to display'}</p>
            </div>
        );
    }

    return (
        <div className="event-list">
            {title && <h3 className="event-list-title">{title}</h3>}
            {events.map(event => (
                <EventCard
                    key={event.id}
                    event={event}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default EventList;
