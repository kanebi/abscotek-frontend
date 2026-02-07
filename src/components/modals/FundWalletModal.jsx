import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import AmountCurrency from '../ui/AmountCurrency';
import { Copy } from 'lucide-react'; // Import Copy icon
import useStore from '../../store/useStore'; // Import useStore
import { useAccount } from 'wagmi';

function FundWalletModal({ isOpen, onClose, cartTotal, usdcBalance, cartCurrency, userCurrency, walletAddress }) {
  const [copyStatus, setCopyStatus] = useState(''); // State for copy confirmation
  const { setConnectWalletModalOpen } = useStore(); // Get action to open connect wallet modal
  const { isConnected } = useAccount();

  const handleFundWallet = () => {
    // In a real application, this would navigate to a funding page or initiate a crypto transaction
    console.log('Initiating fund wallet process...');
    alert('Please fund your wallet. (This is a placeholder action)');
    onClose();
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
        setCopyStatus('Failed to copy');
        setTimeout(() => setCopyStatus(''), 2000);
      }
    }
  };

  const handleConnectWalletClick = () => {
    setConnectWalletModalOpen(true);
    onClose(); // Close the fund wallet modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-neutralneutral-900 text-white border-neutralneutral-700">
        <DialogHeader>
          <DialogTitle className="text-white">Insufficient Funds</DialogTitle>
          <DialogDescription className="text-neutralneutral-400">
            Your wallet balance is not enough to cover the cart total.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-neutralneutral-300">Cart Total:</span>
            <AmountCurrency amount={cartTotal} fromCurrency="USD" className="text-white font-semibold" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutralneutral-300">Your {userCurrency} Balance:</span>
            <AmountCurrency amount={usdcBalance} fromCurrency="USDC" className="text-white font-semibold" />
          </div>
          {isConnected && walletAddress ? (
            <div className="flex justify-between items-center mt-2">
              <span className="text-neutralneutral-300">Your Wallet Address:</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-mono truncate max-w-[150px]">{walletAddress}</span>
                <button onClick={handleCopyAddress} className="text-neutralneutral-400 hover:text-white focus:outline-none">
                  <Copy size={16} />
                </button>
                {copyStatus && <span className="text-xs text-green-500">{copyStatus}</span>}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center text-neutralneutral-400 mt-4">
                Connect your Web3 wallet to see your address and fund it.
              </div>
              <Button onClick={handleConnectWalletClick} className="w-full bg-primaryp-300 hover:bg-primaryp-400 text-white py-3 rounded-xl font-medium mt-4">
                Login/Signup
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="bg-neutralneutral-700 text-white hover:bg-neutralneutral-600 border-neutralneutral-600">
            Cancel
          </Button>
          <Button onClick={handleFundWallet} className="bg-red-500 hover:bg-red-600 text-white">
            Fund Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FundWalletModal;