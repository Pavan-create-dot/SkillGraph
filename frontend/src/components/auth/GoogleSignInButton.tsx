import React, { useEffect, useRef } from 'react';

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  label?: 'signin_with' | 'signup_with' | 'continue_with';
}

/** Renders the official Google Identity Services One-Tap / button widget. */
const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onCredential,
  label = 'signin_with',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId) return; // Guard: no client ID configured
    if (!containerRef.current) return;

    const scriptId = 'google-gsi-script';

    const initGoogle = () => {
      if (!window.google || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          onCredential(response.credential);
        },
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: label,
        shape: 'rectangular',
        width: containerRef.current.clientWidth || 320,
        logo_alignment: 'left',
      });
    };

    // If script is already loaded, just init
    if (window.google?.accounts) {
      initGoogle();
      return;
    }

    // Inject script once
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    } else {
      // Script tag exists but onload already fired — try polling
      const interval = setInterval(() => {
        if (window.google?.accounts) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [clientId, label, onCredential]);

  if (!clientId) {
    return null; // Don't render anything if Google Sign-In isn't configured
  }

  return <div ref={containerRef} className="w-full" style={{ minHeight: 44 }} />;
};

export default GoogleSignInButton;

// Extend window to include google GSI SDK types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
              logo_alignment?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}
