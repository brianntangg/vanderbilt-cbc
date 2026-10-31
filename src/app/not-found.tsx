import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

export default function NotFound() {
  return (
    <Section
      as="h1"
      eyebrow="404"
      title="We couldn't find that page"
      intro="It may have moved, or the link might be off by a letter."
      className="pt-20 sm:pt-28"
    >
      <Button href="/">Back to home</Button>
    </Section>
  );
}
