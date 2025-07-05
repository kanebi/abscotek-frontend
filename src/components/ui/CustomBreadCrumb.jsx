import React from "react";
import { Link } from "react-router-dom";

// Usage: <Breadcrumb items={[{label: 'Home', to: '/'}, ...]} />
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="inline-flex justify-start items-center gap-2 text-gray-200 text-base font-normal font-sans leading-normal overflow-x-auto whitespace-nowrap max-w-full">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <span className="w-6 h-6 flex items-center justify-center">
              {/* Chevron SVG */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4L10 8L6 12" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
          {item.to ? (
            <Link to={item.to} className="hover:underline text-gray-200 text-base font-normal font-sans leading-normal max-w-[120px] truncate inline-block align-bottom">{item.label}</Link>
          ) : (
            <span className="text-gray-200 text-base font-normal font-sans leading-normal max-w-[120px] truncate inline-block align-bottom">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
