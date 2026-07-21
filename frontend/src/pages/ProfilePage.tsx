import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [email, setEmail] = useState(user?.email ?? '');
  const [name, setName] = useState(user?.name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await updateProfile(name, email);
      setMessage(response.success ? 'Profile updated successfully.' : response.message);
    } catch {
      setMessage('Unable to update profile. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Account</p>
            <h1 className="text-3xl font-bold text-white mt-2">Profile</h1>
          </div>
          <div className="rounded-3xl bg-slate-950/80 border border-slate-800 px-5 py-4 text-sm text-slate-300">
            Member since {new Date(user?.createdAt ?? Date.now()).toLocaleDateString()}
          </div>
        </div>

        <p className="text-slate-400 mt-4 max-w-2xl">
          Your account details are stored securely. Profile editing is coming soon with expanded account management.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Personal Details</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={isSaving} className="btn-primary px-6 py-3 text-sm font-semibold">
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
            {message && <p className="text-sm text-slate-400 mt-2">{message}</p>}
          </form>
        </div>

        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Account Security</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Password updates and multi-factor authentication are coming soon to keep your account secure.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Roadmap Settings</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              You can update your roadmap preferences, goal types, and notification settings from this page once profile editing is enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
