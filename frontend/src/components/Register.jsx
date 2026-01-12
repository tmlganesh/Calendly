import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import LightRays from './LightRays';
import './Auth.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await authAPI.register(email, password);
            // Auto-login after registration
            const loginResponse = await authAPI.login(email, password);
            login({ email }, loginResponse.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
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

            {/* Content */}
            <div className="auth-content">
                {/* Logo and Title */}
                <div className="auth-header">
                    <h1 className="auth-logo">Calendly</h1>
                    <p className="auth-subtitle">Create your account</p>
                </div>

                {/* Register Form */}
                <div className="auth-card">
                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                {/* Back to Home */}
                <Link to="/" className="back-link">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
};

export default Register;
