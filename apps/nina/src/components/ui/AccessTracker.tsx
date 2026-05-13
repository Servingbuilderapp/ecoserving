"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

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
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Send request to API route to log it securely and trigger email if needed
          await fetch("/api/security/log-access", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ portalName }),
          });
          loggedRef.current = true;
        }
      } catch (err) {
        console.error("AccessTracker Error:", err);
      }
    };

    logAccess();
  }, [portalName]);

  return null; // Invisible component
}
