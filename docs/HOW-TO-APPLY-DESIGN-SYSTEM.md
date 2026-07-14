# How to Apply the Adapt IT Design System to Your Project

A step-by-step guide for anyone on the team. Follow these instructions like a recipe.

---

## What You Need Before You Start

1. The **Adapt IT Design System** zip file (`Adapt IT Design System.zip`)
2. Your project already working (like the address-book-app)
3. A code editor (VS Code recommended)
4. A terminal / command prompt

---

## Step 1: Create a Ticket (Issue) on GitHub

> Think of a ticket like raising your hand to say "I'm going to change the look of this app."

1. Go to your repo on GitHub (e.g. `https://github.com/YourOrg/your-project`)
2. Click the **"Issues"** tab
3. Click **"New issue"**
4. Fill in:
   - **Title:** `Redesign UI to match Adapt IT Design System`
   - **Description:**
     ```
     ## Description
     Update the application's look and feel to match the Adapt IT Brand Identity Guidelines.

     ## Changes needed
     - Replace fonts with Myriad Pro
     - Replace colours with Adapt IT palette (Blue #00A1ED, Dark Blue #003242, Cool Grey #4C5056)
     - Update buttons, inputs, and cards to match the design system components
     - Add the Adapt IT logo to the header
     - Ensure responsive design is maintained
     - No emojis anywhere in the UI

     ## Acceptance Criteria
     - [ ] App uses Myriad Pro font (with Calibri/Open Sans fallback)
     - [ ] Colours match the Adapt IT palette
     - [ ] Buttons follow the design system (primary = blue, rounded 4px corners)
     - [ ] Form inputs match the design system (outline style, blue focus ring)
     - [ ] Cards have 8px radius, subtle shadow, grey border
     - [ ] Header has Adapt IT logo and dark blue background
     - [ ] No emojis in the UI
     ```
5. Click **"Submit new issue"**

---

## Step 2: Create a Feature Branch

> Think of a branch like making a copy of your colouring book page, so you can colour it without messing up the original.

Open your terminal, navigate to your project, and type:

```bash
git checkout main
git pull
git checkout -b feature/adapt-it-design-system
```

---

## Step 3: Unzip the Design System into Your Project

> You're unpacking the box of crayons.

1. Find the zip file: `Adapt IT Design System.zip`
2. Unzip it into a folder called `design-system` inside your project root:

```bash
# Windows (PowerShell)
Expand-Archive -Path "$HOME\Downloads\Adapt IT Design System.zip" -DestinationPath .\design-system

# Mac/Linux
unzip ~/Downloads/"Adapt IT Design System.zip" -d ./design-system
```

Your project should now look like:
```
your-project/
├── design-system/          <-- NEW (the unpacked zip)
│   ├── README.md
│   ├── colors_and_type.css
│   ├── fonts/
│   ├── assets/
│   └── preview/
├── frontend/
├── backend/
└── ...
```

---

## Step 4: Copy the Fonts into Your Frontend

> These are the special letter shapes that make Adapt IT text look like Adapt IT.

```bash
# Create a fonts folder in your Angular project
mkdir -p frontend/src/assets/fonts

# Copy the font files
cp design-system/fonts/*.otf frontend/src/assets/fonts/
```

---

## Step 5: Copy the Logo into Your Frontend

> This is the company logo that goes in the top bar.

```bash
# Create a logos folder
mkdir -p frontend/src/assets/logos

# Copy the logos you need
cp design-system/assets/logos/adapt-it-logo-horizontal-color.png frontend/src/assets/logos/
cp design-system/assets/logos/adapt-it-logo-stacked-white.png frontend/src/assets/logos/
cp design-system/assets/logos/adapt-it-icon.png frontend/src/assets/logos/
```

---

## Step 6: Create the Design Tokens CSS File

> Design tokens are like a list that says "blue means THIS blue, big text means THIS size."

Create a new file at `frontend/src/styles/adapt-it-tokens.scss` with these contents.
You can copy from `design-system/colors_and_type.css` but wrap it in SCSS format:

```scss
// ============================================================
// Adapt IT Design Tokens
// From: Adapt IT Brand Identity Guidelines V2024.2
// ============================================================

// -- Fonts --
@font-face {
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('/assets/fonts/MyriadPro-Light.otf') format('opentype');
}
@font-face {
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/assets/fonts/MyriadPro-Regular.otf') format('opentype');
}
@font-face {
  font-family: 'Myriad Pro';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/assets/fonts/MyriadPro-It.otf') format('opentype');
}
@font-face {
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/assets/fonts/MyriadPro-Bold.otf') format('opentype');
}
@font-face {
  font-family: 'Myriad Pro';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('/assets/fonts/MyriadPro-Black.otf') format('opentype');
}

// -- CSS Custom Properties (Design Tokens) --
:root {
  // PRIMARY PALETTE
  --ai-blue:       #00A1ED;
  --ai-red:        #E82727;
  --ai-white:      #FFFFFF;
  --ai-cool-grey:  #4C5056;
  --ai-cool-grey-40: #C9CACD;
  --ai-cool-grey-20: #ECECED;
  --ai-cool-grey-10: #F4F5F5;

  // SECONDARY PALETTE
  --ai-navy:       #002971;
  --ai-dark-blue:  #003242;
  --ai-mid-blue:   #006690;
  --ai-teal:       #009FB0;
  --ai-mint:       #65C7DE;

  // SEMANTIC
  --fg-1:          var(--ai-dark-blue);
  --fg-2:          var(--ai-cool-grey);
  --fg-3:          #A2A5AA;
  --fg-link:       var(--ai-blue);
  --bg-1:          var(--ai-white);
  --bg-2:          var(--ai-cool-grey-10);
  --border:        var(--ai-cool-grey-20);
  --border-strong: var(--ai-cool-grey-40);

  // TYPOGRAPHY
  --font-sans: 'Myriad Pro', 'Calibri', 'Open Sans', 'Segoe UI', system-ui, sans-serif;

  // SPACING (8pt grid)
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;

  // RADIUS
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  // SHADOWS
  --shadow-1: 0 1px 2px rgba(0, 50, 66, 0.06);
  --shadow-2: 0 2px 8px rgba(0, 50, 66, 0.08), 0 1px 2px rgba(0, 50, 66, 0.04);
  --shadow-3: 0 8px 24px rgba(0, 50, 66, 0.10), 0 2px 6px rgba(0, 50, 66, 0.05);
  --shadow-focus: 0 0 0 3px rgba(0, 161, 237, 0.30);
}
```

---

## Step 7: Update Your Global Styles

> This is like saying "from now on, the WHOLE app uses these new crayons."

Open `frontend/src/styles.scss` and replace it with:

```scss
@use 'styles/adapt-it-tokens';

html, body {
  height: 100%;
  margin: 0;
  font-family: var(--font-sans);
  color: var(--fg-2);
  background: var(--bg-1);
  -webkit-font-smoothing: antialiased;
}

// Headings
h1, h2, h3, h4, h5 {
  color: var(--fg-1);
  letter-spacing: -0.02em;
  line-height: 1.0;
  margin: 0 0 var(--sp-4);
}

// Links
a {
  color: var(--fg-link);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
```

---

## Step 8: Update the Angular Material Theme

> Angular Material has its own colour system. We need to tell it: "use Adapt IT's colours instead."

**Option A: Remove the prebuilt theme**

In `angular.json`, find the `styles` array and remove the Material prebuilt theme line:
```json
// REMOVE this line:
"@angular/material/prebuilt-themes/azure-blue.css"
```

Then in `styles.scss`, add a custom Material theme:
```scss
@use '@angular/material' as mat;

// Tell Material to use Adapt IT colours
$adapt-it-theme: mat.define-theme((
  color: (
    primary: mat.$azure-palette,  // closest built-in to #00A1ED
  )
));

html {
  @include mat.all-component-themes($adapt-it-theme);
}
```

**Option B: Override with CSS (simpler, less perfect)**

Keep the prebuilt theme but override the colours in `styles.scss`:
```scss
// Override Material primary colour
.mat-mdc-raised-button.mat-primary {
  background-color: var(--ai-blue) !important;
}
.mat-toolbar.mat-primary {
  background-color: var(--ai-dark-blue) !important;
}
.mdc-text-field--focused .mdc-floating-label {
  color: var(--ai-blue) !important;
}
```

---

## Step 9: Update the Header (App Component)

> Change the top bar to look like Adapt IT.

Open `frontend/src/app/app.component.html` and change it to:

```html
<mat-toolbar class="ai-toolbar">
  <img src="assets/logos/adapt-it-logo-stacked-white.png" alt="Adapt IT" height="32">
  <span class="toolbar-title">Address Book</span>
</mat-toolbar>
<main class="content">
  <router-outlet />
</main>
```

Open `frontend/src/app/app.component.scss` and change it to:

```scss
.ai-toolbar {
  background-color: var(--ai-dark-blue);
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
}

.toolbar-title {
  font-weight: 700;
  font-size: 18px;
}

.content {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 16px;
}
```

---

## Step 10: Update Buttons to Match the Design System

> The design system says buttons should be: 4px rounded corners, bold text, specific colours.

In your component SCSS files (or a shared `styles/_buttons.scss`), add:

```scss
// Primary button override
.mat-mdc-raised-button.mat-primary {
  background-color: var(--ai-blue);
  border-radius: var(--radius-sm);
  font-weight: 700;
  letter-spacing: -0.01em;
  text-transform: none;  // Sentence case, NOT uppercase

  &:hover {
    filter: brightness(0.93);
  }
}

// Warn/Delete button
.mat-mdc-icon-button.mat-warn {
  color: var(--ai-red);
}
```

---

## Step 11: Update Form Inputs

> Inputs get: a grey border, blue glow when focused, 4px corners.

Add to `styles.scss`:

```scss
.mat-mdc-form-field {
  .mdc-text-field {
    border-radius: var(--radius-sm) !important;
  }

  .mdc-text-field--focused {
    .mdc-notched-outline__leading,
    .mdc-notched-outline__notch,
    .mdc-notched-outline__trailing {
      border-color: var(--ai-blue) !important;
    }
  }
}
```

---

## Step 12: Update Cards (for Mobile View)

> Cards should be: white background, 8px corners, subtle shadow, thin grey border.

Open `frontend/src/app/components/contact-list/contact-list.component.scss` and update the `.contact-card` class:

```scss
.contact-card {
  background: var(--bg-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-1);
  padding: var(--sp-4);
  transition: box-shadow 0.2s cubic-bezier(.2,.7,.2,1), transform 0.2s;

  &:hover {
    box-shadow: var(--shadow-2);
    transform: translateY(-1px);
  }

  .card-name {
    font-weight: 700;
    font-size: 16px;
    color: var(--fg-1);
    margin-bottom: 8px;
  }

  .card-detail {
    color: var(--fg-2);
    font-size: 14px;
    margin-bottom: 4px;
  }
}
```

---

## Step 13: Remove All Emojis from the UI

> The Adapt IT brand says: NEVER use emojis. Use icons instead.

Search your code for any emojis and replace them with text or Material icons:
```bash
# Search for emojis (this finds common ones)
grep -rn "[\x{1F300}-\x{1F9FF}]" frontend/src/ || echo "No emojis found"
```

If you find any, replace with `<mat-icon>` elements.

---

## Step 14: Test It

> Check your work looks right.

```bash
# Start the backend
cd backend && npm run dev

# In another terminal, start the frontend
cd frontend && ng serve
```

Open http://localhost:4200 and check:
- [ ] Header is dark blue with white logo
- [ ] Font looks different (Myriad Pro / Calibri)
- [ ] Buttons are blue with rounded corners
- [ ] Form inputs get a blue glow when you click in them
- [ ] Cards have subtle shadows
- [ ] No emojis anywhere
- [ ] Still works on mobile (resize your browser)

---

## Step 15: Commit and Create a Pull Request

> Save your work and ask someone to check it.

```bash
git add .
git commit -m "feat: apply Adapt IT Design System to UI

- Replace fonts with Myriad Pro (Calibri fallback)
- Update colour palette to Adapt IT brand tokens
- Restyle header, buttons, inputs, and cards
- Add Adapt IT logo to toolbar
- Ensure responsive design maintained

Co-Authored-By: Your Name <your.email@adaptit.com>"

git push -u origin feature/adapt-it-design-system
```

Then create a PR on GitHub (or use `gh pr create`).

---

## Step 16: Clean Up

> Once the PR is merged, you can delete the design-system source folder if you don't want it in the repo.

Add to `.gitignore`:
```
# Design system source (assets already copied to frontend)
/design-system/
```

Or keep it for reference. Up to you.

---

## Quick Reference: Key Files to Change

| File | What Changes |
|------|-------------|
| `frontend/src/styles.scss` | Global fonts, colours, reset |
| `frontend/src/styles/adapt-it-tokens.scss` | All design tokens (NEW file) |
| `frontend/src/app/app.component.html` | Header with logo |
| `frontend/src/app/app.component.scss` | Header styling |
| `frontend/src/assets/fonts/` | Font files (NEW) |
| `frontend/src/assets/logos/` | Logo files (NEW) |
| `angular.json` | Remove old theme (optional) |
| Component `.scss` files | Button/card/form overrides |

---

## Rules to Always Follow (from the Brand Guide)

1. Never use emojis
2. Never mix warm and cool photography in one screen
3. Buttons are always **sentence case** ("Contact us" not "CONTACT US")
4. The wordmark is always `adapt IT` (lowercase adapt, uppercase IT)
5. Gradients are always **radial**, never linear
6. Tertiary colours (Honey, Fuchsia, etc.) are never used as solid backgrounds
7. Corners: 4px for buttons/inputs, 8px for cards, 14px for modals
8. Shadows are soft and subtle (never harsh black)
