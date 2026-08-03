import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      navigate('/resume', { replace: true });
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(
          err.response?.data?.message || 'Registration failed. Please check your details.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">Get Started</h2>
      <p className="text-slate-500 text-sm text-center mb-8">
        Create your free SkillGraph account
      </p>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="input-field"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {validationErrors.name && (
            <p className="mt-1 text-xs text-rose-600">{validationErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {validationErrors.email && (
            <p className="mt-1 text-xs text-rose-600">{validationErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {validationErrors.password && (
            <p className="mt-1 text-xs text-rose-600">{validationErrors.password[0]}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className="input-field"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-2.5 font-semibold mt-2"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
