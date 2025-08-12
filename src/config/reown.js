import { createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

export const projectId = import.meta.env.VITE_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not defined. Please set it in .env')
}

export const networks = [mainnet, arbitrum]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: localStorage }),
  ssr: false,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig 