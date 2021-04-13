const processed = Symbol('processed');

/**
 * @param {Rule} rule
 * */
function process(rule) {
  let hasOverflowHidden = false;
  let hasBorderRadius = false;
  let hasZIndex = false;
  rule.walkDecls(/^overflow-?/, (decl) => {
    if (decl.value === 'hidden') {
      hasOverflowHidden = true;
    }
  });
  rule.walkDecls(/border(-\w+){0,2}-radius/, () => {
    hasBorderRadius = true;
  });
  rule.walkDecls(/z-index/, () => {
    hasZIndex = true;
  });
  if (hasOverflowHidden && hasBorderRadius && !hasZIndex) {
    rule.append({
      prop: 'z-index',
      value: '0',
    });
  }
}

function plugin() {
  return {
    postcssPlugin: 'postcss-safari-border-radius-clip-fix',
    /**
     * @param {Rule} rule
     * */
    Rule(rule) {
      if (!rule[processed]) {
        process(rule);
        rule[processed] = true;
      }
    },
  };
}

plugin.postcss = true;

module.exports = plugin;
