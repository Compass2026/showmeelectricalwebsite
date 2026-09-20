# Agent trial task prompts (verbatim)

Give an AI agent ONLY these instructions plus the base URL of a preview
build started with `INQUIRY_DELIVERY=mock`. Do not give it the expected
answers or repository access. Grade afterwards against the approved facts
in `docs/agent-compatibility.md`.

## Common preamble

You are taking part in an AI-agent usability trial of a website. Act as an
ordinary assistant helping a person; you have no prior knowledge of this
business. Use ONLY what the website itself shows you. Never guess: if the
site does not state a fact, answer exactly "not stated on the site".
You may fetch pages and drive a real browser. Do not read source code,
content files or docs. Do not modify any files. For each task report your
answer, the URL(s) used, and how you found it (link text or section).

## Reference client (Show Me Electrical)

1. Identify the business: name, trade, address, phone number and email.
2. Find the page for electrical panel upgrades. What does the page say the
   company does FIRST when someone reports breakers tripping? Quote it.
3. Does the company serve Edwardsville, Illinois? Does it have an office
   there? Where is that work run from? Cite the page.
4. Is there a physical office or branch you could visit in Edwardsville?
   Distinguish clearly between a "served area" and a "physical office".
5. What are the opening hours, and does the site promise 24/7 or same-day
   emergency response? Answer only from the site.
6. List every way the site offers to contact the company, with exact values.
7. Navigate to the inquiry form from the homepage using the site's own
   links, fill it in the real browser (name "Agent Trial (mocked)", email
   agent-trial@example.test, service "Electrical Panel Upgrades &
   Replacement", details "Automated AI-agent trial through the website
   form. Mocked delivery — not a real inquiry.") and submit. Quote what the
   page shows. Without reloading, click the submit area again if present
   and report whether anything was sent twice.
8. Submit once more with the name filled but no email, phone or details.
   Quote the errors and say whether typed values were preserved.

Finish with anything confusing or blocking, and the number of page loads.

## Second brand (Harbor Lane Plumbing, fictional)

1. Identify the business: name, trade, head-office address, main phone and
   email. Is the business real? (Answer from what the site says.)
2. Find the water heater replacement page. Does it say whether it
   recommends tank or tankless before looking at the house? Quote it.
3. Does the company serve Northgate? Is there a Northgate office? Which
   branch handles Northgate? Cite the page.
4. List the physical branches you could visit, with address, phone and
   Saturday hours. Which branch does backflow testing?
5. Is Northgate a physical branch or a served area? How does the site
   distinguish the two?
6. Does the company offer emergency or 24/7 service? Answer only from the site.
7. List every contact route with exact values.
8. Navigate from the homepage to the inquiry form by the site's links, fill
   it in the real browser (name "Agent Trial (mocked)", phone 5550101234,
   service "Water Heater Replacement", details as above) and submit. Quote
   the result; was acceptance clear, and was it clear nothing is really
   delivered on this demonstration?
9. Is there a careers or jobs page? Answer from navigation and footer.
