import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/app/lib/supabaseBrowser";

export function useSupabaseSession() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!cancelled) {
        setSession(s);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { supabase, session, user: session?.user ?? null, loading };
}
