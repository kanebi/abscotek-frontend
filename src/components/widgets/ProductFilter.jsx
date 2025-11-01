import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { MultiThumbSlider, Slider } from "@/components/ui/slider";
import React, { useState, useEffect } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { DRAWER_CONTENT_STYLE } from "@/components/constants";
import useStore from "@/store/useStore";
import { useSearchParams } from "react-router-dom";

const ProductFilter = ({ className = "", onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([100, 2000]);
  const {userCurrency} = useStore();

  // Initialize state from URL params
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? searchParams.get('category').split(',') : []
  );
  const [selectedColors, setSelectedColors] = useState(
    searchParams.get('color') ? searchParams.get('color').split(',') : []
  );
  const [selectedSizes, setSelectedSizes] = useState(
    searchParams.get('size') ? searchParams.get('size').split(',') : []
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Update category
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    } else {
      params.delete('category');
    }

    // Update color
    if (selectedColors.length > 0) {
      params.set('color', selectedColors.join(','));
    } else {
      params.delete('color');
    }

    // Update size
    if (selectedSizes.length > 0) {
      params.set('size', selectedSizes.join(','));
    } else {
      params.delete('size');
    }

    // Update price range
    if (priceRange[0] !== 100 || priceRange[1] !== 2000) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    } else {
      params.delete('minPrice');
      params.delete('maxPrice');
    }

    // Reset to page 1 when filters change
    params.set('page', '1');

    setSearchParams(params, { replace: true });

    // Notify parent component of filter changes
    if (onFiltersChange) {
      onFiltersChange({
        category: selectedCategories,
        color: selectedColors,
        size: selectedSizes,
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      });
    }
  }, [selectedCategories, selectedColors, selectedSizes, priceRange, searchParams, setSearchParams, onFiltersChange]);

  // Category filter options
  const categoryOptions = [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "huawei", label: "Huawei" },
    { id: "tecno", label: "Tecno" },
    { id: "infinix", label: "Infinix" },
  ];

  // Color filter options
  const colorOptions = [
    { id: "blue", label: "Blue", color: "#4348d6" },
    { id: "black", label: "Black", color: "#000000" },
    { id: "red", label: "Red", color: "#d64343" },
    { id: "white", label: "White", color: "#ffffff" },
    { id: "yellow", label: "Yellow", color: "#cad643" },
  ];

  // Size filter options
  const sizeOptions = [
    { id: "64gb", label: "64GB" },
    { id: "128gb", label: "128GB" },
    { id: "256gb", label: "256GB" },
  ];

  // Handle category checkbox changes
  const handleCategoryChange = (categoryId, checked) => {
    setSelectedCategories(prev =>
      checked
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    );
  };

  // Handle color checkbox changes
  const handleColorChange = (colorId, checked) => {
    setSelectedColors(prev =>
      checked
        ? [...prev, colorId]
        : prev.filter(id => id !== colorId)
    );
  };

  // Handle size checkbox changes
  const handleSizeChange = (sizeId, checked) => {
    setSelectedSizes(prev =>
      checked
        ? [...prev, sizeId]
        : prev.filter(id => id !== sizeId)
    );
  };

  return (
    <div className={`flex flex-col w-full items-start gap-6 ${className}`}>
      {/* Category filter */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="category"
      >
        <AccordionItem value="category" className="border-none">
          <AccordionTrigger className="font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-white text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] [font-style:var(--heading-header-6-header-6-semibold-font-style)] py-0">
            Category
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="flex flex-col w-[108px] items-start gap-4">
              {categoryOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3 w-full"
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedCategories.includes(option.id)}
                    onCheckedChange={(checked) => handleCategoryChange(option.id, checked)}
                    className="w-5 h-5 rounded border-neutral-100"
                  />
                  <label
                    htmlFor={option.id}
                    className="font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator
        className="w-full h-px mt-[-1.00px] bg-neutral-600 relative self-stretch object-cover"
      />

      {/* Price filter */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="price"
      >
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger  className="font-heading-header-6-header-6-semibold text-white text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] [font-style:var(--heading-header-6-header-6-semibold-font-style)] py-0">
            Price
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex items-start justify-between w-full">
                  <div className="leading-[var(--body-xlarge-xlarge-semibold-line-height)] mt-[-1.00px] text-defaultwhite whitespace-nowrap ">
                    {userCurrency}{' '}{priceRange[0].toLocaleString()}
                  </div>
                  <div className="leading-[var(--heading-header-6-header-6-semibold-line-height)] mt-[-1.00px] text-defaultwhite whitespace-nowrap">
                    {userCurrency}{' '}{priceRange[1].toLocaleString()}
                  </div>
                </div>
                <div className="relative self-stretch w-full h-6 mx-auto">
                  
                <MultiThumbSlider
                      defaultValue={[100, 2000]}
                      max={200000}
                      min={0}
                      step={2}
                      onValueChange={(value)=>setPriceRange(value)}
                    />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator
        className="w-full h-px mt-[-1.00px] bg-neutral-600 relative self-stretch object-cover"
      />

      {/* Color filter */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="color"
      >
        <AccordionItem value="color" className="border-none">
          <AccordionTrigger className="font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-white text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] [font-style:var(--heading-header-6-header-6-semibold-font-style)] py-0">
            Color
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="flex flex-col items-start gap-4 w-full">
              {colorOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`color-${option.id}`}
                      checked={selectedColors.includes(option.id)}
                      onCheckedChange={(checked) => handleColorChange(option.id, checked)}
                      className="w-5 h-5 rounded border-neutral-100"
                    />
                    <label
                      htmlFor={`color-${option.id}`}
                      className="font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]"
                    >
                      {option.label}
                    </label>
                  </div>
                  <div
                    className="w-8 h-4 border border-solid border-[#e8e9e94c]"
                    style={{ backgroundColor: option.color }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator
        className="w-full h-px mt-[-1.00px] bg-neutral-600 relative self-stretch object-cover"
      />

      {/* Size filter */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="size"
      >
        <AccordionItem value="size" className="border-none">
          <AccordionTrigger className="font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-white text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] [font-style:var(--heading-header-6-header-6-semibold-font-style)] py-0">
            Size
          </AccordionTrigger>
          <AccordionContent className="pt-6">
            <div className="flex flex-col w-[108px] items-start gap-4">
              {sizeOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3 w-full"
                >
                  <Checkbox
                    id={`size-${option.id}`}
                    checked={selectedSizes.includes(option.id)}
                    onCheckedChange={(checked) => handleSizeChange(option.id, checked)}
                    className="w-5 h-5 rounded border-neutral-100"
                  />
                  <label
                    htmlFor={`size-${option.id}`}
                    className="font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const MobileFilterButton = ({ onFiltersChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
        <div className="md:hidden w-full">
         {/* Mobile Filter Button */}
          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                style={{border:'1px solid #FF5059'}}
                className="p-3.5 w-[100%]  rounded-xl  border-solid  text-sm text-white bg-transparent hover:text-white hover:bg-neutral-800"
              >
               <span>Filter</span> <Filter className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent style={DRAWER_CONTENT_STYLE} className="bg-[#131314] border-neutral-600">
              <DrawerHeader className="border-b border-neutral-600">
                <DrawerTitle className="text-white">Filters</DrawerTitle>
                <DrawerDescription className="text-defaultgrey-2">
                  Apply filters to narrow down your search
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <ProductFilter onFiltersChange={onFiltersChange} />
              </div>
              <DrawerFooter className="border-t border-neutral-600">
                <DrawerClose asChild>
                  <Button
                    className="bg-primaryp-300 text-white hover:bg-primaryp-400"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
  );
};

export { ProductFilter };
export default ProductFilter;