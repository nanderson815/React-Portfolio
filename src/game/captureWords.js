/*
 * Reads the words currently on screen out of a rendered element, keeping the
 * position, font and colour each one is already drawn with.
 *
 * Nothing is mutated. react-markdown owns this DOM, so measurement happens
 * through Ranges and the result is handed to a canvas to redraw.
 */

// A word never wraps, so one bounding rect per range is always correct.
function rectFor(node, start, end) {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  const rect = range.getBoundingClientRect();
  range.detach();
  return rect;
}

export function captureWords(root, margin = 0) {
  if (!root) return [];

  const viewport = window.innerHeight;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const words = [];
  let node = walker.nextNode();

  while (node) {
    const parent = node.parentElement;
    if (parent) {
      const style = window.getComputedStyle(parent);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const color = style.color;
      const pattern = /\S+/g;
      let match = pattern.exec(node.nodeValue);

      while (match) {
        const rect = rectFor(node, match.index, match.index + match[0].length);
        const onScreen = rect.bottom > -margin && rect.top < viewport + margin;
        if (rect.width > 0 && rect.height > 0 && onScreen) {
          words.push({
            text: match[0],
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height,
            font,
            color,
          });
        }
        match = pattern.exec(node.nodeValue);
      }
    }
    node = walker.nextNode();
  }

  return words;
}
