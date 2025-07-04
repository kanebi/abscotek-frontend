import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

const MultiThumbSlider = React.forwardRef(
  (
    {
      className,
      defaultValue = [0, 100],
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      ...props
    },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-primaryp-300"
      >
        <SliderPrimitive.Range className="absolute h-full " />
      </SliderPrimitive.Track>
      {[0, 1].map((i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-6 w-6  rounded-full border-4 border-white bg-primaryp-300 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryp-300 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
)
MultiThumbSlider.displayName = "MultiThumbSlider"

export { Slider, MultiThumbSlider }

