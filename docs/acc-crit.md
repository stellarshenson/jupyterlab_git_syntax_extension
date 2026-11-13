# Acceptance Criteria

Behaviour of the JupyterLab git syntax extension: CodeMirror stream parsers for gitignore, gitconfig and gitattributes files, registered in the editor language registry.

## Authors

- `@kj` Konrad Jelen

## Gitignore `IGN`

Highlighting of .gitignore files

- log: 2026-11-13T07:00:13Z @kj category created

- [x] `ACC-IGN-1-TOKENS` **Gitignore tokens** - HIGH; comments, negation prefix, glob wildcards, character classes and path separators each get their own token
  - evidence: build_test.py at 1.0.14: Jest 24 green, describe gitignore parser, 7 tests
  - test: jlpm test, describe gitignore parser
  - test-tags: UNIT
  - log: 2026-11-13T07:00:13Z @kj added
  - log: 2026-11-13T07:02:37Z @kj closed

## Gitconfig `CONF`

Highlighting of .gitconfig, .gitmodules and config files

- log: 2026-11-13T07:00:13Z @kj category created

- [x] `ACC-CONF-2-TOKENS` **Gitconfig tokens** - HIGH; section headers, key-value pairs, booleans, numbers with size suffix and comments (# and ;, also after a value) each get their own token
  - evidence: build_test.py at 1.0.14: Jest 24 green, describe gitconfig parser
  - test: jlpm test, describe gitconfig parser
  - test-tags: UNIT
  - log: 2026-11-13T07:00:13Z @kj added
  - log: 2026-11-13T07:02:37Z @kj closed
- [x] `ACC-CONF-3-ADVANCE` **Parser always advances** - HIGH; a section header holding a character outside the section name set is consumed, never left for CodeMirror to raise Stream parser failed to advance stream
  - evidence: build_test.py at 1.0.14: Jest 24 green, should advance on a character a section name cannot hold
  - test: jlpm test, should advance on a character a section name cannot hold
  - test-tags: UNIT
  - log: 2026-11-13T07:00:13Z @kj added
  - log: 2026-11-13T07:02:37Z @kj closed

## Gitattributes `ATTR`

Highlighting of .gitattributes files

- log: 2026-11-13T07:00:13Z @kj category created

- [x] `ACC-ATTR-4-TOKENS` **Gitattributes tokens** - HIGH; file patterns, [attr] macro definitions, set, unset and unspecify attributes and attribute values each get their own token
  - evidence: build_test.py at 1.0.14: Jest 24 green, describe gitattributes parser, 5 tests
  - test: jlpm test, describe gitattributes parser
  - test-tags: UNIT
  - log: 2026-11-13T07:00:13Z @kj added
  - log: 2026-11-13T07:02:37Z @kj closed

## Registration `REG`

Language registration in JupyterLab

- log: 2026-11-13T07:00:13Z @kj category created

- [ ] `ACC-REG-5-DETECT` **Automatic file detection** - HIGH; .gitignore, .gitconfig, .gitmodules, config and .gitattributes open with their language by file name and extension
  - test: open each file in JupyterLab, read the language in the status bar
  - test-tags: MANUAL
  - log: 2026-11-13T07:00:13Z @kj added
- [x] `ACC-REG-6-ICONS` **Icon-safe** - MEDIUM; the plugin registers languages only and never calls docRegistry.addFileType
  - evidence: build_test.py at 1.0.14: Jest 24 green, describe icon override prevention
  - test: jlpm test, describe icon override prevention
  - test-tags: UNIT
  - log: 2026-11-13T07:00:14Z @kj added
  - log: 2026-11-13T07:02:37Z @kj closed
