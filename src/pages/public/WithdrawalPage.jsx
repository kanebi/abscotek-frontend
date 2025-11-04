import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { DollarSign, Wallet, Clock, CheckCircle } from 'lucide-react';
import useStore from '../../store/useStore';

function WithdrawalPage() {
  const { currentUser } = useStore();
  const [availableBalance, setAvailableBalance] = useState(currentUser?.platformBalance || 0);

  useEffect(() => {
    if (currentUser?.platformBalance !== undefined) {
      setAvailableBalance(currentUser.platformBalance);
    }
  }, [currentUser?.platformBalance]);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([
    {
      id: 'WD001',
      amount: 150.00,
      method: 'Bank Transfer',
      status: 'completed',
      date: '2024-01-15',
      fee: 5.00
    },
    {
      id: 'WD002',
      amount: 75.50,
      method: 'USDT Wallet',
      status: 'pending',
      date: '2024-01-20',
      fee: 2.00
    }
  ]);

  const withdrawalMethods = [
    { id: 'bank', name: 'Bank Transfer', fee: 5.00, minAmount: 50 },
    { id: 'usdt', name: 'USDT Wallet', fee: 2.00, minAmount: 20 },
    { id: 'paypal', name: 'PayPal', fee: 3.50, minAmount: 25 },
    { id: 'crypto', name: 'Crypto Wallet', fee: 1.50, minAmount: 10 }
  ];

  const selectedMethod = withdrawalMethods.find(m => m.id === withdrawalMethod);
  const finalAmount = withdrawalAmount ? parseFloat(withdrawalAmount) - (selectedMethod?.fee || 0) : 0;

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    
    if (!withdrawalAmount || !withdrawalMethod) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount < (selectedMethod?.minAmount || 0)) {
      alert(`Minimum withdrawal amount is $${selectedMethod?.minAmount}`);
      return;
    }

    if (amount > availableBalance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      // Check if user has sufficient balance
      if (amount > availableBalance) {
        alert('Insufficient balance for withdrawal.');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update balance and add to history
      const newWithdrawal = {
        id: `WD${Date.now()}`,
        amount: amount,
        method: withdrawalMethod === 'bank' ? 'Bank Transfer' :
                withdrawalMethod === 'usdt' ? 'USDT Wallet' :
                withdrawalMethod === 'paypal' ? 'PayPal' :
                withdrawalMethod === 'crypto' ? 'Crypto Wallet' : 'Unknown',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        fee: selectedMethod?.fee || 0
      };

      setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
      setAvailableBalance(prev => prev - amount);
      setWithdrawalAmount('');
      setWithdrawalMethod('');

      alert('Withdrawal request submitted successfully!');
    } catch (error) {
      alert('Failed to process withdrawal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-successs-400 bg-successs-100/10';
      case 'pending':
        return 'text-warningw-400 bg-warningw-100/10';
      case 'failed':
        return 'text-dangerd-400 bg-dangerd-100/10';
      default:
        return 'text-neutralneutral-400 bg-neutralneutral-100/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading-header-2-header-2-bold text-white mb-4">
              Withdraw Earnings
            </h1>
            <p className="text-neutralneutral-400">
              Withdraw your referral earnings and commissions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Withdrawal Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Card */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primaryp-100/10 rounded-full flex items-center justify-center">
                    <Wallet size={24} className="text-primaryp-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                      Available Balance
                    </h2>
                    <p className="text-2xl font-heading-header-2-header-2-bold text-primaryp-400">
                      <AmountCurrency amount={availableBalance} fromCurrency="USDT" />
                    </p>
                  </div>
                </div>
              </Card>

              {/* Withdrawal Form */}
              <Card className="p-6">
                <h3 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
                  New Withdrawal
                </h3>
                
                <form onSubmit={handleWithdrawal} className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-2">
                      Withdrawal Amount (USDT)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max={availableBalance}
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                      required
                    />
                    {selectedMethod && withdrawalAmount && (
                      <p className="text-neutralneutral-400 text-xs mt-1">
                        Min: ${selectedMethod.minAmount} | Fee: ${selectedMethod.fee} | 
                        You'll receive: <span className="text-primaryp-400">${finalAmount.toFixed(2)}</span>
                      </p>
                    )}
                  </div>

                  {/* Withdrawal Method */}
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-2">
                      Withdrawal Method
                    </label>
                    <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select withdrawal method" />
                      </SelectTrigger>
                      <SelectContent>
                        {withdrawalMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{method.name}</span>
                              <span className="text-xs text-neutralneutral-400 ml-4">
                                Fee: ${method.fee} | Min: ${method.minAmount}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading || !withdrawalAmount || !withdrawalMethod || availableBalance <= 0}
                    className="w-full bg-primaryp-500 hover:bg-primaryp-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {availableBalance <= 0 ? 'Insufficient Balance' : loading ? 'Processing...' : 'Submit Withdrawal Request'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Withdrawal History */}
            <div>
              <Card className="p-6">
                <h3 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
                  Withdrawal History
                </h3>
                
                <div className="space-y-4">
                  {withdrawalHistory.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-4 bg-neutralneutral-800 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-body-base-base-semibold">
                            <AmountCurrency amount={withdrawal.amount} fromCurrency="USDT" />
                          </p>
                          <p className="text-neutralneutral-400 text-xs">{withdrawal.method}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                          {withdrawal.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-neutralneutral-400">
                        <span>{withdrawal.id}</span>
                        <span>{new Date(withdrawal.date).toLocaleDateString()}</span>
                      </div>
                      
                      {withdrawal.fee > 0 && (
                        <p className="text-xs text-neutralneutral-500 mt-1">
                          Fee: ${withdrawal.fee.toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {withdrawalHistory.length === 0 && (
                    <div className="text-center py-8">
                      <DollarSign size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                      <p className="text-neutralneutral-400">No withdrawals yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default WithdrawalPage; 