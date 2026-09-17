import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, Fieldset, Select, TextArea, Toggle } from "@/components/admin/Field";
import { ImageListField } from "@/components/admin/ImageField";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import type { Category, Product } from "@/types";

/**
 * One form for both adding and editing. Lists that used to be JSON arrays —
 * photographs, colours, tags, specifications — are edited as one value per
 * line, which is far easier to work with than a widget and survives paste.
 */
export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const editing = Boolean(product);
  const subCategories = categories.flatMap((c) =>
    c.subCategories.map((s) => ({ ...s, category: c.name, key: `${c.slug}-${s.slug}` })),
  );

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:items-end sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
            {editing ? product!.name : "Add a product"}
          </h1>
          {editing && (
            <p className="mt-2 text-sm text-fg-muted">
              Live at{" "}
              <Link
                href={`/product/${product!.slug}`}
                target="_blank"
                className="text-accent-ink underline underline-offset-4"
              >
                /product/{product!.slug}
              </Link>
            </p>
          )}
        </div>
        <Button asChild variant="ghost" size="md">
          <Link href="/admin/products">Back to list</Link>
        </Button>
      </div>

      <form action={saveProduct} className="mt-8 space-y-6">
        <input type="hidden" name="originalSlug" value={product?.slug ?? ""} />

        <Fieldset legend="The basics">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Name" name="name" defaultValue={product?.name} required />
            <Field
              label="Web address"
              name="slug"
              defaultValue={product?.slug}
              hint="Leave blank to build one from the name."
            />
            <Field label="Brand" name="brand" defaultValue={product?.brand} />
            <Field label="SKU" name="sku" defaultValue={product?.sku} />
            <Select label="Category" name="category" defaultValue={product?.category}>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Select label="Shelf" name="subCategory" defaultValue={product?.subCategory}>
              {subCategories.map((sub) => (
                <option key={sub.key} value={sub.slug}>
                  {sub.category} › {sub.name}
                </option>
              ))}
            </Select>
            <Select label="Made for" name="gender" defaultValue={product?.gender}>
              <option value="unisex">Anyone</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </Select>
          </div>
        </Fieldset>

        <Fieldset legend="Price and stock">
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            <Field
              label="Selling price (₹)"
              name="price"
              type="number"
              min={0}
              defaultValue={product?.price}
              required
            />
            <Field
              label="Was (₹)"
              name="mrp"
              type="number"
              min={0}
              defaultValue={product?.mrp}
              hint="Shown struck through. Same as the price means no discount badge."
            />
            <Field
              label="Rating out of 5"
              name="rating"
              type="number"
              step="0.1"
              min={0}
              max={5}
              defaultValue={product?.rating}
            />
            <Field
              label="Number of reviews"
              name="reviewCount"
              type="number"
              min={0}
              defaultValue={product?.reviewCount}
            />
          </div>
          <div className="space-y-3 pt-1">
            <Toggle label="In stock" name="inStock" defaultChecked={product?.inStock ?? true} />
            <Toggle
              label="Featured"
              name="isFeatured"
              defaultChecked={product?.isFeatured}
              hint="Can appear in the home banner and the featured rail."
            />
            <Toggle
              label="New arrival"
              name="isNewArrival"
              defaultChecked={product?.isNewArrival}
              hint="Adds the New badge and lifts it up the “newest” sort."
            />
          </div>
        </Fieldset>

        <Fieldset
          legend="Photographs"
          description="Upload as many as you like. The first is the one shown on cards and in search — use the arrows to change the order."
        >
          <ImageListField
            name="images"
            label="Pictures"
            initial={product?.images ?? []}
            shape="product"
            hint="Cropped to 4:5 and converted to WebP on upload."
          />
        </Fieldset>

        <Fieldset legend="Words">
          <TextArea
            label="Short description"
            name="shortDescription"
            rows={2}
            defaultValue={product?.shortDescription}
            hint="One line. Used on cards and in search results."
          />
          <TextArea
            label="Full description"
            name="description"
            rows={6}
            defaultValue={product?.description}
          />
        </Fieldset>

        <Fieldset legend="Details">
          <TextArea
            label="Specifications"
            name="specs"
            rows={6}
            defaultValue={Object.entries(product?.specs ?? {})
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")}
            hint="One per line, as “Label: value”."
            placeholder={"Movement: Automatic, 41-hour reserve\nCase: Steel, 38mm"}
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <TextArea
              label="Colours"
              name="colours"
              rows={4}
              defaultValue={product?.colours.join("\n")}
              hint="One per line."
            />
            <TextArea
              label="Tags"
              name="tags"
              rows={4}
              defaultValue={product?.tags.join("\n")}
              hint="One per line. “bestseller” puts it in the Best sellers rail."
            />
          </div>
        </Fieldset>

        <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t border-line bg-surface-2/95 px-5 py-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            {editing ? "Save changes" : "Add product"}
          </Button>
          <Button asChild variant="ghost" size="lg" className="hidden sm:inline-flex">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        </div>
      </form>

      {editing && (
        <form
          action={deleteProduct}
          className="mt-10 rounded-[var(--radius-lg)] border border-line bg-surface p-6"
        >
          <input type="hidden" name="slug" value={product!.slug} />
          <h2 className="text-xs tracking-[0.14em] text-accent-ink uppercase">Remove</h2>
          <p className="mt-3 text-sm text-fg-muted">
            Deletes {product!.name} from the catalogue. Anyone holding a link to it will get a
            not-found page. This cannot be undone.
          </p>
          <Button type="submit" variant="outline" size="md" className="mt-5">
            Delete this product
          </Button>
        </form>
      )}
    </div>
  );
}
