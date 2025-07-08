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
            <p>Desire is the engine that drives your characters. Whether it's a simple wish or an overwhelming obsession, it gives direction to every choice they make.</p>
            <p>Readers connect with characters who want something. If the want is clear, every obstacle builds tension and the story has momentum.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="desire-and-you">
          <AccordionTrigger>Desire &amp; You (The Writer)</AccordionTrigger>
          <AccordionContent>
            <p>When you sit down to write, look for the want beneath every scene. Ask what each character hopes to gain or fears to lose.</p>
            <p>Your curiosity about those wants guides the narrative. Let characters chase something meaningful and the draft will come alive.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pop-culture-examples">
          <AccordionTrigger>Pop Culture Examples</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-4">
              <li><em>The Lord of the Rings</em> – Frodo longs to destroy the One Ring and save his home.</li>
              <li><em>Mean Girls</em> – Cady just wants to belong, but popularity comes at a cost.</li>
              <li><em>The Hunger Games</em> – Katniss volunteers because she wants to protect her sister.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="say-what-they-want">
          <AccordionTrigger>How to Spot It: They SAY What They Want</AccordionTrigger>
          <AccordionContent>
            <p>Direct dialogue can reveal desire clearly. Listen for lines where a character names the goal.</p>
            <ul className="list-disc pl-4">
              <li>"I want out of this town."</li>
              <li>"All I ever needed was a little respect."</li>
              <li>"If I win this race, everything changes."</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="show-what-they-want">
          <AccordionTrigger>How to Spot It: They SHOW What They Want</AccordionTrigger>
          <AccordionContent>
            <p>Actions speak louder than declarations. Watch what a character does when desire is close.</p>
            <ul className="list-disc pl-4">
              <li>They linger outside the locked door.</li>
              <li>They collect trophies connected to a secret dream.</li>
              <li>They protect someone even when it costs them.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hide-what-they-want">
          <AccordionTrigger>How to Spot It: They HIDE What They Want</AccordionTrigger>
          <AccordionContent>
            <p>Hidden desire reveals itself in mixed signals. Notice how behavior conflicts with what the character says.</p>
            <ul className="list-disc pl-4">
              <li>They insist they don't care while clenching their fists.</li>
              <li>They change the subject whenever the topic arises.</li>
              <li>They sabotage themselves before anyone can see the truth.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="potency-low">
          <AccordionTrigger>Potency: Low (The Quiet Want)</AccordionTrigger>
          <AccordionContent>
            <p>Low potency desire hums beneath the surface. It might appear only in fleeting gestures or a passing thought.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="potency-medium">
          <AccordionTrigger>Potency: Medium (The Active Want)</AccordionTrigger>
          <AccordionContent>
            <p>With medium potency, the character actively pursues the goal. They plan, argue, or bargain to move closer to it.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="potency-high">
          <AccordionTrigger>Potency: High (The Consuming Need)</AccordionTrigger>
          <AccordionContent>
            <p>High potency desire overrides caution. The character is willing to risk relationships or safety because nothing matters more.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="manipulate-potency">
          <AccordionTrigger>How to Manipulate Potency Levels (Writer's Toolbox)</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-4">
              <li>Raise the stakes to intensify a mild want.</li>
              <li>Introduce consequences to cool down an obsession.</li>
              <li>Use inner conflict to reveal hidden longing.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
