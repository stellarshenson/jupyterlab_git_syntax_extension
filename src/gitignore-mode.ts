import { StreamParser } from '@codemirror/language';

interface IGitignoreState {
  /* line-oriented format, no cross-line state needed */
}

export const gitignoreMode: StreamParser<IGitignoreState> = {
  name: 'gitignore',

  startState: (): IGitignoreState => ({}),

  token: (stream): string | null => {
    // Comments
    if (stream.sol() && stream.peek() === '#') {
      stream.skipToEnd();
      return 'comment';
    }

    // Negation prefix
    if (stream.sol() && stream.eat(/!/)) {
      return 'keyword';
    }

    // Escaped character
    if (stream.eat(/\\/)) {
      stream.next();
      return 'string';
    }

    // Character class [...]
    if (stream.peek() === '[') {
      stream.next();
      while (!stream.eol()) {
        if (stream.peek() === ']') {
          stream.next();
          return 'string.special';
        }
        stream.next();
      }
      return 'string.special';
    }

    // Glob patterns: **, *, ?
    if (stream.match('**')) {
      return 'string.special';
    }
    if (stream.eat(/[*?]/)) {
      return 'string.special';
    }

    // Path separator
    if (stream.eat(/\//)) {
      return 'string.special';
    }

    // Plain text
    stream.next();
    return 'string';
  }
};
