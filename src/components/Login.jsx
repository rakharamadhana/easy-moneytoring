import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { IonPage, IonContent, IonCard, IonItem, IonInput, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { walletOutline, mailOutline, lockClosedOutline, arrowForwardOutline, alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

export default function Login({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        if (data?.session) {
          onAuthSuccess(data.session);
        } else {
          setSuccessMsg('Success! Check your email for a confirmation link, or sign in now if auto-confirmed.');
          setIsSignUp(false);
          setPassword('');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (data?.session) {
          onAuthSuccess(data.session);
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent scrollY={true} style={{ '--background': '#080b11' }}>
        <div className="relative min-h-screen w-full overflow-x-hidden flex items-center justify-center p-4 bg-[#080b11]">
          {/* Decorative fluid background visual blur blobs */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

          <div className="w-full max-w-md relative z-10">
            {/* Elegant Brand Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.25)] mb-3">
                <IonIcon icon={walletOutline} style={{ fontSize: '32px' }} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-['Outfit']">
                Easy Moneytoring
              </h1>
              <p className="text-slate-400 mt-1.5 text-xs font-semibold uppercase tracking-widest opacity-80">
                Premium Expense Tracking
              </p>
            </div>

            {/* Core Auth Portal Card */}
            <IonCard className="glassmorphism rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5 m-0 bg-slate-950/20 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-5 tracking-tight font-['Outfit']">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Banner */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs font-medium animate-fade-in">
                    <IonIcon icon={alertCircleOutline} className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-medium animate-fade-in">
                    <IonIcon icon={checkmarkCircleOutline} className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Email input field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                  <IonItem fill="none" className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans font-medium text-xs text-white" style={{ '--background': 'transparent', '--inner-padding-end': '0px', '--padding-start': '0px' }}>
                    <div className="flex items-center w-full px-3 py-1">
                      <IonIcon icon={mailOutline} className="text-slate-500 mr-2 w-4 h-4" />
                      <IonInput
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onIonInput={(e) => setEmail(e.detail.value)}
                        className="text-white text-xs font-sans placeholder-slate-500"
                        style={{ '--padding-top': '8px', '--padding-bottom': '8px' }}
                      />
                    </div>
                  </IonItem>
                </div>

                {/* Password input field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Password</label>
                  <IonItem fill="none" className="rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 focus-within:border-emerald-500/60 transition-all font-sans font-medium text-xs text-white" style={{ '--background': 'transparent', '--inner-padding-end': '0px', '--padding-start': '0px' }}>
                    <div className="flex items-center w-full px-3 py-1">
                      <IonIcon icon={lockClosedOutline} className="text-slate-500 mr-2 w-4 h-4" />
                      <IonInput
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onIonInput={(e) => setPassword(e.detail.value)}
                        className="text-white text-xs font-sans placeholder-slate-500"
                        style={{ '--padding-top': '8px', '--padding-bottom': '8px' }}
                      />
                    </div>
                  </IonItem>
                </div>

                {/* Submit Action Button */}
                <IonButton
                  type="submit"
                  disabled={loading}
                  expand="block"
                  className="w-full text-slate-950 font-bold text-xs mt-6 transition-all duration-300"
                  style={{ 
                    '--background': 'linear-gradient(to right, #10b981, #2dd4bf)',
                    '--border-radius': '12px',
                    '--box-shadow': '0 4px 15px rgba(16, 185, 129, 0.25)',
                    '--padding-top': '14px',
                    '--padding-bottom': '14px',
                    '--color': '#022c22',
                    'font-weight': '800'
                  }}
                >
                  {loading ? (
                    <IonSpinner name="crescent" className="text-[#022c22] w-4 h-4" />
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 font-extrabold tracking-wide uppercase">
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <IonIcon icon={arrowForwardOutline} className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </IonButton>
              </form>

              {/* Toggle Mode Switcher */}
              <div className="mt-5 text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
