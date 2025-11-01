const tokens = {
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum Mainnet USDT
    abi: [
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  // Add other tokens here as needed, e.g., ETH, USDC, etc.
  // ETH (native currency) does not have a contract address or ABI for balance, 
  // its balance is fetched differently (e.g., wagmi's useBalance hook without contract address)
  // USDC: {
  //   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum Mainnet USDC
  //   abi: [
  //     // ... ABI for USDC (similar to USDT)
  //   ]
  // }
};

export default tokens;