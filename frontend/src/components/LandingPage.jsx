import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LightRays from './LightRays';
import './LandingPage.css';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="landing">
            {/* Light Rays Background */}
            <div className="light-rays-bg">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={0.8}
                    lightSpread={1.5}
                    rayLength={2.5}
                    pulsating={true}
                    fadeDistance={1.2}
                    saturation={1.2}
                    followMouse={true}
                    mouseInfluence={0.15}
                    noiseAmount={0.05}
                    distortion={0.1}
                    className="w-full h-full"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="gradient-overlay" />

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="logo">
                        <span className="logo-text">Calendly</span>
                    </div>
                    <div className="nav-links">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-login">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-login">Login</Link>
                                <Link to="/register" className="btn btn-signup">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section - Centered */}
            <section className="hero-centered">
                <div className="hero-content">
                    <h1 className="hero-title-large">Calendly</h1>
                    <p className="hero-subtitle">
                        Creat Alerts and Events.<br />
                        Without Getting Things Getting Delayed and Ignored.
                    </p>
                    <p className="hero-note">
                        Start Now !!
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
