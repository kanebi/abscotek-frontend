import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import emptyState from "../../assets/images/empty-state.svg";
import { AppRoutes } from "@/config/routes";
import { useLocation, useNavigate } from "react-router-dom";
import OrderCard from "../widgets/OrderCard";
import { OrderDetailsSection } from "./OrderDetail";
import ReferralSection from "./ReferralSection";
import { ACTIVE_PAGINATION_ITEM_STYLE, PAGINATION_ITEM_STYLE, SELECT_CONTENT_STYLE } from "@/components/constants";


export default function UserProfileSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderCategory, setOrderCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const totalPages = 3;

  // Mock order data
  const mockOrders = [
    {
      id: 1,
      date: "2024-07-25 15:19:28",
      number: "O-NG240725234276",
      status: "Transaction Complete",
      product: {
        name: "New Apple iPhone 16 Plus ESIM 128GB",
        color: "Blue",
        image: "/images/desktop-1.png",
        price: "450.36 USDT",
        quantity: 1,
      },
      total: "450.36 USDT",
      pricing: {
        subtotal: "450.36 USDT",
        delivery: "0 USDT",
        total: "450.36 USDT",
      },
      shipping: {
        name: "Salisu Oluwaseun",
        email: "oluwaseunsalisu1@gmail.com",
        phone: "+2348135384788",
        address: "54, Sholanke Street, Bajulaiye, Shomolu, Lagos",
      },
      delivery: {
        method: "Lagos",
        timeframe: "1 - 2 days",
      },
    },
    {
      id: 2,
      date: "2024-07-24 12:30:15",
      number: "O-NG240724123456",
      status: "Waiting for Delivery",
      product: {
        name: "Samsung Galaxy S24 Ultra 256GB",
        color: "Titanium Gray",
        image: "/images/desktop-2.jpg",
        price: "380.50 USDT",
        quantity: 2,
      },
      total: "761.00 USDT",
      pricing: {
        subtotal: "761.00 USDT",
        delivery: "0 USDT",
        total: "761.00 USDT",
      },
      shipping: {
        name: "John Doe",
        email: "john.doe@gmail.com",
        phone: "+2348123456789",
        address: "123 Main Street, Victoria Island, Lagos",
      },
      delivery: {
        method: "Lagos",
        timeframe: "1 - 2 days",
      },
    },
    {
      id: 3,
      date: "2024-07-23 09:45:32",
      number: "O-NG240723098765",
      status: "Out for delivery",
      product: {
        name: "MacBook Pro 14-inch M3 512GB",
        color: "Space Gray",
        image: "/images/mobile-1.png",
        price: "1250.75 USDT",
        quantity: 1,
      },
      total: "1250.75 USDT",
      pricing: {
        subtotal: "1250.75 USDT",
        delivery: "0 USDT",
        total: "1250.75 USDT",
      },
      shipping: {
        name: "Jane Smith",
        email: "jane.smith@gmail.com",
        phone: "+2348098765432",
        address: "456 Oak Avenue, Ikeja, Lagos",
      },
      delivery: {
        method: "Lagos",
        timeframe: "1 - 2 days",
      },
    },
  ];

  // For demo purposes, set hasOrders to true to show order list
  const hasOrders = mockOrders.length > 0;

  // Order category options
  const categories = [
    { id: "all", label: "All Order", checked: true },
    { id: "to-be-received", label: "To Be Received", checked: false },
    { id: "completed", label: "Completed", checked: false },
    { id: "cancelled", label: "Cancelled", checked: false },
  ];

  // Handle order selection from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('orderId');
    if (orderId) {
      setSelectedOrderId(parseInt(orderId));
    }
  }, [location.search]);

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(orderId);
    navigate(`${AppRoutes.userProfile.path}?orderId=${orderId}`);
  };

  // Handle back to order list
  const handleBackToOrderList = () => {
    setSelectedOrderId(null);
    navigate(AppRoutes.userProfile.path);
  };

  // Get selected order data
  const selectedOrder = selectedOrderId ? mockOrders.find(order => order.id === selectedOrderId) : null;

  // Order progress steps
  const getProgressSteps = (status) => {
    const steps = [
      { id: 1, name: "Submit Order", completed: true },
      { id: 2, name: "Waiting for Delivery", completed: status !== "Submit Order" },
      { id: 3, name: "Out for delivery", completed: status === "Out for delivery" || status === "Transaction Complete" },
      { id: 4, name: "Transaction Complete", completed: status === "Transaction Complete" },
    ];
    return steps;
  };

  const OrderListWithPagination = () => (
    <div className="flex flex-col items-center justify-center gap-6 md:gap-12 relative w-full">
      <div className="flex flex-col w-full max-w-[1021px] items-start gap-4 md:gap-6 relative">
        {mockOrders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onViewOrder={() => handleOrderSelect(order.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
        <PaginationPrevious
          label={'  '}
          className="relative bg-[url('/images/mdi_arrow-backward.svg')] bg-no-repeat bg-center w-6 h-6 hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          {' '}
        </PaginationPrevious>

        <PaginationContent className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          {[...Array(totalPages)].map((item, index) => (
            <PaginationItem style={index===currentPage?ACTIVE_PAGINATION_ITEM_STYLE:PAGINATION_ITEM_STYLE} className="rounded-full"
              key={index}
            >
              <PaginationLink 
                className="relative hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>

        <PaginationNext
          className="relative bg-[url('/images/mdi_arrow-forward.svg')] bg-no-repeat bg-center w-6 h-6 hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
          aria-label="Go to next page"
          label={'  '}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
        </PaginationNext>
      </Pagination>
    </div>
  );

  const EmptyOrderState = () => (
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
  );

  return (
    <div className="flex flex-col w-full items-start gap-6 md:gap-10 mb-10">
      <Tabs defaultValue="my-order" className="w-full relative mt-8 md:mt-0 ">
        <div className="md:flex absolute md:relative md:left-0 md:top-0 -top-[34px]">
        <TabsList className="inline-flex gap-4   md:gap-7 relative w-full h-auto p-0 bg-transparent items-center justify-center">
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
        </div>
        <div className="relative">
          <Separator className="w-full absolute z-0 md:-top-[6.5px] -top-[5.5px] h-[2px] bg-neutralneutral-500" />
        </div>
        
        <TabsContent value="my-order" className="mt-6 md:mt-10 w-full">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-[62px] relative self-stretch w-full">
            {/* Desktop Sidebar - Always visible on desktop */}
            <Card className="hidden md:flex flex-col w-[255px] min-w-[255px] items-start gap-2.5 p-6 relative bg-defaulttop-background rounded-2xl overflow-hidden border-none flex-shrink-0">
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

            {/* Mobile Category Select - Hidden on Desktop and when viewing order details */}
            {!selectedOrder && (
              <div className="md:hidden flex items-center gap-3 mb-4 float-right justify-end">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-body-large-large-medium text-white">Category</span>
                  <Select defaultValue="all" onValueChange={setOrderCategory}>
                    <SelectTrigger className="inline-flex items-center justify-center gap-2.5 px-2.5 py-2 h-9 w-[110px] rounded-lg border border-solid border-neutralneutral-300 bg-transparent text-sm text-white">
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
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Conditional Content: Show Order Details, Order List, or Empty State */}
              {selectedOrder ? (
                <OrderDetailsSection order={selectedOrder} onBackToList={handleBackToOrderList} />
              ) : hasOrders ? (
                <OrderListWithPagination />
              ) : (
                <EmptyOrderState />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="referral-bonus" className="mt-6 md:mt-10">
          <ReferralSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
