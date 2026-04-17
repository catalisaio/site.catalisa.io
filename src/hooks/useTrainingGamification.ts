import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { badges, type BadgeDefinition } from '../data/trainingGamification';

export interface EarnedBadge {
  slug: string;
  earnedAt: string;
}

export interface Certificate {
  slug: string;
  certNumber: string;
  issuedAt: string;
}

interface GamificationState {
  totalXP: number;
  earnedBadges: EarnedBadge[];
  certificates: Certificate[];
}

const STORAGE_KEY = 'catalisa_training_gamification';

function loadLocal(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { totalXP: 0, earnedBadges: [], certificates: [] };
  } catch {
    return { totalXP: 0, earnedBadges: [], certificates: [] };
  }
}

function saveLocal(state: GamificationState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useTrainingGamification() {
  const [state, setState] = useState<GamificationState>(loadLocal);

  // Sync from Supabase on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [badgesRes, xpRes, certsRes] = await Promise.all([
          supabase.from('training_badges').select('badge_slug, earned_at').eq('user_id', user.id),
          supabase.from('training_xp').select('xp_amount').eq('user_id', user.id),
          supabase.from('training_certificates').select('certificate_slug, certificate_number, issued_at').eq('user_id', user.id),
        ]);

        const earnedBadges = (badgesRes.data || []).map(b => ({ slug: b.badge_slug, earnedAt: b.earned_at }));
        const totalXP = (xpRes.data || []).reduce((sum, r) => sum + r.xp_amount, 0);
        const certificates = (certsRes.data || []).map(c => ({
          slug: c.certificate_slug,
          certNumber: c.certificate_number,
          issuedAt: c.issued_at,
        }));

        const newState = { totalXP, earnedBadges, certificates };
        setState(newState);
        saveLocal(newState);
      } catch {
        // offline-safe
      }
    })();
  }, []);

  useEffect(() => {
    saveLocal(state);
  }, [state]);

  const addXP = useCallback(async (amount: number, sourceType: string, sourceId: string) => {
    setState(prev => {
      const next = { ...prev, totalXP: prev.totalXP + amount };
      saveLocal(next);
      return next;
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('training_xp').insert({
          user_id: user.id,
          xp_amount: amount,
          source_type: sourceType,
          source_id: sourceId,
        });
      }
    } catch { /* offline-safe */ }
  }, []);

  const awardBadge = useCallback(async (badgeSlug: string) => {
    if (state.earnedBadges.some(b => b.slug === badgeSlug)) return null;

    const now = new Date().toISOString();
    setState(prev => ({
      ...prev,
      earnedBadges: [...prev.earnedBadges, { slug: badgeSlug, earnedAt: now }],
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('training_badges').upsert({
          user_id: user.id,
          badge_slug: badgeSlug,
          earned_at: now,
        }, { onConflict: 'user_id,badge_slug' });
      }
    } catch { /* offline-safe */ }

    return badges.find(b => b.slug === badgeSlug) || null;
  }, [state.earnedBadges]);

  const generateCertificate = useCallback(async (certSlug: string): Promise<{ certNumber: string } | null> => {
    const existing = state.certificates.find(c => c.slug === certSlug);
    if (existing) return { certNumber: existing.certNumber };

    const certNumber = `CAT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const now = new Date().toISOString();

    setState(prev => ({
      ...prev,
      certificates: [...prev.certificates, { slug: certSlug, certNumber, issuedAt: now }],
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('training_certificates').insert({
          user_id: user.id,
          certificate_slug: certSlug,
          certificate_number: certNumber,
          issued_at: now,
        });
      }
    } catch { /* offline-safe */ }

    return { certNumber };
  }, [state.certificates]);

  const hasBadge = useCallback((slug: string) => {
    return state.earnedBadges.some(b => b.slug === slug);
  }, [state.earnedBadges]);

  const availableBadges: BadgeDefinition[] = badges.filter(
    b => !state.earnedBadges.some(eb => eb.slug === b.slug),
  );

  return {
    totalXP: state.totalXP,
    badges: state.earnedBadges,
    availableBadges,
    certificates: state.certificates,
    allBadges: badges,
    addXP,
    awardBadge,
    hasBadge,
    generateCertificate,
  };
}
