// Utility function for conditional classNames (shadcn/ui default)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
