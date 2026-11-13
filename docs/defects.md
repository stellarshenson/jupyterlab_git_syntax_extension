# Defects

Defects of the JupyterLab git syntax extension.

## Authors

- `@kj` Konrad Jelen

## Gitconfig `CONF`

The gitconfig stream parser

- log: 2026-11-13T07:00:14Z @kj category created

- [x] `DEF-CONF-1-NO-ADVANCE` **Section header character stops the parser** - MEDIUM; a section header holding a character outside [a-zA-Z0-9._-] and not a quote, such as [a/b] or the second line of a JSON file named config, returns a token without advancing; CodeMirror raises Stream parser failed to advance stream and highlighting stops; src/gitconfig-mode.ts
  - evidence: Jest 24 green, test should advance on a character a section name cannot hold; failed match now consumes one character
  - repro: open a file named config holding the line [a/b]
  - test-tags: UNIT
  - root-cause: 2026-11-13T07:00:14Z @kj the section-name match result was ignored, so a failed match consumed nothing
  - log: 2026-11-13T07:00:14Z @kj added
  - log: 2026-11-13T07:02:37Z @kj closed
- [x] `DEF-CONF-2-INLINE-COMMENT` **Comment after a value is coloured as value** - MINOR; name = John # note colours # note as string; README states # and ; comments are highlighted; src/gitconfig-mode.ts
  - evidence: Jest 24 green, test should tokenize a comment after a value
  - repro: open .gitconfig with the line name = John # note
  - test-tags: UNIT
  - root-cause: 2026-11-13T07:00:14Z @kj the inline-comment branch matched leading whitespace that eatSpace had already consumed, so it never ran
  - log: 2026-11-13T07:00:14Z @kj added
  - log: 2026-11-13T07:02:37Z @kj closed

## Gitattributes `ATTR`

The gitattributes stream parser

- log: 2026-11-13T07:26:31Z @kj category created

- [x] `DEF-ATTR-3-LEADING-SPACE` **Line starting with whitespace stops the parser** - MEDIUM; a .gitattributes line that starts with a space or tab, or holds only whitespace, returns a token without advancing; CodeMirror raises Stream parser failed to advance stream and highlighting stops; src/gitattributes-mode.ts
  - evidence: Jest 25 green, test should advance over leading whitespace; eatSpace now runs at any position
  - repro: open .gitattributes holding an indented line such as two spaces then *.txt text
  - test-tags: UNIT
  - root-cause: 2026-11-13T07:26:31Z @kj whitespace was skipped only after the pattern, so at the line start the pattern match consumed nothing
  - log: 2026-11-13T07:26:31Z @kj added
  - log: 2026-11-13T07:27:49Z @kj closed
