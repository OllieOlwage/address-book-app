# Setup Guide: Installing the Tools You Need

Before you can build apps with Claude Code, you need to install a few things on your computer.
Think of these as the toolbox you need before you can start building.

---

## What You Need to Install

| Tool | What It Does | Think of It As... |
|------|-------------|-------------------|
| **Node.js** | Runs JavaScript on your computer (not just in a browser) | The engine that powers your app |
| **npm** | Installs code libraries other people wrote (comes with Node.js) | An app store for code |
| **Git** | Tracks changes to your code (like "undo history" on steroids) | A time machine for your project |
| **GitHub CLI (gh)** | Lets you talk to GitHub from your terminal | A shortcut to GitHub without opening a browser |
| **Claude Code CLI** | The AI assistant that helps you write code | Your AI pair programmer |
| **Dev-ITS Workflow** | A Claude Code skill that automates the full dev pipeline | Your AI project manager + developer in one |

---

## Step 1: Install Node.js (this also installs npm)

> Node.js lets your computer run JavaScript. npm is the package manager that comes bundled with it.

### Windows

1. Go to https://nodejs.org/
2. Click the big green button that says **"LTS"** (Long Term Support) — this is the stable version
3. Run the downloaded `.msi` file
4. Click **Next** through the installer (default options are fine)
5. When it asks about "Tools for Native Modules" — tick the checkbox (this installs build tools you'll need)
6. Click **Install**, then **Finish**

### Mac

Option A — Download from website:
1. Go to https://nodejs.org/
2. Click the **LTS** button
3. Run the downloaded `.pkg` file
4. Follow the installer steps

Option B — Using Homebrew (if you have it):
```bash
brew install node
```

### Verify It Worked

Open a **new** terminal (Command Prompt, PowerShell, or Terminal on Mac) and type:

```bash
node --version
```
You should see something like `v20.x.x` or `v22.x.x`

```bash
npm --version
```
You should see something like `10.x.x` or `11.x.x`

If you see "command not found" — close your terminal, open a new one, and try again. If it still doesn't work, restart your computer.

---

## Step 2: Install Git

> Git tracks every change you make to your code. It's how teams work on the same project without overwriting each other's work.

### Windows

1. Go to https://git-scm.com/download/win
2. The download should start automatically
3. Run the installer
4. **Important settings during install:**
   - "Adjusting your PATH" → Choose **"Git from the command line and also from 3rd-party software"**
   - "Default editor" → Choose **"Use Visual Studio Code"** (or whichever editor you use)
   - Everything else → just click Next (defaults are fine)
5. Click **Install**, then **Finish**

### Mac

Option A — It might already be installed! Try:
```bash
git --version
```
If it asks you to install "Command Line Tools" — click **Install**.

Option B — Using Homebrew:
```bash
brew install git
```

### Verify It Worked

Open a **new** terminal and type:

```bash
git --version
```
You should see something like `git version 2.x.x`

### Configure Git (do this once)

Tell Git who you are (this labels your changes with your name):

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@adaptit.com"
```

Replace with YOUR actual name and email.

---

## Step 3: Install GitHub CLI (gh)

> This lets you create pull requests, view issues, and manage repos from your terminal instead of clicking around on the GitHub website.

### Windows

1. Go to https://cli.github.com/
2. Click **Download for Windows**
3. Run the `.msi` installer
4. Click through with defaults

### Mac

```bash
brew install gh
```

### Verify It Worked

```bash
gh --version
```
You should see something like `gh version 2.x.x`

### Log In to GitHub

```bash
gh auth login
```

It will ask you questions. Choose:
1. **GitHub.com** (not Enterprise)
2. **HTTPS**
3. **Login with a web browser** — it will give you a code
4. Press Enter, it opens your browser
5. Paste the code, click **Authorize**

Done! You're now logged in.

---

## Step 4: Install Visual Studio Code (Recommended Editor)

> This is where you'll look at and edit code. You don't strictly need it (any text editor works), but it makes life much easier.

1. Go to https://code.visualstudio.com/
2. Click the big blue **Download** button
3. Run the installer
4. During install, tick:
   - "Add to PATH" (important!)
   - "Register Code as an editor for supported file types"
5. Install and launch it

### Verify It Worked

```bash
code --version
```

---

## Step 5: Install Claude Code CLI

> This is the AI assistant that will help you build your app. It runs in your terminal.

### Windows / Mac / Linux

```bash
npm install -g @anthropic-ai/claude-code
```

The `-g` means "install globally" — so you can use it from any folder.

### Verify It Worked

```bash
claude --version
```

### Log In to Claude

```bash
claude
```

The first time you run it, it will ask you to authenticate. Follow the prompts to log in with your Anthropic account.

---

## Step 6: Install the Dev-ITS Workflow Skill

> This is a custom Claude Code skill that automates the full development pipeline — from picking up a ticket to opening a PR. It carries your work through 10 stages with 3 human gates where you approve before it continues.

### What It Does

The dev-its-workflow takes a GitHub issue and:
1. Estimates complexity
2. Writes a specification (you approve)
3. Plans the implementation (you approve)
4. Writes all the code + tests
5. Runs adversarial review
6. Opens a PR (you approve)
7. Updates documentation

You make 3 decisions. The AI does 10 stages of work.

### Windows

Your trainer will give you a file called **`dev-its-workflow.zip`**. To install it:

1. Open **File Explorer** and navigate to where you saved the zip file (e.g. `C:\Downloads\`)
2. **Right-click** the file → **Extract All...**
3. When it asks "Where do you want to extract?", paste this path:
   ```
   C:\Users\<your-username>\.claude\skills\
   ```
   (Replace `<your-username>` with your actual Windows username — e.g. `C:\Users\Jane.Smith\.claude\skills\`)
4. Click **Extract**

If you prefer the command line (Git Bash):

```bash
unzip ~/Downloads/dev-its-workflow.zip -d ~/.claude/skills/
```

### Mac/Linux

```bash
unzip ~/Downloads/dev-its-workflow.zip -d ~/.claude/skills/
```

### Verify It's Installed

The folder structure should look like this:

```
C:\Users\<you>\.claude\skills\dev-its-workflow\
├── SKILL.md                    ← Main orchestration logic
├── INSTALL.md                  ← Detailed install guide
├── GETTING_STARTED_GUIDE.md    ← Full tutorial walkthrough
├── config.schema.json          ← Config validation
├── agents/                     ← 11 specialist AI agents
├── references/                 ← Mapping rules
├── scripts/                    ← Setup helpers
└── templates/                  ← PR templates + example config
```

### First Run — The Config Wizard

The first time you use it in a project, it will auto-detect your environment and ask a few questions:

1. Navigate to your project folder
2. Start Claude Code: `claude`
3. Type: `dev-its-workflow`
4. It will detect there's no config and start the setup wizard
5. Answer the questions (reviewers, branch prefix, commit style)
6. It writes `.dev-its/config.json` in your project — commit this so your team shares the same config

### How to Use It

Once installed, you trigger it inside Claude Code with any of these:

```
dev-its-workflow
work this ticket #1
pick up ticket #45
start the pipeline
```

### When to Use It

- Starting a new feature from a GitHub issue
- Building something from scratch (like this address-book-app)
- Any time you want structured, gate-controlled AI development

### When NOT to Use It

- Quick one-line fixes (just ask Claude directly)
- Exploratory questions ("how does X work?")
- Non-code tasks (documentation only, config changes)

---

## Step 7: Verify Everything Works Together

Open a terminal and run all of these — they should all return version numbers:

```bash
node --version      # Should show v20+ or v22+
npm --version       # Should show 10+ or 11+
git --version       # Should show 2.x+
gh --version        # Should show 2.x+
code --version      # Should show 1.x+ (optional)
claude --version    # Should show a version number
```

To verify the dev-its-workflow skill is installed, start Claude Code and type:

```
What skills do you have available?
```

You should see `dev-its-workflow` in the list.

If any of them say "command not found":
1. Close your terminal
2. Open a brand new terminal
3. Try again
4. If still broken — restart your computer and try once more

---

## Step 8: Create a GitHub Account (if you don't have one)

1. Go to https://github.com/
2. Click **Sign up**
3. Follow the steps (email, password, username)
4. Verify your email
5. Then run `gh auth login` from Step 3 above

---

## Common Problems and Fixes

### "command not found" after installing something
**Fix:** Close your terminal and open a new one. The terminal needs to reload its list of available commands.

### "permission denied" or "EACCES" when running npm install -g
**Fix (Mac/Linux):**
```bash
sudo npm install -g @anthropic-ai/claude-code
```
It will ask for your computer password.

**Fix (Windows):** Run your terminal as Administrator (right-click → "Run as administrator").

### Git asks for username/password every time you push
**Fix:** Set up credential storage:
```bash
git config --global credential.helper store
```
Next time you push, enter your credentials once and they'll be saved.

### "npm WARN" messages during install
**These are usually fine.** Warnings (yellow) are not errors (red). As long as the install finishes and the command works afterwards, you can ignore warnings.

### Node.js version is too old
If `node --version` shows v16 or lower, you need to update. Go back to https://nodejs.org/ and download the latest LTS version. Install it over the top of your old version.

---

## You're Ready!

Once all the tools are installed and verified, you can:

1. Clone a project: `git clone https://github.com/YourOrg/your-project.git`
2. Open it: `cd your-project`
3. Start Claude Code: `claude`
4. Ask it to help you build!

Next step: Follow the main project README to run the application.
