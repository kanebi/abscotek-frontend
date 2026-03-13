import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import giveawayService from '@/services/giveawayService';
import { resolveOrderImageUrl } from '@/utils/orderProduct';

function getCountdown(targetDate, now) {
  if (!targetDate) return null;
  const t = new Date(targetDate).getTime();
  const n = now.getTime();
  const diff = Math.max(0, t - n);
  if (diff === 0) return { label: 'Ended', days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds, label: null };
}

function GiveawayCountdownBadge({ item }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const claimType = item?.claimType || 'immediate';
  const hasWindow = claimType === 'time_window' && item?.claimWindowStart && item?.claimWindowEnd;
  if (!hasWindow) return null;

  const now = new Date();
  const start = new Date(item.claimWindowStart);
  const end = new Date(item.claimWindowEnd);

  let target = null;
  let label = '';
  if (now < start) {
    target = start;
    label = 'Opens';
  } else if (now <= end) {
    target = end;
    label = 'Closes';
  } else {
    return (
      <div className="absolute top-2 right-2 rounded-lg bg-neutral-800/95 backdrop-blur px-2 py-1.5 text-xs font-medium text-neutral-400 border border-neutral-600">
        Ended
      </div>
    );
  }

  const cd = getCountdown(target, now);
  if (cd.label === 'Ended') {
    return (
      <div className="absolute top-2 right-2 rounded-lg bg-neutral-800/95 backdrop-blur px-2 py-1.5 text-xs font-medium text-neutral-400 border border-neutral-600">
        Ended
      </div>
    );
  }
  const parts = [];
  if (cd.days > 0) parts.push(`${cd.days}d`);
  parts.push(`${String(cd.hours).padStart(2, '0')}:${String(cd.minutes).padStart(2, '0')}:${String(cd.seconds).padStart(2, '0')}`);
  return (
    <div className="absolute top-2 right-2 rounded-lg bg-neutral-900/95 backdrop-blur px-2 py-1.5 text-xs font-mono font-semibold text-white border border-pink-500/50 shadow-lg flex flex-col items-end">
      <span className="text-[10px] uppercase tracking-wider text-pink-300">{label}</span>
      <span className="tabular-nums">{parts.join(' ')}</span>
    </div>
  );
}

export default function GiveawayPage() {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    giveawayService
      .getGiveaways()
      .then((data) => {
        if (!cancelled) setGiveaways(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.errors?.[0]?.msg || 'Failed to load giveaways');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <Layout>
      <SEO
        title="Giveaways - Abscotek"
        description="Claim free giveaway items."
        path="/giveaway"
      />
      <div className="min-h-screen bg-neutral-900 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <style>{`
            @keyframes giveaway-water-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .giveaway-water-text {
              background-image: linear-gradient(
                90deg,
                #a855f7,
                #ec4899,
                #f97316,
                #a855f7
              );
              background-size: 200% 200%;
              animation: giveaway-water-gradient 6s ease-in-out infinite;
            }
            @keyframes giveaway-cta-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .giveaway-claim-cta {
              background-image: linear-gradient(
                120deg,
                #a855f7,
                #ec4899,
                #f97316,
                #22c55e
              );
              background-size: 220% 220%;
              animation: giveaway-cta-gradient 3s ease-in-out infinite;
              box-shadow: 0 0 18px rgba(236, 72, 153, 0.5);
            }
          `}</style>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text giveaway-water-text">
              Giveaways
            </h1>
            <p className="text-neutral-400 text-sm mt-4">Claim items you’re eligible for.</p>
          </div>

          {loading && (
            <p className="text-neutral-400">Loading giveaways...</p>
          )}
          {error && (
            <p className="text-red-400">{error}</p>
          )}
          {!loading && !error && giveaways.length === 0 && (
            <p className="text-neutral-400">No active giveaways right now. Check back later.</p>
          )}

          <div className="space-y-12">
            {giveaways.map((g) => (
              <section
                key={g._id}
                className="relative overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 shadow-[0_0_30px_rgba(236,72,153,0.15)]"
              >
                <div className="absolute inset-0 pointer-events-none opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-shimmer" />
                </div>
                <style>{`
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                  .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
                `}</style>
                <h2 className="relative text-xl md:text-2xl font-semibold text-white mb-6 pb-3 border-b border-neutral-600">
                  {g.name}
                </h2>
                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(g.items || []).map((it) => {
                    const product = it.product;
                    if (!product) return null;
                    const imgUrl = resolveOrderImageUrl(product.images?.[0] || '/images/desktop-1.png');
                    const isClaimed = it.claimed;
                    if (isClaimed) {
                      return (
                        <div
                          key={it._id}
                          className="group block rounded-xl border border-neutral-700 bg-neutral-800/60 p-4 opacity-70 cursor-not-allowed"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-700 mb-3">
                            <img
                              src={imgUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            <GiveawayCountdownBadge item={it} />
                          </div>
                          <h3 className="text-white font-medium truncate">{product.name}</h3>
                          <p className="mt-2 text-xs font-medium text-emerald-300">
                            Already claimed
                          </p>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={it._id}
                        to={`/claim/${g._id}/${product._id}`}
                        className="group block rounded-xl border border-neutral-600 bg-neutral-800/80 p-4 hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-700 mb-3">
                          <img
                            src={imgUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <GiveawayCountdownBadge item={it} />
                        </div>
                        <h3 className="text-white font-medium truncate">{product.name}</h3>
                        <p className="mt-2 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white giveaway-claim-cta">
                            Claim
                          </span>
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
