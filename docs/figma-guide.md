# Figma tokens: step-by-step guide

Goal: the design tokens (colours, spacing, radius, typography) live in a real Figma
file, and the code is built from Figma's export through Style Dictionary.

Time: about 20–30 minutes. Cost: free. You need: a web browser (Chrome or Edge).

The file you will import already exists:

```
C:\Users\Rachit\Pictures\foundation-platform\packages\tokens\figma\tokens-studio-import.json
```

Menu names below match Figma and the Tokens Studio plugin as of late 2026. If a
label on your screen is slightly different, look for the closest match. If you are
stuck, take a screenshot and ask.

---

## Part 1 — Create a Figma account (skip if you have one)

1. Open **https://www.figma.com** in Chrome or Edge.
2. Click **Get started for free** (top-right).
3. Choose **Continue with Google** (easiest) or enter an email and password.
4. If asked what you will use Figma for, pick anything (for example _Student_ or
   _Design_). If asked to choose a plan, pick the **free / Starter** plan.
5. If it offers to download the desktop app, you can skip it. The browser works fine.

You now see the **Figma home screen** (a list of files, probably empty).

## Part 2 — Create the design file

1. On the home screen, click **+ Create** (or **New design file**) at the top-right
   and choose **Design**. A blank canvas opens in a new tab.
2. At the very top-centre of the screen you will see **Untitled**. Click it, type
   **Foundation UI — Design System**, and press **Enter**.

Figma saves automatically. There is no Save button.

## Part 3 — Install the Tokens Studio plugin

1. In the file, open the menu with **Ctrl + /** (or click the Figma logo at the
   top-left, then **Plugins**, then **Manage plugins / Find more plugins**).
2. Type **Tokens Studio for Figma** in the search box.
3. Choose the result named **Tokens Studio for Figma** (it has a blue/purple icon;
   the publisher is _Tokens Studio_). Click **Run**. If it says **Save** or
   **Install** first, click that, then **Run**.
4. A plugin window opens. The first time, it shows a welcome screen:
   - If it asks you to **log in / create an account**, you can create a free one,
     or look for a **Skip / Continue without account** link.
   - When asked how to start, choose **New empty file** (or **Get started**).
     **Do not** choose GitHub, GitLab, JSONBin or any other "sync" option.
     Tokens are stored inside the Figma file itself (this is called **Local document**).

You now see the plugin with a **Tokens** tab at the top, empty.

> Tip: you can drag the plugin window by its title bar and resize it from the
> bottom-right corner. Make it tall so you can see everything.

## Part 4 — Import the tokens

1. At the **bottom** of the plugin window, find the **Tools** button (it may be an
   icon with a small arrow). Click it.
2. Choose **Load from file/folder or preset**.
3. In the box that opens, choose the **File** option, then click **Choose file**.
4. In the Windows file picker, go to:
   `C:\Users\Rachit\Pictures\foundation-platform\packages\tokens\figma\`
   and select **tokens-studio-import.json**. Click **Open**.
5. If it asks whether to **replace / overwrite** existing tokens, click **Yes**.

Check it worked:

- On the left side of the plugin you now see three **token sets**:
  **primitives**, **light** and **dark**.
- Click **primitives**. You should see groups: **palette** (4 colours), **space**
  (8 sizes), **radius** (3), **font** (family, sizes, weight).
- Click **light**. You should see about 21 colours, for example **color.action**.
  Some of them show a value like `{palette.teal}`. That is a _reference_ to a
  primitive, which is correct.

## Part 5 — Turn the tokens into real Figma variables

This makes the tokens show up as native Figma **Variables**, which is what
reviewers will look for.

1. Next to each set name on the left is a **checkbox**. Tick **all three**:
   primitives, light and dark.
2. At the bottom of the plugin, click **Styles & Variables**, then
   **Export Styles & Variables** (sometimes worded **Create variables**).
3. A dialog opens with two tabs: **Themes** and **Sets**.

   - Click the **Sets** tab (it works on the free plan).
   - Make sure **primitives**, **light** and **dark** are all ticked.
   - Leave the options as they are (variables on; styles optional).
   - Click **Confirm** / **Export**.

   _If the **Themes** tab is available for you (for example on a Pro trial), you can
   use it instead. Tick **Core**, **Light** and **Dark**. That gives you one
   collection with Light and Dark **modes**, which is nicer, but it is not required._

4. Wait a few seconds until it says it is done.

Check it worked:

1. Close or move the plugin window.
2. Click on an empty part of the grey canvas (so nothing is selected).
3. In the **right-hand panel** find **Variables** (or **Local variables**). Click the
   icon or **Open variables**.
4. A window opens listing **collections**: **primitives**, **light**, **dark**
   (or **Core** and **Mode** if you used Themes). Click each one. You should see
   the colours with swatches and the spacing numbers. In Figma, spacing shows in
   pixels (1rem = 16px), which is expected.

## Part 6 — Make a visible token sheet (recommended for reviewers)

This makes the file look like a real design-system page and gives you a screenshot.

1. Press **F** (Frame tool). On the right panel choose **Desktop** to create a
   big white frame. Double-click its name on the left (**Desktop**) and rename it
   **Tokens**.
2. Press **R** (Rectangle tool) and drag a small square inside the frame.
3. With the square selected, look at **Fill** in the right panel. Click the small
   **four-dots / hexagon icon** next to the fill colour (_Apply variable_), and pick
   **light → color → action**.
4. Press **T** (Text tool), click under the square and type **color.action**.
5. Select the square and its label (**Shift-click** both), press **Ctrl + D** to
   duplicate, drag the copy to the right, and change its fill variable and label.
   Repeat for a few colours: background, surface, text, danger, success, warning, focus.
6. Optional: add a second row using the **dark** colours.
7. Press **Shift + 2** to zoom to the selection, then take a screenshot
   (**Windows + Shift + S**). Keep it for your submission.

## Part 7 — Make one real change in Figma (proves the pipeline works)

The assignment's provenance note asks you to show one change made in Figma reaching
the code. A safe change is the corner radius, because it does not affect colour contrast.

1. Open the plugin again (**Ctrl + /** → type **Tokens Studio** → **Run**).
2. Click the **primitives** set → open **radius**.
3. **Right-click** the token **md** → **Edit token**.
4. Change the value from `0.625rem` to `0.75rem`. Click **Update** / **Save**.

(Cards and other surfaces that use `radius.md` become a little rounder in the app after the import.)

## Part 8 — Export the tokens from Figma

1. In the plugin, click **Tools** (bottom) → **Export to file/folder**.
2. Choose **Single file**.
3. Make sure **Include all token sets** is ticked (and **Include parent key** too, if
   that option is shown).
4. Click **Export**. Your browser downloads a file, usually called **tokens.json**,
   into your **Downloads** folder.

## Part 9 — Put the export in the project

1. Press **Windows + E** to open File Explorer and go to **Downloads**.
2. Find **tokens.json** (if you exported more than once it may be
   **tokens (1).json**, so take the newest one). Right-click it → **Copy**.
3. Go to `C:\Users\Rachit\Pictures\foundation-platform\packages\tokens\figma\`
   and press **Ctrl + V**.
4. Make sure the file is named exactly **tokens.json** (right-click → **Rename** if needed).

## Part 10 — Share the Figma link

1. In Figma, click the blue **Share** button (top-right).
2. Set access to **Anyone with the link → can view**.
3. Click **Copy link**.
4. Send that link to Claude together with the word **done**.

---

## What happens next (Claude does this)

```powershell
npm run tokens:import     # reads packages/tokens/figma/tokens.json, validates, updates source/
npm run check             # rebuilds CSS through Style Dictionary and runs every test
npm run test:browser      # confirms both themes still pass contrast and accessibility
```

The import prints every value that changed (for example `primitives: radius.md
0.625rem -> 0.75rem`). Then the provenance notes in `packages/tokens/source/README.md`
and the docs are updated with your Figma link, the exporter and the date.

## Troubleshooting

| Problem                                         | What to do                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| Can't find **Tools**                            | Make the plugin window wider and taller; it is in the bottom bar.          |
| **Load from file** is greyed out                | Storage must be **Local document**: Settings tab → Token storage → Local.  |
| Only one set appears after loading              | You picked the wrong file. Use `tokens-studio-import.json`.                |
| Variables export fails, mentioning **modes**    | Use the **Sets** tab, not Themes (the free plan limits modes).             |
| A colour shows a red warning in the plugin      | A reference is broken; undo your edit (Ctrl + Z) or re-import the file.    |
| The downloaded file is called `tokens (2).json` | That's fine. Rename it to `tokens.json` when you copy it into the project. |
