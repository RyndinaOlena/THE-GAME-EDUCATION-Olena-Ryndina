// Header scroll effect
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const imageShowcase = document.querySelector('.image-showcase');
  
  // Handle header scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Check if image showcase is in viewport
    const rect = imageShowcase.getBoundingClientRect();
    const isInViewport = rect.top <= window.innerHeight * 0.8;
    
    if (isInViewport) {
      imageShowcase.classList.add('visible');
    }
  }
  
  // Initial check
  handleScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
});