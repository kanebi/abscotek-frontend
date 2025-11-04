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

const ProductFilter = ({
  className = "",
  onFiltersChange,
  selectedCategories: propSelectedCategories,
  selectedColors: propSelectedColors,
  selectedSizes: propSelectedSizes,
  priceRange: propPriceRange,
  onCategoryChange,
  onColorChange,
  onSizeChange,
  onPriceRangeChange
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {userCurrency} = useStore();

  // Use props if provided (for mobile), otherwise use local state
  const [selectedCategories, setSelectedCategories] = useState(
    propSelectedCategories || (searchParams.get('category') ? searchParams.get('category').split(',') : [])
  );
  const [selectedColors, setSelectedColors] = useState(
    propSelectedColors || (searchParams.get('color') ? searchParams.get('color').split(',') : [])
  );
  const [selectedSizes, setSelectedSizes] = useState(
    propSelectedSizes || (searchParams.get('size') ? searchParams.get('size').split(',') : [])
  );
  const [priceRange, setPriceRange] = useState(propPriceRange || [100, 2000]);

  // State for pending filters (before apply)
  const [pendingFilters, setPendingFilters] = useState({
    categories: selectedCategories,
    colors: selectedColors,
    sizes: selectedSizes,
    priceRange: priceRange
  });

  // Update pending filters when selections change
  useEffect(() => {
    setPendingFilters({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange: priceRange
    });
  }, [selectedCategories, selectedColors, selectedSizes, priceRange]);

  // Apply filters function
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    // Update category
    if (pendingFilters.categories.length > 0) {
      params.set('category', pendingFilters.categories.join(','));
    } else {
      params.delete('category');
    }

    // Update color
    if (pendingFilters.colors.length > 0) {
      params.set('color', pendingFilters.colors.join(','));
    } else {
      params.delete('color');
    }

    // Update size
    if (pendingFilters.sizes.length > 0) {
      params.set('size', pendingFilters.sizes.join(','));
    } else {
      params.delete('size');
    }

    // Update price range
    if (pendingFilters.priceRange[0] !== 100 || pendingFilters.priceRange[1] !== 2000) {
      params.set('minPrice', pendingFilters.priceRange[0].toString());
      params.set('maxPrice', pendingFilters.priceRange[1].toString());
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
        category: pendingFilters.categories,
        color: pendingFilters.colors,
        size: pendingFilters.sizes,
        minPrice: pendingFilters.priceRange[0],
        maxPrice: pendingFilters.priceRange[1]
      });
    }
  };

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
    if (onCategoryChange) {
      onCategoryChange(categoryId, checked);
    } else {
      setSelectedCategories(prev =>
        checked
          ? [...prev, categoryId]
          : prev.filter(id => id !== categoryId)
      );
    }
  };

  // Handle color checkbox changes
  const handleColorChange = (colorId, checked) => {
    if (onColorChange) {
      onColorChange(colorId, checked);
    } else {
      setSelectedColors(prev =>
        checked
          ? [...prev, colorId]
          : prev.filter(id => id !== colorId)
      );
    }
  };

  // Handle size checkbox changes
  const handleSizeChange = (sizeId, checked) => {
    if (onSizeChange) {
      onSizeChange(sizeId, checked);
    } else {
      setSelectedSizes(prev =>
        checked
          ? [...prev, sizeId]
          : prev.filter(id => id !== sizeId)
      );
    }
  };

  // Handle price range changes
  const handlePriceRangeChange = (value) => {
    if (onPriceRangeChange) {
      onPriceRangeChange(value);
    } else {
      setPriceRange(value);
    }
  };

  return (
    <div className={`flex flex-col w-full items-start gap-6 ${className}`}>
      {/* Apply Filters Button - Desktop Only */}
      <div className="hidden md:block w-full">
        <Button
          onClick={applyFilters}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium"
        >
          Apply Filters
        </Button>
      </div>

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
                    className="w-5 h-5 rounded border-neutral-100 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
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
                      onValueChange={handlePriceRangeChange}
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
                      className="w-5 h-5 rounded border-neutral-100 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
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
                    className="w-5 h-5 rounded border-neutral-100 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
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

  // State for pending filters (before apply)
  const [pendingFilters, setPendingFilters] = useState({
    categories: selectedCategories,
    colors: selectedColors,
    sizes: selectedSizes,
    priceRange: priceRange
  });

  // Update pending filters when selections change
  useEffect(() => {
    setPendingFilters({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange: priceRange
    });
  }, [selectedCategories, selectedColors, selectedSizes, priceRange]);

  // Apply filters function for mobile
  const applyMobileFilters = () => {
    const params = new URLSearchParams(searchParams);

    // Update category
    if (pendingFilters.categories.length > 0) {
      params.set('category', pendingFilters.categories.join(','));
    } else {
      params.delete('category');
    }

    // Update color
    if (pendingFilters.colors.length > 0) {
      params.set('color', pendingFilters.colors.join(','));
    } else {
      params.delete('color');
    }

    // Update size
    if (pendingFilters.sizes.length > 0) {
      params.set('size', pendingFilters.sizes.join(','));
    } else {
      params.delete('size');
    }

    // Update price range
    if (pendingFilters.priceRange[0] !== 100 || pendingFilters.priceRange[1] !== 2000) {
      params.set('minPrice', pendingFilters.priceRange[0].toString());
      params.set('maxPrice', pendingFilters.priceRange[1].toString());
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
        category: pendingFilters.categories,
        color: pendingFilters.colors,
        size: pendingFilters.sizes,
        minPrice: pendingFilters.priceRange[0],
        maxPrice: pendingFilters.priceRange[1]
      });
    }

    setIsFilterOpen(false);
  };

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

  // Handle price range changes
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

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
                <div className="flex flex-col w-full items-start gap-6">
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
                                className="w-5 h-5 rounded border-neutral-100 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
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
                                  onValueChange={handlePriceRangeChange}
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
                                  className="w-5 h-5 rounded border-neutral-100 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
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
                                className="w-5 h-5 rounded border-neutral-100 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
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
              </div>
              <DrawerFooter className="border-t border-neutral-600">
                <Button
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={applyMobileFilters}
                >
                  Apply Filters
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
  );
};

export { ProductFilter };
export default ProductFilter;