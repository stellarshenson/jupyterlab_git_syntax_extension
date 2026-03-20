<!-- @import /home/lab/workspace/.claude/CLAUDE.md -->

# Project-Specific Configuration

This file imports workspace-level configuration from `/home/lab/workspace/.claude/CLAUDE.md`.
All workspace rules apply. Project-specific rules below strengthen or extend them.

The workspace `/home/lab/workspace/.claude/` directory contains additional instruction files
(MERMAID.md, NOTEBOOK.md, DATASCIENCE.md, GIT.md, and others) referenced by CLAUDE.md.
Consult workspace CLAUDE.md and the .claude directory to discover all applicable standards.

## Mandatory Bans (Reinforced)

The following workspace rules are STRICTLY ENFORCED for this project:

- **No automatic git tags** - only create tags when user explicitly requests
- **No automatic version changes** - only modify version in package.json/pyproject.toml/etc. when user explicitly requests
- **No automatic publishing** - never run `make publish`, `npm publish`, `twine upload`, or similar without explicit user request
- **No manual package installs if Makefile exists** - use `make install` or equivalent Makefile targets, not direct `pip install`/`uv install`/`npm install`
- **No automatic git commits or pushes** - only when user explicitly requests

## Project Context

JupyterLab extension that adds syntax highlighting to git configuration files (.gitignore, .gitmodules, .gitattributes, .gitconfig, etc.) within the JupyterLab editor. Built with TypeScript frontend, Python packaging via hatchling, and the standard JupyterLab extension toolchain (jlpm, jupyter-builder).

- **npm package**: `jupyterlab_git_syntax_extension`
- **PyPI package**: `jupyterlab-git-syntax-extension`
- **GitHub owner**: `stellarshenson`
- **JupyterLab**: 4.x
- **Python**: >= 3.10

## Makefile Version Synchronization

**MANDATORY**: At the start of every session involving build or Makefile operations, compare the version header in the local `Makefile` against the shared utils Makefile at `private/jupyterlab/@utils/jupyterlab-extensions/Makefile`. If the shared version is newer, update the local Makefile immediately before proceeding with any build tasks. The version is declared in line 1 as `# Makefile for Jupyterlab extensions version X.XX`.

## Package Metadata Files

**MANDATORY**: `package.json` and `package-lock.json` must always be committed to the repository. Never add these to `.gitignore`. After any build or install operation that modifies them, ensure they are staged for the next commit.

## Installation

**MANDATORY**: Always use `make install` to install packages. Never use direct `pip install`, `npm install`, `jlpm install`, or similar commands unless no Makefile target exists for the operation.
