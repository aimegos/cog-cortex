/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Loader, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

const getFriendlyAuthError = (message: string) => {
  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'No account matched those credentials. Create an account first, or check the email and password.';
  }

  return message;
};

export const AuthScreen = () => {
  const {
    signIn,
    signUp,
    sendMagicLink,
    requestPasswordReset,
    updatePassword,
    isPasswordRecovery,
    isLoading,
    error,
  } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setNotice(null);

    if (isPasswordRecovery) {
      if (!password || !confirmPassword) {
        setLocalError('Please enter and confirm your new password');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return;
      }

      try {
        await updatePassword(password);
        setPassword('');
        setConfirmPassword('');
        setNotice('Password updated. You are signed in now.');
      } catch (err) {
        setLocalError(
          err instanceof Error ? getFriendlyAuthError(err.message) : 'Password update failed'
        );
      }
      return;
    }

    if (mode === 'reset') {
      if (!email) {
        setLocalError('Enter your email address first');
        return;
      }

      try {
        await requestPasswordReset(email);
        setNotice('Password reset email sent. Use the link in that email to set a new password.');
      } catch (err) {
        setLocalError(
          err instanceof Error ? getFriendlyAuthError(err.message) : 'Password reset failed'
        );
      }
      return;
    }

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters');
        return;
      }

      try {
        const result = await signUp(email, password);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        if (result.needsEmailConfirmation) {
          setNotice('Account created. Check your email to confirm it, then sign in.');
          setMode('signin');
        } else {
          setNotice('Account created. You are signed in now.');
        }
      } catch (err) {
        setLocalError(
          err instanceof Error ? getFriendlyAuthError(err.message) : 'Sign up failed'
        );
      }
    } else {
      try {
        await signIn(email, password);
      } catch (err) {
        setLocalError(
          err instanceof Error ? getFriendlyAuthError(err.message) : 'Sign in failed'
        );
      }
    }
  };

  const handleMagicLink = async () => {
    setLocalError(null);
    setNotice(null);

    if (!email) {
      setLocalError('Enter your email address first');
      return;
    }

    try {
      await sendMagicLink(email);
      setNotice('Magic link sent. Check your email and open the link on this device.');
    } catch (err) {
      setLocalError(
        err instanceof Error ? getFriendlyAuthError(err.message) : 'Magic link failed'
      );
    }
  };

  const switchMode = (nextMode: 'signin' | 'signup' | 'reset') => {
    setMode(nextMode);
    setLocalError(null);
    setNotice(null);
    setPassword('');
    setConfirmPassword('');
  };

  const title = isPasswordRecovery
    ? 'Set New Password'
    : mode === 'reset'
      ? 'Reset Password'
      : mode === 'signin'
        ? 'Sign In'
        : 'Create Account';

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#1a1c1a]">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(45deg, #10b981 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Cognitive Cortex
          </h1>
          <p className="text-sm text-white/40 font-mono tracking-widest">
            Personal OS for ND/PDA
          </p>
        </div>

        {/* Auth Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 mb-8"
          key={isPasswordRecovery ? 'recovery' : mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center -mb-1">
            <p className="text-xs text-emerald-300 font-mono uppercase tracking-widest">
              {title}
            </p>
          </div>

          {!isPasswordRecovery && (
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* Password */}
          {mode !== 'reset' && (
            <div>
            <label className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2 block">
              {isPasswordRecovery ? 'New Password' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                name="password"
                autoComplete={mode === 'signin' && !isPasswordRecovery ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-sm"
              />
            </div>
          </div>
          )}

          {/* Confirm Password (signup only) */}
          {(mode === 'signup' || isPasswordRecovery) && (
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  name="confirm-password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300 font-mono">
                {localError || (error ? getFriendlyAuthError(error.message) : null)}
              </p>
            </motion.div>
          )}

          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
            >
              <p className="text-xs text-emerald-200 font-mono">{notice}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full py-3 px-4 rounded-lg font-mono text-sm uppercase tracking-widest transition-all',
              isLoading
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95'
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : isPasswordRecovery ? (
              'Update Password'
            ) : mode === 'reset' ? (
              'Send Reset Email'
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

          {mode === 'signin' && !isPasswordRecovery && (
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-mono text-sm uppercase tracking-widest transition-all bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Send Magic Link
            </button>
          )}
        </motion.form>

        {/* Toggle Mode */}
        {!isPasswordRecovery && (
          <div className="text-center space-y-3">
            <p className="text-xs text-white/40">
              {mode === 'signin'
                ? "Don't have an account?"
                : mode === 'signup'
                  ? 'Already have an account?'
                  : 'Remembered your password?'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-mono tracking-widest uppercase transition-colors"
              >
                {mode === 'signin' ? 'Create Account' : 'Sign In'}
              </button>
              {mode !== 'reset' && (
                <button
                  onClick={() => switchMode('reset')}
                  className="text-white/50 hover:text-white/80 text-sm font-mono tracking-widest uppercase transition-colors"
                >
                  Reset Password
                </button>
              )}
            </div>
          </div>
        )}

        {/* Account Setup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg"
        >
          <p className="text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">
            First Time Here?
          </p>
          <p className="text-xs text-white/40 font-mono">
            Create an account before signing in. Supabase Auth stores real users per project, so demo credentials only work after that user exists.
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${i === 0 ? '#10b981' : i === 1 ? '#0ea5e9' : '#a855f7'}, transparent)`,
              left: `${i * 33}%`,
              top: `${i * 25}%`,
            }}
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};
