import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, Fieldset, TextArea } from "@/components/admin/Field";
import { ImagePickerField } from "@/components/admin/ImageField";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import type { Category } from "@/types";

/**
 * One form for both adding and editing a category, laid out like the product
 * form so the two halves of the panel read the same way. Shelves are edited as
 * one per line rather than through a widget — easier to work with, and it
 * survives paste.
 */
export function CategoryForm({
  category,
  productCount = 0,
  error,
}: {
  category?: Category;
  /** How many products sit on this counter; it cannot be removed while any do. */
  productCount?: number;
  error?: string;
}) {
  const editing = Boolean(category);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:items-end sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
            {editing ? category!.name : "Add a category"}
          </h1>
          {editing && (
            <p className="mt-2 text-sm text-fg-muted">
              Live at{" "}
              <Link
                href={`/category/${category!.slug}`}
                target="_blank"
                className="text-accent-ink underline underline-offset-4"
              >
                /category/{category!.slug}
              </Link>
            </p>
          )}
        </div>
        <Button asChild variant="ghost" size="md">
          <Link href="/admin/categories">Back to list</Link>
        </Button>
      </div>

      {error && <AdminNotice tone="warning">{error}</AdminNotice>}

      <form action={saveCategory} className="mt-8 space-y-6">
        <input type="hidden" name="originalSlug" value={category?.slug ?? ""} />

        <Fieldset legend="The basics">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Field
              label="Name"
              name="name"
              defaultValue={category?.name}
              required
              placeholder="Wall Clocks"
              hint="What customers see in the menu."
            />
            <Field
              label="Web address"
              name="slug"
              defaultValue={category?.slug}
              placeholder="wall-clocks"
              hint={
                editing
                  ? "Changing this moves the category page, and its products follow."
                  : "Leave blank to build one from the name."
              }
            />
          </div>
          <Field
            label="Small line above"
            name="tagline"
            defaultValue={category?.tagline}
            placeholder="Time, on the wall"
            hint="The little gold line above the name on the category page."
          />
          <TextArea
            label="Description"
            name="description"
            rows={3}
            defaultValue={category?.description}
            hint="The sentence under the heading, and what search engines show."
          />
        </Fieldset>

        <Fieldset
          legend="Card picture"
          description="The photograph on the home page card and behind the category heading."
        >
          <ImagePickerField
            name="image"
            label="Picture"
            initial={category?.image ?? ""}
            shape="product"
            hint="Cropped to 4:5. A placeholder is used until you add one."
          />
        </Fieldset>

        <Fieldset
          legend="Shelves"
          description="The collections inside this category. Products are filed onto these, and they fill the dropdown in the menu."
        >
          <TextArea
            label="One per line"
            name="subCategories"
            rows={6}
            defaultValue={category?.subCategories.map((s) => `${s.name} | ${s.slug}`).join("\n")}
            placeholder={"Pendulum | pendulum\nDigital | digital"}
            hint="As “Name | web-address”. Leave the address off and it is built from the name."
          />
        </Fieldset>

        <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-line bg-surface-2/95 px-5 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            {editing ? "Save changes" : "Add category"}
          </Button>
          <Button asChild variant="ghost" size="lg" className="hidden sm:inline-flex">
            <Link href="/admin/categories">Cancel</Link>
          </Button>
        </div>
      </form>

      {editing && (
        <form
          action={deleteCategory}
          className="mt-10 rounded-[var(--radius-lg)] border border-line bg-surface p-6"
        >
          <input type="hidden" name="slug" value={category!.slug} />
          <h2 className="text-xs tracking-[0.14em] text-accent-ink uppercase">Remove</h2>
          <p className="mt-3 text-sm text-fg-muted">
            {productCount > 0 ? (
              <>
                {category!.name} still holds {productCount}{" "}
                {productCount === 1 ? "product" : "products"}. Move them to another category, or
                delete them, before removing this one — otherwise they would point at a counter
                that no longer exists.
              </>
            ) : (
              <>
                Deletes {category!.name} from the shop. It disappears from the menu, the footer
                and the home page, and its address stops working. This cannot be undone.
              </>
            )}
          </p>
          <Button
            type="submit"
            variant="outline"
            size="md"
            className="mt-5"
            disabled={productCount > 0}
          >
            Delete this category
          </Button>
        </form>
      )}
    </div>
  );
}
