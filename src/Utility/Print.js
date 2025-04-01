export function print() {
  // Get the font scale from the root element
  const fontScale = getComputedStyle(document.documentElement).getPropertyValue('--font-scale') || 1;
  
  // Set it as a print-specific variable
  document.documentElement.style.setProperty('--print-font-scale', fontScale);
  
  // Force Chrome to recognize our styles by updating a CSS variable
  document.documentElement.style.setProperty('--print-trigger', 'true');
  
  // Allow a moment for styles to take effect
  setTimeout(() => {
    window.print();
  }, 100);
}