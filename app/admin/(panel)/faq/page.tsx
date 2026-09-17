import { Button } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/admin/Field";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { deleteFaq, saveFaq } from "@/app/admin/actions";
import { getFaqs } from "@/lib/db/content";

export default async function AdminFaq({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const faqs = await getFaqs();

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
        FAQ
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        Shown on /faq, and given to search engines as structured answers.
      </p>

      {saved && <AdminNotice>Saved. The change is live on the site.</AdminNotice>}
      {deleted && <AdminNotice>Answer removed.</AdminNotice>}

      <ul className="mt-8 space-y-4">
        {faqs.map((faq) => (
          <li key={faq.id} className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-6">
            <form action={saveFaq} className="space-y-5">
              <input type="hidden" name="id" value={faq.id} />
              <Field label="Question" name="question" defaultValue={faq.question} />
              <TextArea label="Answer" name="answer" rows={4} defaultValue={faq.answer} />
              <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
                Save
              </Button>
            </form>
            <form action={deleteFaq} className="mt-3">
              <input type="hidden" name="id" value={faq.id} />
              <Button type="submit" variant="ghost" size="sm" className="w-full sm:w-auto">
                Remove
              </Button>
            </form>
          </li>
        ))}
      </ul>

      <form
        action={saveFaq}
        className="mt-4 space-y-4 rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-surface p-5 sm:space-y-5 sm:p-6"
      >
        <h2 className="text-xs tracking-[0.14em] text-accent-ink uppercase">Add an answer</h2>
        <Field label="Question" name="question" required />
        <TextArea label="Answer" name="answer" rows={4} required />
        <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
          Add
        </Button>
      </form>
    </div>
  );
}
