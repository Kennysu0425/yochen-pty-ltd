# Yochen Pty Ltd — Personal Admin Workspace

Independent git repo for Yochen Pty Ltd (Australian company) administrative
work — domain decisions, company filings, future business setup notes, etc.

## Why this is its own git repo

The parent path (`Desktop/`) is the root of the personal AI OS repo. Without
its own `.git`, any Claude Code session started from this folder would be
pulled into the AI OS git context (worktrees originating from the AI OS repo,
memory keyed to the AI OS project namespace). Yochen has nothing to do with
the AI OS — initializing this folder as a standalone repo isolates it.

The AI OS repo's `.gitignore` already excludes everything outside its tracked
roots, so this nested git repo does not conflict with AI OS.

## Current state

- Australian Pty Ltd (ACN registered).
- Owns `yochen.com.au` (registered at VentraIP, 2026-05-22).
- Deliberately did not register `yochen.au` (.au priority allocation ended
  2024-09-20; first-come-first-served risk accepted).
- Landing page lives at the repo root (Next.js 16 + Tailwind v4).

## Products

Yochen products live under `products/` as **nested git repos** — each
has its own `.git` and remote, managed independently. The outer Yochen
repo ignores `products/` entirely (see `.gitignore`).

- `products/pdf-professional-suite/` — macOS PDF app. Remote:
  `github.com/Kennysu0425/pdf-professional-suite`. Migrated under Yochen
  on 2026-05-27; previously lived at `Desktop/B_技術開發/Git/`.

## Not the same as Joy TruePath

Joy TruePath is Kenny's separate Singapore company. Do not conflate.

## What goes here

- Domain admin records (registrar, DNS, expiry tracking)
- Company filing notes
- Future business setup planning when/if Yochen activates
- Anything Yochen-specific that needs to be version-controlled

## What does NOT go here

- AI OS code (that lives in the parent `Desktop/` repo)
- KDAN work (employer context, separate)
- Joy TruePath work (separate Singapore company, separate repo when needed)
