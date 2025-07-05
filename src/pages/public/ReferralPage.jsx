import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { Share, Copy, Users, DollarSign, Gift, CheckCircle } from 'lucide-react';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';

function ReferralPage() {
  const [referralCode, setReferralCode] = useState('USER123456');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 12,
    totalEarnings: 156.80,
    pendingEarnings: 45.20,
    availableBalance: 111.60
  });
  const [copied, setCopied] = useState(false);

  const referralLink = `https://abscotek.com/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Abscotek - Get Great Tech Deals!',
        text: 'Use my referral link to get special discounts on your first order!',
        url: referralLink,
      });
    }
  };

  // SEO configuration
  const seoData = getPageSEO('referral', { path: '/referral' });

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading-header-1-header-1-bold text-white mb-4">
              Referral Program
            </h1>
            <p className="text-xl text-neutralneutral-300 mb-8">
              Earn rewards by referring friends to Abscotek
            </p>
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <Gift size={32} className="text-primaryp-400 mx-auto mb-2" />
                <p className="text-white font-body-base-base-bold">You Get 10%</p>
                <p className="text-neutralneutral-400 text-sm">Of their first order</p>
              </div>
              <div>
                <Users size={32} className="text-secondarys-400 mx-auto mb-2" />
                <p className="text-white font-body-base-base-bold">They Get 5%</p>
                <p className="text-neutralneutral-400 text-sm">Discount on first order</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <Users size={32} className="text-primaryp-400 mx-auto mb-3" />
              <h3 className="text-2xl font-heading-header-3-header-3-bold text-white mb-1">
                {referralStats.totalReferrals}
              </h3>
              <p className="text-neutralneutral-400 text-sm">Total Referrals</p>
            </Card>
            
            <Card className="p-6 text-center">
              <DollarSign size={32} className="text-successs-400 mx-auto mb-3" />
              <h3 className="text-2xl font-heading-header-3-header-3-bold text-white mb-1">
                <AmountCurrency amount={referralStats.totalEarnings} fromCurrency="USDT" />
              </h3>
              <p className="text-neutralneutral-400 text-sm">Total Earnings</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-8 h-8 bg-warningw-100/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign size={20} className="text-warningw-400" />
              </div>
              <h3 className="text-2xl font-heading-header-3-header-3-bold text-white mb-1">
                <AmountCurrency amount={referralStats.pendingEarnings} fromCurrency="USDT" />
              </h3>
              <p className="text-neutralneutral-400 text-sm">Pending</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-8 h-8 bg-primaryp-100/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign size={20} className="text-primaryp-400" />
              </div>
              <h3 className="text-2xl font-heading-header-3-header-3-bold text-white mb-1">
                <AmountCurrency amount={referralStats.availableBalance} fromCurrency="USDT" />
              </h3>
              <p className="text-neutralneutral-400 text-sm">Available</p>
            </Card>
          </div>

          {/* Referral Link */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
              Your Referral Link
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-4 bg-neutralneutral-800 rounded-lg">
                <p className="text-neutralneutral-400 text-sm mb-1">Referral Code</p>
                <p className="text-white font-body-base-base-bold text-lg">{referralCode}</p>
              </div>
              
              <div className="flex-1 p-4 bg-neutralneutral-800 rounded-lg">
                <p className="text-neutralneutral-400 text-sm mb-1">Referral Link</p>
                <p className="text-white font-body-base-base-medium text-sm truncate">{referralLink}</p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button onClick={handleCopyLink} className="flex-1 bg-primaryp-500 hover:bg-primaryp-400">
                {copied ? <CheckCircle size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              <Button onClick={handleShare} variant="outline" className="flex-1 border-neutralneutral-600">
                <Share size={16} className="mr-2" />
                Share
              </Button>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primaryp-100/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share size={24} className="text-primaryp-400" />
                </div>
                <h3 className="text-white font-body-large-large-bold mb-2">1. Share Your Link</h3>
                <p className="text-neutralneutral-400 text-sm">
                  Share your unique referral link with friends via social media, email, or messaging apps.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondarys-100/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-secondarys-400" />
                </div>
                <h3 className="text-white font-body-large-large-bold mb-2">2. Friend Signs Up</h3>
                <p className="text-neutralneutral-400 text-sm">
                  Your friend creates an account using your referral link and gets a 5% discount.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-successs-100/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={24} className="text-successs-400" />
                </div>
                <h3 className="text-white font-body-large-large-bold mb-2">3. You Earn</h3>
                <p className="text-neutralneutral-400 text-sm">
                  When they make their first purchase, you earn 10% of their order value as referral bonus.
                </p>
              </div>
            </div>
          </Card>

          {/* Terms & Conditions */}
          <Card className="p-6">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-4">
              Terms & Conditions
            </h2>
            
            <div className="space-y-3 text-neutralneutral-300 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-successs-400 mt-0.5 flex-shrink-0" />
                <p>Referral bonus is paid after the referred user's first successful order.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-successs-400 mt-0.5 flex-shrink-0" />
                <p>Minimum withdrawal amount is $50 USDT.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-successs-400 mt-0.5 flex-shrink-0" />
                <p>Referral earnings are processed within 7 business days.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-successs-400 mt-0.5 flex-shrink-0" />
                <p>Self-referrals and fraudulent activities are strictly prohibited.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-successs-400 mt-0.5 flex-shrink-0" />
                <p>Abscotek reserves the right to modify the referral program terms at any time.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default ReferralPage; 