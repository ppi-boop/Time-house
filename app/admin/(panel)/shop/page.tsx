import { Button } from "@/components/ui/Button";
import { Field, Fieldset, TextArea } from "@/components/admin/Field";
import { ImagePickerField } from "@/components/admin/ImageField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { saveSettings } from "@/app/admin/actions";
import { getSettings } from "@/lib/db/content";

export default async function ShopSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Shop details
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        Used in the header, the footer, the contact page, every WhatsApp message and the data
        search engines read.
      </p>

      {saved && <AdminNotice>Saved. The change is live on the site.</AdminNotice>}

      <form action={saveSettings} className="mt-8 space-y-6">
        <Fieldset legend="Identity">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Shop name" name="name" defaultValue={settings.name} required />
            <Field label="Legal name" name="legalName" defaultValue={settings.legalName} />
            <Field
              label="Founded"
              name="foundedYear"
              type="number"
              defaultValue={settings.foundedYear}
            />
            <ImagePickerField
              name="logo"
              label="Logo"
              initial={settings.logo ?? ""}
              shape="logo"
              hint="Leave empty to use the drawn clock mark."
            />
          </div>
          <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
          <TextArea
            label="Description"
            name="description"
            rows={3}
            defaultValue={settings.description}
            hint="The sentence search engines and social previews show."
          />
        </Fieldset>

        <Fieldset legend="Getting in touch">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            <Field
              label="WhatsApp number"
              name="whatsapp"
              defaultValue={settings.whatsapp}
              hint="Country code and number, digits only. Every buy button opens this chat."
              required
            />
            <Field label="Phone" name="phone" defaultValue={settings.phone} />
            <Field label="Email" name="email" type="email" defaultValue={settings.email} />
          </div>
        </Fieldset>

        <Fieldset legend="Where you are">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            <Field label="Street" name="street" defaultValue={settings.address.street} className="sm:col-span-2 lg:col-span-3" />
            <Field label="Area" name="locality" defaultValue={settings.address.locality} />
            <Field label="City" name="city" defaultValue={settings.address.city} />
            <Field label="State" name="region" defaultValue={settings.address.region} />
            <Field label="Postcode" name="postalCode" defaultValue={settings.address.postalCode} />
            <Field label="Country code" name="country" defaultValue={settings.address.country} />
            <Field
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              defaultValue={settings.geo.latitude}
            />
            <Field
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              defaultValue={settings.geo.longitude}
            />
          </div>
          <TextArea
            label="Opening hours"
            name="hours"
            rows={3}
            defaultValue={settings.hours.map((h) => `${h.days} | ${h.time}`).join("\n")}
            hint="One line each, as “days | times”."
          />
        </Fieldset>

        <Fieldset legend="Elsewhere">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            <Field label="Instagram" name="instagram" defaultValue={settings.socials.instagram} />
            <Field label="Facebook" name="facebook" defaultValue={settings.socials.facebook} />
            <Field label="YouTube" name="youtube" defaultValue={settings.socials.youtube} />
          </div>
        </Fieldset>

        <Fieldset legend="Announcement bar">
          <TextArea
            label="Messages"
            name="announcements"
            rows={4}
            defaultValue={settings.announcements.join("\n")}
            hint="One per line. They scroll across the top of every page."
          />
        </Fieldset>

        <div className="sticky bottom-0 -mx-5 border-t border-line bg-surface-2/95 px-5 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Save shop details
          </Button>
        </div>
      </form>
    </div>
  );
}
