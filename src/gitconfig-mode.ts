import { StreamParser } from '@codemirror/language';

interface IGitconfigState {
  inSectionHeader: boolean;
  inValue: boolean;
  continuationLine: boolean;
}

export const gitconfigMode: StreamParser<IGitconfigState> = {
  name: 'gitconfig',

  startState: (): IGitconfigState => ({
    inSectionHeader: false,
    inValue: false,
    continuationLine: false
  }),

  token: (stream, state): string | null => {
    // Handle continuation lines
    if (stream.sol()) {
      if (!state.continuationLine) {
        state.inValue = false;
      }
      state.continuationLine = false;
    }

    // Skip whitespace
    if (stream.eatSpace()) {
      return null;
    }

    // Inside section header [section "subsection"]
    if (state.inSectionHeader) {
      if (stream.eat(/]/)) {
        state.inSectionHeader = false;
        return 'bracket';
      }
      // Quoted subsection
      if (stream.peek() === '"') {
        stream.next();
        while (!stream.eol()) {
          if (stream.eat(/\\/)) {
            stream.next();
          } else if (stream.peek() === '"') {
            stream.next();
            return 'string';
          } else {
            stream.next();
          }
        }
        return 'string';
      }
      // Section name
      stream.match(/[a-zA-Z0-9._-]+/);
      return 'keyword';
    }

    // Comments: # or ;
    if (stream.sol() && stream.eat(/[#;]/)) {
      stream.skipToEnd();
      return 'comment';
    }
    if (!state.inValue && stream.eat(/[#;]/)) {
      stream.skipToEnd();
      return 'comment';
    }

    // Section header start
    if (stream.sol() && stream.eat(/\[/)) {
      state.inSectionHeader = true;
      return 'bracket';
    }

    // Key name (not in value context, not in section header)
    if (!state.inValue && !state.inSectionHeader) {
      if (stream.match(/[a-zA-Z][a-zA-Z0-9-]*/)) {
        return 'property';
      }
    }

    // Equals operator
    if (!state.inValue && stream.eat(/=/)) {
      state.inValue = true;
      return 'operator';
    }

    // Value parsing
    if (state.inValue) {
      // Trailing backslash continuation
      if (stream.eol()) {
        return null;
      }

      // Quoted string value
      if (stream.peek() === '"') {
        stream.next();
        while (!stream.eol()) {
          if (stream.eat(/\\/)) {
            stream.next();
          } else if (stream.peek() === '"') {
            stream.next();
            return 'string';
          } else {
            stream.next();
          }
        }
        return 'string';
      }

      // Inline comment in value context
      if (stream.match(/\s+[#;]/, false)) {
        stream.eatSpace();
        if (stream.eat(/[#;]/)) {
          stream.skipToEnd();
          return 'comment';
        }
      }

      // Boolean values - only match as standalone words, not mid-word.
      // We check that the next characters form a complete boolean word
      // followed by a non-word character (or EOL). The stream.match()
      // only looks forward, so we also guard against mid-word position
      // by requiring the previous character (if any) to be non-alphanumeric.
      if (
        stream.match(/(true|false|yes|no|on|off)(?=[^a-zA-Z0-9_-]|$)/i, false)
      ) {
        const before = stream.string.charAt(stream.pos - 1);
        if (stream.pos === 0 || !/[a-zA-Z0-9_-]/.test(before)) {
          stream.match(/(true|false|yes|no|on|off)/i);
          return 'atom';
        }
      }

      // Integer values with optional suffix - same standalone guard
      if (stream.match(/\d+[kKmMgG]?(?=[^a-zA-Z0-9_-]|$)/)) {
        return 'number';
      }

      // Trailing backslash for continuation
      if (stream.match(/\\$/)) {
        state.continuationLine = true;
        return 'string';
      }

      // Unquoted value text - consume word characters as a chunk.
      // Includes : for URLs (e.g. https://host:8443/path) and
      // @ for email/git addresses (e.g. git@host)
      if (stream.match(/[a-zA-Z0-9_./:@~-]+/)) {
        return 'string';
      }
      stream.next();
      return 'string';
    }

    // Consume any other character
    stream.next();
    return null;
  }
};
