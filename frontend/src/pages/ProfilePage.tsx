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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-700 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Candidate Profile
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Profile Settings</h1>
            <p className="text-slate-500 text-sm mt-1">
              Set your name, email, and target role for the interview flow.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-500 text-center sm:text-right">
            <div>Member since</div>
            <div className="font-bold text-slate-800 mt-0.5">
              {new Date(user?.createdAt ?? Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Profile Form ───────────────────────────────────── */}
      <div className="card bg-white">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span>👤</span> Personal Information
        </h2>

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
            <span className="text-xs text-slate-400 mt-1.5 block">
              Used by the AI to tailor interview questions and resume analysis to your goal.
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary px-6 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xs"
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>

            {message && (
              <p
                className={`text-xs font-semibold ${
                  message.isError ? 'text-rose-600' : 'text-emerald-600'
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
