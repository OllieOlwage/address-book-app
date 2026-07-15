# Training Cheat Sheet: AI-Powered Development with Claude Code

A quick-reference guide for trainees. Each step is a prompt you type into Claude Code — it does the work, you review the result.

---

## Before You Start

Make sure you have everything installed (see [SETUP-PREREQUISITES.md](SETUP-PREREQUISITES.md)), including:
- Node.js, npm, Git, GitHub CLI
- Claude Code CLI
- The **dev-its-workflow** skill (unzip `dev-its-workflow.zip` into `~/.claude/skills/`)

Open a terminal and run:

```bash
mkdir my-address-book && cd my-address-book
git init
claude
```

You're now inside Claude Code. Everything below is typed into the Claude Code prompt.

---

## Phase 1: Project Setup

### Create the GitHub repo

```
Create a new GitHub repo called "address-book-app" with a Node .gitignore and clone it locally
```

### Create the issue (your "ticket")

```
Create a GitHub issue titled "Build Address Book App" with this description:

Build a full-stack address book application.
- Backend: Node.js + Express + TypeScript + SQLite
- Frontend: Angular 19 with Angular Material
- CRUD operations for contacts (first name, last name, cell number, email)
- Search/filter functionality
- Responsive design (table on desktop, cards on mobile)
- Full test coverage
```

---

## Phase 2: Build the App (The Dev-ITS Workflow)

The **dev-its-workflow** is a Claude Code skill that automates the full pipeline. Instead of manually prompting each step, it takes your ticket through 10 stages with 3 gates where you approve.

### Trigger the workflow

```
/dev-its-workflow
```

Then paste the issue URL when asked (e.g. `https://github.com/YourName/address-book-app/issues/1`).

### What happens next (you just approve at 3 gates):

| Stage | What the AI does | What you do |
|-------|-----------------|-------------|
| Pre-flight | Checks tools are installed | Nothing (auto) |
| Complexity | Estimates ticket size | Nothing (auto) |
| Spec | Writes a detailed specification | **Gate A: Read and approve** |
| Plan | Writes implementation plan + rollback | **Gate B: Read and approve** |
| Develop | Writes all the code | Wait |
| Test | Runs unit + integration tests | Wait |
| Review | Adversarial reviewer attacks the code | Wait |
| PR | Opens a pull request | **Gate C: Review and approve** |
| Deploy | Merges + closes the issue | Nothing (auto) |
| Docs | Updates documentation | Nothing (auto) |

> At each gate, say **"approved"** to continue, or tell it what to change.

### Alternative: Build without the workflow (manual prompts)

If you prefer to drive each step yourself instead of using the workflow:

```
Pick up issue #1 and build the full application. Create the backend with Express + TypeScript + SQLite, the frontend with Angular 19 + Material, full CRUD, search, validation, tests, and responsive design. Work on a feature branch and open a PR when done.
```

> Sit back and watch. Review what it produces. Ask questions if anything is unclear.

---

## Phase 3: Review and Merge

### Check the PR looks good

```
Show me a summary of what's in the PR
```

### Merge it

```
Merge the PR and pull main locally
```

---

## Phase 4: Run the App

### Start both servers

```
Start the backend and frontend dev servers
```

> Open http://localhost:4200 in your browser. Add a contact, edit it, delete it. Try the search.

---

## Phase 5: Apply the Design System

### Apply Adapt IT branding (one prompt)

```
Apply the Adapt IT Design System from C:\downloads\Adapt IT Design System.zip to the frontend. Use the Myriad Pro fonts, the Adapt IT colour palette, the stacked white logo in the toolbar, and style the contact cards with the design tokens. Commit to a feature branch and open a PR.
```

> Refresh your browser to see the branded UI.

### Merge the design PR

```
Merge the PR and pull main
```

---

## Phase 6: Explore Further (Optional)

### Ask Claude to explain what it built

```
Walk me through the backend architecture — what does each file do?
```

### Add a new feature

```
Add a "favourite" toggle to contacts — a star icon that marks a contact as favourite and sorts favourites to the top
```

### Run the tests

```
Run all backend tests and show me the results
```

### Generate documentation

```
Create an end-user manual for this application
```

---

## Useful Commands During the Session

| What you want | What to type |
|---------------|-------------|
| See what's running | `What servers are running?` |
| Stop everything | `Shutdown all servers` |
| Check for errors | `Are there any build errors?` |
| Undo the last change | `Revert the last commit` |
| See the git log | `Show me the recent commit history` |
| Open a file | `Show me backend/src/routes/contacts.ts` |
| Fix a bug | `The search isn't working — can you investigate?` |

---

## Tips for Trainees

1. **You are the driver.** Claude proposes — you approve or redirect.
2. **Be specific when you want something specific.** Vague prompts get creative answers.
3. **Review before merging.** Always look at what was generated before accepting.
4. **Ask "why".** If you don't understand something, ask Claude to explain it.
5. **It's okay to say no.** If the output isn't what you want, say "no, try again with..." and redirect.
6. **One thing at a time.** Big prompts work, but smaller steps are easier to review.

---

## Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 4200 already in use | `Kill whatever is on port 4200 and restart the frontend` |
| "command not found" errors | Close and reopen your terminal |
| Build errors after design system | `Fix the build errors` (Claude will figure it out) |
| Want to start over | `Delete everything and start fresh from the GitHub issue` |

---

*This cheat sheet is your co-pilot for the session. The hands-on guide ([HOW-TO-APPLY-DESIGN-SYSTEM.md](HOW-TO-APPLY-DESIGN-SYSTEM.md)) explains what happens under the hood if you want to dig deeper afterwards.*
