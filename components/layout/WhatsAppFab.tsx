"use client";

import { useEffect, useState } from "react";
import { generalEnquiryLink } from "@/lib/whatsapp";
import { useShop } from "@/components/shop/ShopProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { useBottomBar } from "@/store/useBottomBar";

/** Always-available way to reach the shop. Fades in once the hero is behind you. */
export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);
  const barVisible = useBottomBar((s) => s.visible);
  const shop = useShop();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={generalEnquiryLink(shop)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "group fixed right-4 bottom-4 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3.5 pr-5 pl-4 text-sm font-medium text-[#04281a] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-luxe hover:bg-[#1eb855] sm:right-6 sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        barVisible && "pointer-events-none scale-90 opacity-0 lg:pointer-events-auto lg:scale-100 lg:opacity-100",
      )}
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
