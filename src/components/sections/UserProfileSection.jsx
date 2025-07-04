import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import emptyState from "../../assets/images/empty-state.svg";
import { AppRoutes } from "@/config/routes";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";

export default function UserProfileSection() {
  const navigate = useNavigate();
  const [orderCategory, setOrderCategory] = useState("all");

  // Order category options
  const categories = [
    { id: "all", label: "All Order", checked: true },
    { id: "to-be-received", label: "To Be Received", checked: false },
    { id: "completed", label: "Completed", checked: false },
    { id: "cancelled", label: "Cancelled", checked: false },
  ];

  return (
    <div className="flex flex-col w-full items-start gap-6 md:gap-10">
      <Tabs defaultValue="my-order" className="w-full">
        <TabsList className="inline-flex items-center gap-4 md:gap-7 relative w-full h-auto p-0 bg-transparent">
          <TabsTrigger
            value="my-order"
            style={{backgroundColor: 'transparent'}}
            className="bg-transparent z-10 rounded-none data-[state=active]:border-b-2 border-primaryp-300 inline-flex flex-col items-center gap-3 relative h-auto px-2 py-0 data-[state=active]:text-primaryp-200 data-[state=inactive]:text-neutralneutral-300 [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-sm md:text-base"
          >
            <div className="relative self-stretch mt-[-1.00px] text-center tracking-[0] leading-[18px] md:leading-[22.4px]">
              My Order
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="referral-bonus"
            style={{backgroundColor: 'transparent'}}
            className="bg-transparent z-10 rounded-none data-[state=active]:border-b-2 border-primaryp-300 inline-flex flex-col items-center gap-3 relative h-auto px-2 py-0 data-[state=active]:text-primaryp-200 data-[state=inactive]:text-neutralneutral-300 [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-sm md:text-base"
          >
            <div className="relative self-stretch mt-[-1.00px] text-center tracking-[0] leading-[18px] md:leading-[22.4px]">
              Referral Bonus
            </div>
          </TabsTrigger>
        </TabsList>
        <div className="relative">
        <Separator className="w-full absolute z-0 md:-top-[6.5px] -top-[5.5px]  h-[2px] bg-neutralneutral-500" />
        </div>
        
        <TabsContent value="my-order" className="mt-6 md:mt-10 w-full">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-[62px] relative self-stretch w-full">
            {/* Desktop Sidebar - Hidden on Mobile */}
            <Card className="hidden md:flex flex-col w-[255px] items-start gap-2.5 p-6 relative bg-defaulttop-background rounded-2xl overflow-hidden border-none">
              <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
                <div className="flex items-center justify-between relative self-stretch w-full">
                  <h2 className="relative w-fit font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-white text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-6-header-6-semibold-font-style)]">
                    Category
                  </h2>
                </div>

                <RadioGroup
                  defaultValue="all"
                  className="inline-flex flex-col items-start gap-6"
                >
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="inline-flex items-center gap-3 relative"
                    >
                      <div>
                        <RadioGroupItem
                          value={category.id}
                          id={category.id}
                          className={`border-[1.5px] relative fill-slate-50 w-5 h-5 data-[state=checked]:border-primaryp-300 border-neutral-200 data-[state=checked]:before:content-[''] data-[state=checked]:before:absolute data-[state=checked]:before:top-[3px] data-[state=checked]:before:left-[3px] data-[state=checked]:before:w-3 data-[state=checked]:before:h-3 data-[state=checked]:before:bg-primaryp-300 data-[state=checked]:before:rounded-[1000px] `}
                        >
                        </RadioGroupItem>
                      </div>

                      <label
                        htmlFor={category.id}
                        className="relative w-fit mt-[-1.00px] font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </Card>

            {/* Mobile Category Select - Hidden on Desktop */}
            <div className="md:hidden flex items-center gap-3 mb-4">
              <span className="text-sm font-body-large-large-medium text-white">Category</span>
              <Select defaultValue="all" onValueChange={setOrderCategory}>
                <SelectTrigger className="inline-flex items-center justify-center gap-2.5 px-2.5 py-2 h-9 w-[110px] rounded-lg border border-solid border-neutralneutral-300 bg-transparent text-sm">
                  <SelectValue placeholder="All Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Order</SelectItem>
                  <SelectItem value="to-be-received">To Be Received</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 md:gap-12 relative flex-1 grow">
              <div className="flex flex-col w-full max-w-[583px] items-center gap-4 md:gap-6 relative">
                <div className="relative w-[111px] md:w-[163px] h-[100px] md:h-[146.21px]">
                  <div className="relative w-[111px] md:w-[163px] h-[100px] md:h-[146px]">
                    {/* Empty state illustration */}
                    <img src={emptyState} alt="Empty State" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 md:gap-6 relative self-stretch w-full">
                  <div className="flex flex-col items-center gap-2 relative self-stretch w-full">
                    <h3 className="relative self-stretch mt-[-1.00px] font-heading-header-2-header-2-semibold font-[number:var(--heading-header-2-header-2-semibold-font-weight)] text-defaultwhite text-lg md:text-[length:var(--heading-header-2-header-2-semibold-font-size)] text-center tracking-[var(--heading-header-2-header-2-semibold-letter-spacing)] leading-[24px] md:leading-[var(--heading-header-2-header-2-semibold-line-height)] [font-style:var(--heading-header-2-header-2-semibold-font-style)]">
                      You have no order.
                    </h3>
                    <p className="relative self-stretch font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-defaultwhite text-sm md:text-[length:var(--body-base-base-regular-font-size)] text-center tracking-[var(--body-base-base-regular-letter-spacing)] leading-[18px] md:leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)]">
                      After buying, your order will be displayed in this
                      section.
                    </p>
                  </div>

                  <Button onClick={()=>navigate(AppRoutes.productList.path)} className="w-[181.5px] h-12 justify-center gap-2.5 px-7 py-[13px] bg-primaryp-300 rounded-xl text-white font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] [font-style:var(--body-base-base-medium-font-style)]">
                    Start Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="referral-bonus" className="mt-6 md:mt-10">
          {/* Referral Bonus content would go here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
