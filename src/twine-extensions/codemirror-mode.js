export function mode() {
  return {
    startState() {
      return {
        inScriptBlock: false,
        inStyleBlock: false,
        scriptNesting: 0
      };
    },

    token(stream, state) {
      // Handle Snowman's JavaScript blocks: <%...%>
      if (stream.match(/^<%/)) {
        state.inScriptBlock = true;
        state.scriptNesting = 1;
        return 'keyword';
      }

      if (state.inScriptBlock) {
        // Handle nested <% blocks
        if (stream.match(/^<%/)) {
          state.scriptNesting++;
          return 'keyword';
        }
        
        // Handle closing %>
        if (stream.match(/^%>/)) {
          state.scriptNesting--;
          if (state.scriptNesting === 0) {
            state.inScriptBlock = false;
          }
          return 'keyword';
        }

        // Inside JavaScript block - highlight as JavaScript
        if (stream.match(/^\/\/.*$/)) {
          return 'comment';
        }
        
        if (stream.match(/^\/\*[\s\S]*?\*\//)) {
          return 'comment';
        }

        if (stream.match(/^(var|let|const|function|if|else|for|while|return|new|this|window|document)\b/)) {
          return 'keyword';
        }

        if (stream.match(/^(true|false|null|undefined)\b/)) {
          return 'atom';
        }

        if (stream.match(/^"([^"\\]|\\.)*"/)) {
          return 'string';
        }

        if (stream.match(/^'([^'\\]|\\.)*'/)) {
          return 'string';
        }

        if (stream.match(/^`([^`\\]|\\.)*`/)) {
          return 'string';
        }

        if (stream.match(/^\d+(\.\d+)?/)) {
          return 'number';
        }

        // Default JavaScript token
        stream.next();
        return 'variable';
      }

      // Handle HTML-style comments
      if (stream.match(/^<!--[\s\S]*?-->/)) {
        return 'comment';
      }

      // Handle Twine links [[...]]
      if (stream.match(/^\[\[[^\]]+?\]\]/)) {
        return 'link';
      }

      // Handle HTML tags
      if (stream.match(/^<\/?[a-zA-Z][^>]*>/)) {
        return 'tag';
      }

      // Handle CSS in <style> blocks
      if (stream.match(/^<style[^>]*>/)) {
        state.inStyleBlock = true;
        return 'tag';
      }

      if (state.inStyleBlock) {
        if (stream.match(/^<\/style>/)) {
          state.inStyleBlock = false;
          return 'tag';
        }
        
        // Basic CSS highlighting
        if (stream.match(/^[a-zA-Z-]+(?=\s*:)/)) {
          return 'property';
        }
        
        if (stream.match(/^[^;{}]+/)) {
          return 'string';
        }
      }

      // Default text
      if (stream.eatWhile(/[^<[%]/)) {
        return 'text';
      }

      stream.next();
      return 'text';
    }
  };
}