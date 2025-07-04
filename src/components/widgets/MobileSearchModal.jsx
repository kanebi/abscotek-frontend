import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { DIALOG_CONTENT_STYLE } from "@/components/constants";
import { AppRoutes } from "@/config/routes";

const MOCK_PRODUCTS = [
  "Apple iPhone 16 Plus ESIM 128GB",
  "Samsung Galaxy S23 Ultra",
  "Huawei Mate 50 Pro",
  "Tecno Camon 20",
  "Infinix Note 12",
];

export default function MobileSearchModal({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const filtered =
    query.length > 0
      ? MOCK_PRODUCTS.filter((p) => p.toLowerCase().includes(query.toLowerCase()))
      : [];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      onOpenChange(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={DIALOG_CONTENT_STYLE}>
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-neutral-200 text-lg font-semibold">Find Products</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 py-4">
          
<div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
                            <Search className="relative w-5 h-5 text-[#858585]" />
                            <input
                             onChange={(e) => setQuery(e.target.value)}
                             onKeyDown={handleKeyDown}
                             onFocus={() => setFocused(true)}
                             onBlur={() => setFocused(false)}
                             
            autoFocus
            value={query}
                             placeholder="Search for products..."
                            type="text" style={{ backgroundColor: 'transparent', border: 'none', height: 'inherit', width: 'inherit', outline: 'none' }} className="relative w-fit mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-[#858585] text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]" />
                        </div>
          <div
            className={
              (focused && filtered.length > 0)
                ? "mt-2 bg-neutral-900 rounded-xl border border-neutral-700 shadow-lg max-h-48 overflow-y-auto transition-all duration-300"
                : "mt-2 bg-neutral-900 rounded-xl border border-neutral-700 shadow-lg max-h-0 overflow-hidden transition-all duration-300"
            }
          >
            {(focused && filtered.length > 0) && filtered.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2 text-white text-base cursor-pointer hover:bg-primaryp-300 hover:text-white rounded-xl"
                onMouseDown={() => {
                  setQuery(item);
                  onOpenChange(false);
                  navigate(`${AppRoutes.search.path}?q=${encodeURIComponent(item)}`);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 