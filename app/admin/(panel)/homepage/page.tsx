import { Button } from "@/components/ui/Button";
import { Field, Fieldset, TextArea } from "@/components/admin/Field";
import { ImageListField, ImagePickerField } from "@/components/admin/ImageField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { deleteTestimonial, saveHomepage, saveLookbook, saveTestimonial } from "@/app/admin/actions";
import { getLookbook, getSettings, getTestimonials } from "@/lib/db/content";

export default async function HomepagePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const [settings, testimonials, lookbook] = await Promise.all([
    getSettings(),
    getTestimonials(),
    getLookbook(),
  ]);
  const home = settings.home;

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        Homepage
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        The wording and pictures on the front page. Product rails fill themselves from the
        catalogue.
      </p>

      {saved && <AdminNotice>Saved. The change is live on the site.</AdminNotice>}
      {deleted && <AdminNotice>Removed.</AdminNotice>}

      <form action={saveHomepage} className="mt-8 space-y-6">
        <Fieldset
          legend="Promise cards"
          description="The four cards under the banner. One per line, as “Title | the line underneath”."
        >
          <TextArea
            label="Cards"
            name="trustPoints"
            rows={6}
            defaultValue={settings.trustPoints
              .map((point) => `${point.title} | ${point.body}`)
              .join("\n")}
            hint="Four fit the row neatly. Each gets an icon automatically."
          />
        </Fieldset>

        <Fieldset legend="The banner">
          <Field label="Small line above" name="heroEyebrow" defaultValue={home.heroEyebrow} />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Headline, first line" name="heroTitleTop" defaultValue={home.heroTitleTop} />
            <Field
              label="Headline, second line"
              name="heroTitleBottom"
              defaultValue={home.heroTitleBottom}
              hint="Shown in gold."
            />
          </div>
          <TextArea label="Paragraph" name="heroBody" rows={3} defaultValue={home.heroBody} />
        </Fieldset>

        <Fieldset legend="The story panel">
          <Field label="Heading" name="storyTitle" defaultValue={home.storyTitle} />
          <TextArea
            label="Quote"
            name="storyQuote"
            rows={5}
            defaultValue={home.storyQuote}
            hint="The larger paragraph in quotation marks."
          />
          <TextArea label="Closing line" name="storyBody" rows={2} defaultValue={home.storyBody} />
          <div className="grid gap-5 sm:grid-cols-2">
            <ImagePickerField
              name="storyImage"
              label="Square picture"
              initial={home.storyImage}
              shape="square"
              hint="The panel on the home page."
            />
            <ImagePickerField
              name="storyWideImage"
              label="Wide picture"
              initial={home.storyWideImage}
              shape="wide"
              hint="The band across the top of the About page."
            />
          </div>
        </Fieldset>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Save homepage
        </Button>
      </form>

      <section className="mt-12">
        <h2 className="font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          What customers say
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Shown in the quotes rail. Get permission before publishing someone&apos;s words.
        </p>

        <ul className="mt-6 space-y-4">
          {testimonials.map((item) => (
            <li key={item.id} className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6">
              <form action={saveTestimonial} className="space-y-5">
                <input type="hidden" name="id" value={item.id} />
                <TextArea label="Quote" name="quote" rows={3} defaultValue={item.quote} />
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
                  <Field label="Name" name="name" defaultValue={item.name} />
                  <Field label="What they bought" name="detail" defaultValue={item.detail} />
                  <Field
                    label="Stars"
                    name="rating"
                    type="number"
                    min={1}
                    max={5}
                    defaultValue={item.rating}
                  />
                </div>
                <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
                  Save
                </Button>
              </form>
              <form action={deleteTestimonial} className="mt-3">
                <input type="hidden" name="id" value={item.id} />
                <Button type="submit" variant="ghost" size="sm" className="w-full sm:w-auto">
                  Remove
                </Button>
              </form>
            </li>
          ))}
        </ul>

        <form
          action={saveTestimonial}
          className="mt-4 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface p-5 sm:p-6"
        >
          <h3 className="text-xs tracking-[0.14em] text-accent-ink uppercase">Add a quote</h3>
          <div className="mt-5 space-y-5">
            <TextArea label="Quote" name="quote" rows={3} required />
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
              <Field label="Name" name="name" required />
              <Field label="What they bought" name="detail" />
              <Field label="Stars" name="rating" type="number" min={1} max={5} defaultValue={5} />
            </div>
            <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
              Add quote
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
          Lookbook strip
        </h2>
        <form
          action={saveLookbook}
          className="mt-6 rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6"
        >
          <ImageListField
            name="images"
            label="Pictures"
            initial={lookbook.map((shot) => shot.image)}
            shape="square"
            hint="Six looks best. Use the arrows to set the order they appear in."
          />
          <Button type="submit" variant="outline" size="sm" className="mt-5">
            Save lookbook
          </Button>
        </form>
      </section>
    </div>
  );
}
