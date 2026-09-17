"use client";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { productEnquiryLink } from "@/lib/whatsapp";
import { useShop } from "@/components/shop/ShopProvider";
import type { Product } from "@/types";

/**
 * The buy button. There is no checkout on this site — this opens WhatsApp with
 * the product already written into the message.
 */
export function BuyOnWhatsAppButton({
  product,
  quantity = 1,
  colour,
  label = "Buy on WhatsApp",
  variant = "primary",
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
  const shop = useShop();

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={productEnquiryLink(product, { quantity, colour, shop })}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon />
        {label}
      </a>
    </Button>
  );
}
