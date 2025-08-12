import { useEffect, useRef } from 'react';

export const useReownConnect = () => {
  const buttonRef = useRef(null);

  const openWalletModal = () => {
    // Try multiple approaches to trigger the modal
    
    // Approach 1: Try to find and click an existing appkit-button
    let appkitButton = document.querySelector('appkit-button');
    
    if (appkitButton) {
      appkitButton.click();
      return;
    }
    
    // Approach 2: Create a temporary button and trigger it
    const tempButton = document.createElement('appkit-button');
    tempButton.style.cssText = 'display: none; position: absolute; left: -9999px;';
    document.body.appendChild(tempButton);
    
    // Wait a bit for the button to be ready, then click
    setTimeout(() => {
      tempButton.click();
      
      // Clean up after a delay
      setTimeout(() => {
        if (document.body.contains(tempButton)) {
          document.body.removeChild(tempButton);
        }
      }, 2000);
    }, 100);
    
    // Approach 3: Try to dispatch a custom event
    const event = new CustomEvent('appkit-open-modal', { bubbles: true });
    document.dispatchEvent(event);
  };

  return {
    openWalletModal,
    buttonRef,
    isConnecting: false
  };
}; 