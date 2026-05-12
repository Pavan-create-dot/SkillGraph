import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [targetRole, setTargetRole] = useState(user?.targetRole ?? 'Full-Stack Developer');

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
      setTargetRole(user.targetRole ?? 'Full-Stack Developer');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await updateProfile({ name, email, targetRole });

      if (response.success) {
        setMessage({ text: 'Profile updated successfully!', isError: false });
      } else {
        setMessage({ text: response.message, isError: true });
      }
    } catch {
      setMessage({ text: 'Unable to update profile. Please try again later.', isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
              Candidate Profile
            </span>
            <h1 className="text-3xl font-bold text-white mt-3">Profile Settings</h1>
            <p className="text-slate-400 text-sm mt-1">
              Set your name, email, and target role for the interview flow.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 px-4 py-3 text-xs text-slate-400 text-center sm:text-right">
            <div>Member since</div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {new Date(user?.createdAt ?? Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Profile Form ───────────────────────────────────── */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>👤</span> Personal Information
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
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
              required
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
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="targetRole">
              Target Role
            </label>
            <input
              id="targetRole"
              type="text"
              placeholder="e.g. Backend Engineer, Full-Stack Developer, SDE-1"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="input-field"
            />
            <span className="text-xs text-slate-500 mt-1 block">
              Used by the AI to tailor interview questions and resume analysis to your goal.
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary px-8 py-3 text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-md"
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>

            {message && (
              <p
                className={`text-sm font-medium ${
                  message.isError ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
