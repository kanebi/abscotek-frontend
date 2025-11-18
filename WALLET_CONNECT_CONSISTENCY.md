# WalletConnectButton Consistency

## Overview
All instances of `WalletConnectButton` throughout the application now use the same authentication action via the `onConnect` prop.

## Implementation

### WalletConnectButton Component
Located: `frontend/src/components/widgets/WalletConnectButton.jsx`

**Behavior:**
- If `onConnect` prop is provided → calls `onConnect()` (recommended)
- If no `onConnect` prop → falls back to Privy's `login()` directly
- Shows connected state when user is authenticated

### Usage Pattern

All instances now follow this pattern:
```jsx
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

const { authenticateAndLogin } = useWeb3Auth();

<WalletConnectButton onConnect={authenticateAndLogin} />
```

## Locations Using WalletConnectButton

### 1. Header Component
**File:** `frontend/src/layout/Header.jsx`
- Desktop header (line ~111)
- Mobile header (line ~157)
- **Action:** `authenticateAndLogin` from `useWeb3Auth`

### 2. Checkout Page
**File:** `frontend/src/pages/public/CheckoutPage.jsx`
- Login prompt (line ~684)
- USDT payment wallet connection (line ~720)
- **Action:** `authenticateAndLogin` from `useWeb3Auth`

### 3. Referral Modal
**File:** `frontend/src/components/ui/ReferModal.jsx`
- Unauthenticated state (line ~200)
- **Action:** `authenticateAndLogin` from `useWeb3Auth`

## Authentication Flow

When `authenticateAndLogin` is called:

1. **Privy Authentication**
   - User authenticates via Privy (wallet, email, or social)
   - Gets Privy access token

2. **Backend Authentication**
   - Sends Privy token to backend
   - Backend verifies with Privy
   - Creates/updates user in database
   - Returns JWT token

3. **State Management**
   - Stores JWT token in localStorage
   - Updates Zustand store with user data
   - Sets wallet address
   - Loads user cart and wishlist

4. **Cart Merging**
   - Merges guest cart with user cart (if applicable)

## Disconnect Flow

When user clicks disconnect (in UserPopover):

1. **Privy Logout**
   - Calls Privy's `logout()` function

2. **Clear Auth State**
   - Removes JWT token from localStorage
   - Clears user info from localStorage
   - Clears wallet address from localStorage
   - Resets Zustand store state

## Benefits of Consistency

✅ **Single Source of Truth:** All authentication flows through `useWeb3Auth`
✅ **Predictable Behavior:** Same auth flow everywhere in the app
✅ **Easy Maintenance:** Changes to auth logic only need to be made in one place
✅ **Better UX:** Consistent user experience across all entry points
✅ **Proper State Management:** All auth state properly synced between Privy, backend, and frontend store

## Testing Checklist

- [ ] Header login button works
- [ ] Checkout page login prompt works
- [ ] Checkout USDT wallet connection works
- [ ] Referral modal login works
- [ ] All buttons show connected state when authenticated
- [ ] Disconnect properly clears all auth state
- [ ] Cart merges correctly after login
- [ ] User data loads after authentication
