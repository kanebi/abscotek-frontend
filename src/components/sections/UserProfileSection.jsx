import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/Breadcrumb";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import emptyState from "../../assets/images/empty-state.svg";
import { AppRoutes } from "@/config/routes";
import { useLocation, useNavigate } from "react-router-dom";
import OrderCard from "../widgets/OrderCard";
import { OrderDetailsSection } from "./OrderDetail";
import ReferralSection from "./ReferralSection";
import { ACTIVE_PAGINATION_ITEM_STYLE, PAGINATION_ITEM_STYLE, SELECT_CONTENT_STYLE } from "@/components/constants";
import orderService from "@/services/orderService";

export default function UserProfileSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderCategory, setOrderCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationData, setPaginationData] = useState({});
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrdersPaginated(currentPage, ordersPerPage, orderCategory);
      setOrders(response.orders || []);
      setTotalPages(response.pagination?.totalPages || 0);
      setPaginationData(response.pagination || {});
    } catch (error) {
      console.error('Error fetching orders:', error);
      try {
        const data = await orderService.getOrders(orderCategory);
        setOrders(data);
        setTotalPages(Math.ceil(data.length / ordersPerPage));
        setPaginationData({});
      } catch (fallbackError) {
        console.error('Error in fallback order fetch:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, orderCategory]);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orderCategory]);

  // Orders are already filtered and paginated from backend
  const paginatedOrders = orders;

  // Transform backend order data to match UI format
  const transformedOrders = paginatedOrders.map(order => {
    const firstItem = order.items?.[0];
    if (!firstItem) return null;

    // Debug logging to see the actual data structure
    console.log('Order item data:', {
      orderId: order._id,
      productId: firstItem.product?._id,
      productName: firstItem.product?.name,
      productImage: firstItem.productImage, // Direct image field
      hasImages: !!firstItem.product?.images,
      imagesLength: firstItem.product?.images?.length || 0,
      hasVariants: !!firstItem.product?.variants,
      variantsLength: firstItem.product?.variants?.length || 0,
      hasFirstImage: !!firstItem.product?.firstImage,
      firstImage: firstItem.product?.firstImage
    });

    // Get the appropriate image - use direct productImage field first, then fallback to populated data
    let productImages = [];
    
    // First priority: Use direct productImage field from OrderItem
    if (firstItem.productImage) {
      productImages = [firstItem.productImage];
    }
    // Second priority: Check if we have variant data and product variants
    else if (firstItem.variant?.name && firstItem.product?.variants) {
      // Find the variant in the product and get its images
      const variant = firstItem.product.variants.find(v => v.name === firstItem.variant.name);
      if (variant?.images?.length > 0) {
        productImages = variant.images;
      }
    }
    // Third priority: Fallback to product images if no variant images
    else if (firstItem.product?.images?.length > 0) {
      productImages = firstItem.product.images;
    }
    // Fourth priority: Check for firstImage virtual field
    else if (firstItem.product?.firstImage) {
      productImages = [firstItem.product.firstImage];
    }
    // Fifth priority: Check if product data is directly on the item (old schema)
    else if (firstItem.product && typeof firstItem.product === 'object' && firstItem.product.images) {
      productImages = firstItem.product.images;
    }
    // Check if there's a product field that's a string (unpopulated)
    else if (typeof firstItem.product === 'string') {
      console.warn('Product not populated for order item:', firstItem._id);
    }

    console.log('Final productImages:', productImages);

    // If still no images, use a placeholder or default
    if (productImages.length === 0) {
      productImages = ['/images/desktop-1.png']; // Default placeholder
    }

    return {
      id: order._id,
      date: new Date(order.orderDate || order.createdAt).toLocaleString(),
      number: order.orderNumber || order._id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentAddress: order.paymentAddress,
      currency: order.currency || firstItem.currency || 'USDC',
      product: {
        name: firstItem.product?.name || 'Product',
        variant: firstItem.variant?.name || (firstItem.variant?.attributes?.length > 0
          ? firstItem.variant.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')
          : null),
        specs: firstItem.specs || null,
        images: productImages, // Use images array instead of single image
        price: firstItem.unitPrice || firstItem.product?.price || 0,
        currency: firstItem.currency || firstItem.product?.currency || order.currency || 'USDC',
        quantity: firstItem.quantity || 1,
      },
      total: order.totalAmount || order.pricing?.total || ((order.pricing?.subtotal || order.subTotal || 0) + (order.pricing?.delivery || order.deliveryFee || 0)),
      pricing: {
        subtotal: order.pricing?.subtotal || order.subTotal || 0,
        delivery: order.pricing?.delivery || order.deliveryFee || 0,
        total: order.totalAmount || order.pricing?.total || ((order.pricing?.subtotal || order.subTotal || 0) + (order.pricing?.delivery || order.deliveryFee || 0)),
      },
      shipping: order.shipping || order.shippingAddress || {},
      delivery: order.delivery || order.deliveryMethod || {},
    };
  }).filter(Boolean); // Remove null entries


  // Use only real orders from backend
  const displayOrders = transformedOrders;
  const hasOrders = displayOrders.length > 0;

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
      // Keep as string to match order.id type
      setSelectedOrderId(orderId);
    } else {
      setSelectedOrderId(null);
    }
  }, [location.search]);

  // Handle order selection - use useCallback to prevent unnecessary re-renders
  const handleOrderSelect = useCallback((orderId) => {
    // Convert to string if needed to ensure consistent type
    const orderIdStr = String(orderId);
    setSelectedOrderId(orderIdStr);
    navigate(`${AppRoutes.userProfile.path}?orderId=${orderIdStr}`, { replace: true });
  }, [navigate]);

  // Handle back to order list
  const handleBackToOrderList = () => {
    setSelectedOrderId(null);
    navigate(AppRoutes.userProfile.path, { replace: true });
  };

  // Get selected order data - ensure type matching, use useMemo to prevent unnecessary recalculations
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId || !displayOrders.length) return null;
    return displayOrders.find(order => String(order.id) === String(selectedOrderId)) || null;
  }, [selectedOrderId, displayOrders]);

  // Order progress steps - now using backend stages data
  const getProgressSteps = (order) => {
    // Use stages from backend if available, otherwise fallback to old logic
    if (order && order.stages) {
      return order.stages;
    }

    // Fallback logic for backward compatibility
    const steps = [
      { id: 1, name: "Submit Order", completed: true, active: false },
      { id: 2, name: "Waiting for Delivery", completed: false, active: false },
      { id: 3, name: "Out for delivery", completed: false, active: false },
      { id: 4, name: "Transaction Complete", completed: false, active: false },
    ];

    // Determine completion based on status
    const status = order?.status || '';
    switch (status) {
      case 'confirmed':
      case 'processing':
        steps[0].completed = true;
        steps[1].completed = true;
        steps[1].active = true;
        break;
      case 'shipped':
        steps[0].completed = true;
        steps[1].completed = true;
        steps[2].completed = true;
        steps[2].active = true;
        break;
      case 'delivered':
        steps.forEach(step => {
          step.completed = true;
          step.active = false;
        });
        steps[3].active = true;
        break;
      default:
        steps[0].active = true;
    }

    return steps;
  };

  const OrderListWithPagination = () => (
    <div className="flex flex-col items-center justify-center gap-6 md:gap-12 relative w-full">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryp-300"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full max-w-[1021px] items-start gap-4 md:gap-6 relative">
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewOrder={() => handleOrderSelect(order.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination - Only show if there are orders */}
      {totalPages > 1 && (
        <Pagination className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
          <PaginationPrevious
            label={'  '}
            className="relative bg-[url('/images/mdi_arrow-backward.svg')] bg-no-repeat bg-center w-6 h-6 hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={!paginationData.hasPrevPage}
          >
            {' '}
          </PaginationPrevious>

          <PaginationContent className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            {[...Array(Math.min(totalPages, 5))].map((item, index) => {
              // Show pages around current page
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = currentPage - 2 + index;
              }

              return (
                <PaginationItem
                  style={pageNumber === currentPage ? ACTIVE_PAGINATION_ITEM_STYLE : PAGINATION_ITEM_STYLE}
                  className="rounded-full"
                  key={pageNumber}
                >
                  <PaginationLink
                    className="relative hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>

          <PaginationNext
            className="relative bg-[url('/images/mdi_arrow-forward.svg')] bg-no-repeat bg-center w-6 h-6 hover:bg-primaryp-300 hover:text-white overflow-hidden flex items-center justify-center [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-defaultgrey-2 text-lg tracking-[0] leading-[21.6px]"
            aria-label="Go to next page"
            label={'  '}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={!paginationData.hasNextPage}
          >
          </PaginationNext>
        </Pagination>
      )}
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
                  value={orderCategory}
                  onValueChange={setOrderCategory}
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
                  <Select value={orderCategory} onValueChange={setOrderCategory}>
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
                <OrderDetailsSection 
                  order={selectedOrder} 
                  onBackToList={handleBackToOrderList}
                  onOrderUpdated={fetchOrders}
                />
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
