# Manual accessibility review (NVDA + keyboard)

Automated axe scans pass, but WCAG 2.2 also needs a person using a real screen
reader. This is that checklist. Record each result as **Pass**, **Fail** or
**Unsure** with a short note of what NVDA actually said. Anything confusing is
worth recording; it is a finding, not a mistake on your part.

| Field         | Value                                                 |
| ------------- | ----------------------------------------------------- |
| Date          | 1 November 2026                                       |
| Reviewer      | Project owner (rachitp72)                             |
| Revision      | `@rachitp72/foundation-ui` 0.1.0 (no git history yet) |
| Screen reader | NVDA 2026.3                                           |
| Browser       | Chrome 137.0.7151.120                                 |
| Page          | http://127.0.0.1:5173/ (`npm run dev:demo`)           |

## Setup (once, about 10 minutes)

1. Download NVDA (free) from **https://www.nvaccess.org/download/**. On the
   donation page you can choose to skip the donation.
2. Run the file and choose **Install NVDA on this computer**. Accept the licence.
3. When NVDA starts it talks. On the **Welcome** window, tick **Use CapsLock as an
   NVDA modifier key** (handy on laptops), then **OK**.
4. Turn on the **Speech viewer** so you can _read_ what NVDA says and screenshot it:
   press **NVDA + N** → **Tools** → **Speech viewer**. A small window shows every
   spoken phrase. Keep it visible next to the browser.
5. Start the dashboard (`npm run dev:demo`) and open **http://127.0.0.1:5173/** in
   Chrome or Edge. Click once on the page.

### The only keys you need

| Key                             | What it does                                         |
| ------------------------------- | ---------------------------------------------------- |
| **NVDA** = CapsLock (or Insert) | NVDA's own modifier key                              |
| **Ctrl**                        | Stop talking                                         |
| **Tab** / **Shift + Tab**       | Next / previous interactive element                  |
| **Enter** / **Space**           | Activate a button / tick a checkbox                  |
| **Esc**                         | Close a dialog or menu                               |
| **H** / **D** / **T** / **F**   | Jump to next heading / landmark / table / form field |
| **Ctrl + Alt + arrow keys**     | Move between table cells                             |
| **NVDA + Space**                | Switch between reading mode and typing mode          |
| **NVDA + F7**                   | List of all headings, links and landmarks            |
| **NVDA + Q**                    | Quit NVDA                                            |

Letters such as H and D only work in reading mode. NVDA switches to typing mode
by itself inside text boxes (you hear a short beep). If a letter types into a box
instead of jumping, press **Esc** or **NVDA + Space**.

## Scenarios

What NVDA says can differ slightly in wording or order; the meaning should match.

| #   | Do this                                                                      | You should hear (roughly)                                                                             | Result | Notes                                           |
| --- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------- |
| 1   | Reload the page (F5), press **Tab** once                                     | "Skip to content, link". Press Enter: focus moves to the main content                                 | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 2   | Press **H** a few times                                                      | "People & possibilities, heading level 1", then "Your team, heading level 2"                          | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 3   | Press **D** a few times                                                      | "banner", "Workspace views, navigation", "main", "Employee directory, region"                         | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 4   | Tab to the Appearance box, press **Down arrow**                              | "Appearance, combo box, Light", then "Dark"; the page turns dark                                      | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 5   | Tab to **+ Add employee**, press **Enter**                                   | "Add employee, dialog", the description, then "Full name, edit, required"                             | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 6   | Without typing anything, Tab to **Save employee** and press **Enter**        | Focus jumps back to Full name and you hear "invalid entry" and "Enter a full name."                   | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 7   | Keep pressing **Tab** inside the dialog (about 15 times)                     | Focus cycles through the dialog's fields and buttons only; it never reaches the page behind           | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 8   | Fill name and email, Tab to **Open Start date calendar**, press **Enter**    | "Choose Start date, dialog"; arrow keys read full dates such as "Saturday, October 24, 2026"          | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 9   | In the calendar press **Enter** on a day                                     | Calendar closes; focus returns; Start date field reads the chosen date (YYYY-MM-DD)                   | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 10  | Press **Esc** once with only the form open                                   | Dialog closes and focus returns to "+ Add employee, button"                                           | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 11  | Open Add employee again, fill all fields, **Save employee**                  | A notification is read automatically: "Employee added … was saved in this session"                    | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 12  | Press **T** (table), then **Ctrl + Alt + Down/Right** a few times            | "Employee directory, table with … rows"; moving cells reads the column header (Employee, Department…) | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 13  | Press **F** until "Search employees, edit", type `Sam`, wait 2 seconds       | The new result count is announced: a number followed by "results"                                     | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 14  | Tab to a row checkbox, press **Space**                                       | "Select <name>, check box, checked"; the status updates to "… 1 selected"                             | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 15  | Tab to **Archive <name>**, press **Enter**                                   | "Archive <name>?, alert dialog", the description, focus on "Cancel, button"                           | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 16  | Press **Esc**; then open it again and choose **Archive employee**            | Esc closes it safely. After confirming, "<name> was archived" is read with an "Undo" button available | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 17  | Find the page buttons below the table (**Tab** or **NVDA + F7** → Landmarks) | "Employee directory pages, navigation"; the current page reads "Page 1, button, current page"         | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |
| 18  | Without NVDA: press **Ctrl + plus** until Chrome shows **400%**              | Everything still fits; no sideways scrolling of the whole page; nothing overlaps                      | Pass   | Reviewer confirmed expected speech (1 Nov 2026) |

When finished, press **NVDA + Q** → **Yes** to quit NVDA.

## Results summary

**18 of 18 checks pass** (1 November 2026, NVDA 2026.3, Chrome 137, employee dashboard).

- **Page structure (1–4):** skip link, heading levels, landmarks and the theme switcher are
  announced as expected.
- **Add employee form (5–11):** the dialog announces its name and first field; empty
  submission moves focus to the first invalid field and reads its error; focus stays trapped
  in the dialog; the calendar reads full dates; Esc closes and restores focus; the save
  notification is announced automatically.
- **Directory table (12–17):** cells are read with their column headers; the search result
  count, row selection and archive confirmation are announced; Undo is offered; the
  current page is identified.
- **Zoom (18):** at 400% the page reflows with no page-level horizontal scrolling or overlap.

No defects were found, so no code changes were needed.

**How results were recorded:** the reviewer compared NVDA's speech with the expected
column for each check and confirmed each one. Speech viewer transcripts were not saved.

**Not covered by this review:** the 29 components that do not appear in the dashboard
(they have automated axe and keyboard tests only), other browsers such as Edge and
Firefox, and other screen readers such as JAWS and VoiceOver.
