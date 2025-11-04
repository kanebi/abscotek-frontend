import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props} />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props} />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

export default function AvatarBlock({ user }) {
  return (
    <div className="flex justify-start items-center gap-2">
      <div className="w-8 inline-flex flex-col justify-center items-center">
        <div className="justify-start text-white text-sm font-semibold font-['Mona_Sans'] leading-tight">USDT</div>
        <div className="self-stretch text-center justify-start text-zinc-400 text-sm font-medium font-['Mona_Sans'] leading-tight">
          {user?.platformBalance ?? 0}
        </div>
      </div>
      <div className="w-10 h-10 md:w-11 md:h-11 relative bg-gray-600 rounded-xl overflow-hidden">
        <div className="w-12 h-12 left-[-2px] top-0 absolute">
          <img className="w-10 h-10 md:w-11 md:h-11 left-0 top-0 absolute " src={user?.avatar || '/images/avatar.png'} alt="avatar" />
        </div>
      </div>
    </div>
  );
}
