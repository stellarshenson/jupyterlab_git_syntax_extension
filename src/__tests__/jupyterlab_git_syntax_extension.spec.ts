import { gitignoreMode } from '../gitignore-mode';
import { gitconfigMode } from '../gitconfig-mode';
import { gitattributesMode } from '../gitattributes-mode';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const require: any;
declare const __dirname: string;
/* eslint-enable @typescript-eslint/no-explicit-any */

const fs: { readFileSync: (p: string, enc: string) => string } = require('fs');
const path: { resolve: (...p: string[]) => string } = require('path');

/**
 * Minimal StringStream mock for testing StreamParser token() methods.
 */
class MockStringStream {
  private pos: number;
  private start: number;
  private lineStart: boolean;
  private str: string;

  constructor(line: string, isFirstLine = true) {
    this.str = line;
    this.pos = 0;
    this.start = 0;
    this.lineStart = isFirstLine;
  }

  sol(): boolean {
    return this.pos === 0 && this.lineStart;
  }

  eol(): boolean {
    return this.pos >= this.str.length;
  }

  peek(): string | undefined {
    return this.pos < this.str.length ? this.str[this.pos] : undefined;
  }

  next(): string | undefined {
    if (this.pos < this.str.length) {
      return this.str[this.pos++];
    }
    return undefined;
  }

  eat(match: RegExp | string): string | false {
    const ch = this.str[this.pos];
    if (!ch) {
      return false;
    }
    if (typeof match === 'string') {
      if (ch === match) {
        this.pos++;
        return ch;
      }
      return false;
    }
    if (match.test(ch)) {
      this.pos++;
      return ch;
    }
    return false;
  }

  eatSpace(): boolean {
    const start = this.pos;
    while (this.pos < this.str.length && /\s/.test(this.str[this.pos])) {
      this.pos++;
    }
    return this.pos > start;
  }

  match(
    pattern: string | RegExp,
    consume?: boolean,
    _caseInsensitive?: boolean
  ): boolean | RegExpMatchArray | null {
    if (typeof pattern === 'string') {
      if (this.str.substring(this.pos).startsWith(pattern)) {
        if (consume !== false) {
          this.pos += pattern.length;
        }
        return true;
      }
      return false;
    }
    // Ensure regex is anchored at current position
    let source = pattern.source;
    if (!source.startsWith('^')) {
      source = '^' + source;
    }
    const re = new RegExp(source, pattern.flags);
    const m = this.str.substring(this.pos).match(re);
    if (m) {
      if (consume !== false) {
        this.pos += m[0].length;
      }
      return m;
    }
    return null;
  }

  current(): string {
    return this.str.substring(this.start, this.pos);
  }

  skipToEnd(): void {
    this.pos = this.str.length;
  }

  backUp(n: number): void {
    this.pos -= n;
  }
}

/**
 * Helper: tokenize a full line, returning array of [token, text] pairs.
 */
function tokenizeLine(
  parser: { token: (stream: any, state: any) => string | null },
  state: any,
  line: string,
  isFirstLine = true
): Array<[string | null, string]> {
  const stream = new MockStringStream(line, isFirstLine);
  const tokens: Array<[string | null, string]> = [];

  while (!stream.eol()) {
    (stream as any).start = (stream as any).pos;
    const tok = parser.token(stream, state);
    const text = stream.current();
    if (text) {
      tokens.push([tok, text]);
    }
  }
  return tokens;
}

describe('gitignore parser', () => {
  let state: any;

  beforeEach(() => {
    state = gitignoreMode.startState!(2);
  });

  it('should tokenize comments', () => {
    const tokens = tokenizeLine(gitignoreMode, state, '# comment');
    expect(tokens).toEqual([['comment', '# comment']]);
  });

  it('should tokenize negation prefix', () => {
    const tokens = tokenizeLine(gitignoreMode, state, '!important');
    expect(tokens[0]).toEqual(['keyword', '!']);
  });

  it('should tokenize glob patterns', () => {
    const tokens = tokenizeLine(gitignoreMode, state, '**/*.log');
    expect(tokens[0]).toEqual(['string.special', '**']);
    expect(tokens[1]).toEqual(['string.special', '/']);
    expect(tokens[2]).toEqual(['string.special', '*']);
    expect(tokens[3]).toEqual(['string', '.']);
    expect(tokens[4]).toEqual(['string', 'l']);
  });

  it('should tokenize character classes', () => {
    const tokens = tokenizeLine(gitignoreMode, state, '[abc]');
    expect(tokens[0]).toEqual(['string.special', '[abc]']);
  });

  it('should tokenize plain patterns', () => {
    const tokens = tokenizeLine(gitignoreMode, state, 'node_modules');
    expect(tokens.every(([tok]) => tok === 'string')).toBe(true);
  });

  it('should tokenize escaped characters', () => {
    const tokens = tokenizeLine(gitignoreMode, state, '\\#notcomment');
    expect(tokens[0]).toEqual(['string', '\\#']);
  });

  it('should tokenize path separator', () => {
    const tokens = tokenizeLine(gitignoreMode, state, 'dir/file');
    const slashToken = tokens.find(([, text]) => text === '/');
    expect(slashToken![0]).toBe('string.special');
  });
});

describe('gitconfig parser', () => {
  let state: any;

  beforeEach(() => {
    state = gitconfigMode.startState!(2);
  });

  it('should tokenize section headers', () => {
    const tokens = tokenizeLine(gitconfigMode, state, '[core]');
    expect(tokens[0]).toEqual(['bracket', '[']);
    expect(tokens[1]).toEqual(['keyword', 'core']);
    expect(tokens[2]).toEqual(['bracket', ']']);
  });

  it('should tokenize section with subsection', () => {
    const tokens = tokenizeLine(
      gitconfigMode,
      state,
      '[remote "origin"]'
    );
    expect(tokens[0]).toEqual(['bracket', '[']);
    expect(tokens[1]).toEqual(['keyword', 'remote']);
    // whitespace is consumed
    const stringToken = tokens.find(([tok]) => tok === 'string');
    expect(stringToken).toBeDefined();
  });

  it('should tokenize comments with #', () => {
    const tokens = tokenizeLine(gitconfigMode, state, '# a comment');
    expect(tokens[0][0]).toBe('comment');
  });

  it('should tokenize comments with ;', () => {
    const tokens = tokenizeLine(gitconfigMode, state, '; a comment');
    expect(tokens[0][0]).toBe('comment');
  });

  it('should tokenize key = value', () => {
    const tokens = tokenizeLine(gitconfigMode, state, '\tname = John', false);
    const propToken = tokens.find(([tok]) => tok === 'property');
    const opToken = tokens.find(([tok]) => tok === 'operator');
    expect(propToken).toBeDefined();
    expect(opToken).toBeDefined();
  });

  it('should tokenize boolean values', () => {
    const tokens = tokenizeLine(gitconfigMode, state, '\tbare = true', false);
    const atomToken = tokens.find(([tok]) => tok === 'atom');
    expect(atomToken).toBeDefined();
  });

  it('should tokenize numeric values', () => {
    const tokens = tokenizeLine(
      gitconfigMode,
      state,
      '\tpackSizeLimit = 100M',
      false
    );
    const numToken = tokens.find(([tok]) => tok === 'number');
    expect(numToken).toBeDefined();
  });
});

describe('gitattributes parser', () => {
  let state: any;

  beforeEach(() => {
    state = gitattributesMode.startState!(2);
  });

  it('should tokenize comments', () => {
    const tokens = tokenizeLine(gitattributesMode, state, '# comment');
    expect(tokens).toEqual([['comment', '# comment']]);
  });

  it('should tokenize pattern and set attribute', () => {
    const tokens = tokenizeLine(gitattributesMode, state, '*.txt text');
    expect(tokens[0]).toEqual(['string', '*.txt']);
    const kwToken = tokens.find(([tok]) => tok === 'keyword');
    expect(kwToken).toBeDefined();
  });

  it('should tokenize unset attribute with -', () => {
    const tokens = tokenizeLine(gitattributesMode, state, '*.bin -text');
    expect(tokens[0]).toEqual(['string', '*.bin']);
    // -text should produce keyword token
    const kwTokens = tokens.filter(([tok]) => tok === 'keyword');
    expect(kwTokens.length).toBeGreaterThan(0);
  });

  it('should tokenize attribute with value', () => {
    const tokens = tokenizeLine(
      gitattributesMode,
      state,
      '*.jpg filter=lfs'
    );
    expect(tokens[0]).toEqual(['string', '*.jpg']);
    // Should have string token for value part (filter=lfs)
    const hasString = tokens.some(
      ([tok, text]) => tok === 'string' && text.includes('lfs')
    );
    expect(hasString).toBe(true);
  });

  it('should tokenize macro definitions', () => {
    const tokens = tokenizeLine(
      gitattributesMode,
      state,
      '[attr]binary -diff -merge -text'
    );
    expect(tokens[0]).toEqual(['keyword', '[attr]']);
  });
});

describe('icon override prevention', () => {
  it('should not call docRegistry.addFileType in index.ts', () => {
    const indexSource = fs.readFileSync(
      path.resolve(__dirname, '..', 'index.ts'),
      'utf-8'
    );
    // Strip comments before checking - we only care about actual code calls.
    // docRegistry.addFileType() overrides icons set by other extensions
    // (e.g. jupyterlab_vscode_icons_extension). This extension must only
    // register languages via IEditorLanguageRegistry, not file types.
    const codeOnly = indexSource.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(codeOnly).not.toMatch(/addFileType\s*\(/);
  });
});
