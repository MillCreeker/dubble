/**
 * Helper function to escape input strings
 */
function htmlEntities(str) {
  return `${str}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Array with some colors
const colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort((a, b) => { return Math.random() > 0.5; });

module.exports = {
  htmlEntities,
  colors
}
