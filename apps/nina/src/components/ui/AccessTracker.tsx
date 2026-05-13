"use client";

import { useEffect, useRef } from "react";

interface AccessTrackerProps {
  portalName: string;
}

export function AccessTracker({ portalName }: AccessTrackerProps) {
  const loggedRef = useRef(false);

  useEffect(() => {
    // Only run once per session load
    if (loggedRef.current) return;

    const logAccess = async () => {
      try {
        // Simple access log without Supabase for now, to fix build errors
        await fetch("/api/security/log-access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ portalName }),
        });
        loggedRef.current = true;
      } catch (err) {
        console.error("AccessTracker Error:", err);
      }
    };

    logAccess();
  }, [portalName]);

  return null; // Invisible component
}
