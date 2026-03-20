# jupyterlab_git_syntax_extension

[![GitHub Actions](https://github.com/stellarshenson/jupyterlab_git_syntax_extension/actions/workflows/build.yml/badge.svg)](https://github.com/stellarshenson/jupyterlab_git_syntax_extension/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/jupyterlab_git_syntax_extension.svg)](https://www.npmjs.com/package/jupyterlab_git_syntax_extension)
[![PyPI version](https://img.shields.io/pypi/v/jupyterlab-git-syntax-extension.svg)](https://pypi.org/project/jupyterlab-git-syntax-extension/)
[![Total PyPI downloads](https://static.pepy.tech/badge/jupyterlab-git-syntax-extension)](https://pepy.tech/project/jupyterlab-git-syntax-extension)
[![JupyterLab 4](https://img.shields.io/badge/JupyterLab-4-orange.svg)](https://jupyterlab.readthedocs.io/en/stable/)
[![Brought To You By KOLOMOLO](https://img.shields.io/badge/Brought%20To%20You%20By-KOLOMOLO-00ffff?style=flat)](https://kolomolo.com)
[![Donate PayPal](https://img.shields.io/badge/Donate-PayPal-blue?style=flat)](https://www.paypal.com/donate/?hosted_button_id=B4KPBJDLLXTSA)

> [!TIP]
> This extension is part of the [stellars_jupyterlab_extensions](https://github.com/stellarshenson/stellars_jupyterlab_extensions) metapackage. Install all Stellars extensions at once: `pip install stellars_jupyterlab_extensions`

Syntax highlighting for git configuration files in JupyterLab. Open `.gitignore`, `.gitmodules`, `.gitattributes`, `.gitconfig` and other git files with proper syntax colouring instead of plain text.

## Features

- **Syntax highlighting for git files** - `.gitignore`, `.gitmodules`, `.gitattributes`, `.gitconfig`, `.gitmessage`
- **Automatic file type detection** - Git files are recognized and highlighted when opened
- **CodeMirror integration** - Uses JupyterLab's built-in CodeMirror editor for consistent highlighting
- **No configuration required** - Works out of the box after installation

## Requirements

- JupyterLab >= 4.0.0

## Install

```bash
pip install jupyterlab_git_syntax_extension
```

## Uninstall

```bash
pip uninstall jupyterlab_git_syntax_extension
```
