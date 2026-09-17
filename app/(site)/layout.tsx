import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { JsonLd } from "@/components/JsonLd";
import { Toaster } from "@/components/ui/Toaster";
import { ShopProvider } from "@/components/shop/ShopProvider";
import { getMegaMenu } from "@/lib/navigation";
import { getSettings } from "@/lib/db/content";
import { organizationSchema, websiteSchema } from "@/lib/seo";

/** The shop front: everything a customer sees. The admin panel sits outside it. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Built once on the server so the menu has data on first paint. The search
  // index is larger and loads separately, from /api/search, on demand.
  const [menu, settings] = await Promise.all([getMegaMenu(), getSettings()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-brand focus:px-5 focus:py-3 focus:text-xs focus:tracking-[0.16em] focus:text-on-brand focus:uppercase"
      >
        Skip to content
      </a>
      <JsonLd schema={[organizationSchema(settings.logo), websiteSchema()]} />
      {/* The header, the mobile menu and every WhatsApp button are client
          components; this is where they get the live shop details. */}
      <ShopProvider
        shop={{
          name: settings.name,
          logo: settings.logo,
          whatsapp: settings.whatsapp,
          phone: settings.phone,
          email: settings.email,
          tagline: settings.tagline,
        }}
      >
        <AnnouncementBar />
        <Header menu={menu} />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFab />
        <ScrollToTop />
        <Toaster />
      </ShopProvider>
    </>
  );
}
