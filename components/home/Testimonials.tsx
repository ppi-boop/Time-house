import { SectionHeading } from "@/components/SectionHeading";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { getTestimonials } from "@/lib/db/content";

export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="container-luxe py-14 lg:py-20">
      <SectionHeading
        eyebrow="In their words"
        title="What people tell us afterwards"
        align="center"
      />
      <TestimonialCarousel items={testimonials} />
    </section>
  );
}
