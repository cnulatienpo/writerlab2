import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function DesireRoom() {
  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Desire Room</h1>
      <Accordion type="multiple" collapsible>
        <AccordionItem value="definition">
          <AccordionTrigger>Definition &amp; Why It Matters</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "Definition & Why It Matters" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="desire-and-you">
          <AccordionTrigger>Desire &amp; You (The Writer)</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "Desire & You (The Writer)" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pop-culture-examples">
          <AccordionTrigger>Pop Culture Examples</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "Pop Culture Examples" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="say-what-they-want">
          <AccordionTrigger>How to Spot It: They SAY What They Want</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "How to Spot It: They SAY What They Want" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="show-what-they-want">
          <AccordionTrigger>How to Spot It: They SHOW What They Want</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "How to Spot It: They SHOW What They Want" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hide-what-they-want">
          <AccordionTrigger>How to Spot It: They HIDE What They Want</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "How to Spot It: They HIDE What They Want" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="potency-low">
          <AccordionTrigger>Potency: Low (The Quiet Want)</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "Potency: Low (The Quiet Want)" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="potency-medium">
          <AccordionTrigger>Potency: Medium (The Active Want)</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "Potency: Medium (The Active Want)" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="potency-high">
          <AccordionTrigger>Potency: High (The Consuming Need)</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "Potency: High (The Consuming Need)" content here */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="manipulate-potency">
          <AccordionTrigger>How to Manipulate Potency Levels (Writer's Toolbox)</AccordionTrigger>
          <AccordionContent>
            {/* Paste your longform "How to Manipulate Potency Levels (Writer's Toolbox)" content here */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
