import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="landing">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="logo">
                        <span className="logo-icon">📅</span>
                        <span className="logo-text">CalendarPro</span>
                    </div>
                    <div className="nav-links">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost">Sign In</Link>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content animate-fadeIn">
                    <h1 className="hero-title">
                        Organize Your Life<br />
                        <span className="gradient-text">One Day at a Time</span>
                    </h1>
                    <p className="hero-subtitle">
                        A beautiful, intuitive calendar app to manage your events,
                        schedule meetings, and never miss an important moment.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Start Free Today
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">
                            Sign In
                        </Link>
                    </div>
                </div>
                <div className="hero-visual animate-fadeIn">
                    <div className="calendar-preview">
                        <div className="preview-header">
                            <span>January 2026</span>
                            <div className="preview-nav">
                                <button>‹</button>
                                <button>›</button>
                            </div>
                        </div>
                        <div className="preview-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="preview-day-header">{day}</div>
                            ))}
                            {Array.from({ length: 31 }, (_, i) => (
                                <div
                                    key={i}
                                    className={`preview-day ${i + 1 === 11 ? 'today' : ''} ${[5, 12, 18, 25].includes(i + 1) ? 'has-event' : ''}`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="features-container">
                    <h2 className="section-title">Everything You Need</h2>
                    <p className="section-subtitle">Powerful features to keep your schedule organized</p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📆</div>
                            <h3>Multiple Views</h3>
                            <p>Switch between monthly, weekly, and daily views to see your schedule the way you want.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>Easy Event Management</h3>
                            <p>Create, edit, and delete events with just a few clicks. Add descriptions and set reminders.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔔</div>
                            <h3>Smart Notifications</h3>
                            <p>Never miss an event with customizable notifications 5, 10, or 30 minutes before.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Private & Secure</h3>
                            <p>Your calendar is private. Only you can see and manage your events.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🌙</div>
                            <h3>Dark Mode</h3>
                            <p>Easy on the eyes with a beautiful dark mode for late-night planning sessions.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Responsive Design</h3>
                            <p>Access your calendar from any device - desktop, tablet, or mobile.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-container">
                    <div className="stat-item">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Active Users</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">50K+</span>
                        <span className="stat-label">Events Created</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">99.9%</span>
                        <span className="stat-label">Uptime</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Support</span>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="cta-container">
                    <h2>Ready to Get Organized?</h2>
                    <p>Join thousands of users who trust CalendarPro to manage their busy lives.</p>
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Create Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <span className="logo-icon">📅</span>
                        <span className="logo-text">CalendarPro</span>
                    </div>
                    <p className="footer-copy">© 2026 CalendarPro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
