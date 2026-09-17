"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { useEnquiry } from "@/store/useEnquiry";
import { useToast } from "@/store/useToast";
import type { Product } from "@/types";

/**
 * Adds to the local enquiry list. Nothing is sent anywhere until the customer
 * opens WhatsApp from /enquiry — this is only a way to gather a few pieces first.
 */
export function AddToEnquiryButton({
  product,
  quantity = 1,
  colour,
  label = "Add to Enquiry",
  variant = "outline",
  size = "lg",
  className,
}: {
  product: Product;
  quantity?: number;
  colour?: string;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const add = useEnquiry((s) => s.add);
  const toast = useToast((s) => s.push);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(timer);
  }, [added]);

  // When the button is icon-only (label ""), it still needs a name for screen readers.
  const accessibleName = added
    ? `${product.name} added to your enquiry list`
    : product.inStock
      ? `Add ${product.name} to your enquiry list`
      : `${product.name} is out of stock`;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      aria-label={label ? undefined : accessibleName}
      title={label ? undefined : accessibleName}
      disabled={!product.inStock}
      onClick={() => {
        add(product, { quantity, colour });
        setAdded(true);
        toast({
          title: "Added to enquiry list",
          description: product.name,
          image: product.images[0],
          action: { label: "View", href: "/enquiry" },
        });
      }}
    >
      <span className="relative flex size-[1.05em] items-center justify-center">
        <Plus
          className={`absolute transition-all duration-300 ease-spring ${
            added ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
        <Check
          className={`absolute transition-all duration-300 ease-spring ${
            added ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          }`}
        />
      </span>
      {label && (added ? "Added to list" : product.inStock ? label : "Out of stock")}
    </Button>
  );
}
