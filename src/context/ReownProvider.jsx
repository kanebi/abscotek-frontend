import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { config, networks, projectId, wagmiAdapter } from '@/config/reown'
import { mainnet } from '@reown/appkit/networks'

const queryClient = new QueryClient()

const metadata = {
  name: 'Abscotek',
  description: 'Abscotek - Tech Products & Electronics',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://abscotek.io',
  icons: ['https://abscotek.io/favicon.ico'],
}

export default function ReownProvider({ children }) {
  useEffect(() => {
    // Initialize AppKit inside the component
    if (!projectId) {
      console.error("AppKit Initialization Error: Project ID is missing.")
    } else {
      createAppKit({
        adapters: [wagmiAdapter],
        projectId: projectId,
        networks: networks,
        defaultNetwork: mainnet,
        metadata,
        features: { analytics: true },
      })
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
} 