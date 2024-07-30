// document.addEventListener('DOMContentLoaded', () => {
//     const sections = document.querySelectorAll('.section');
//     let currentIndex = 0;
//     let isScrolling = false;
  
//     function scrollToSection(index) {
//       if (index < 0 || index >= sections.length || isScrolling) return;
  
//       isScrolling = true;
//       sections.forEach((section, i) => {
//         section.style.transform = `translateY(-${index * 100}vh)`;
//       });
  
//       setTimeout(() => {
//         isScrolling = false;
//       }, 500); // Match with CSS transition time
//     }
  
//     document.addEventListener('wheel', (event) => {
//       if (event.deltaY > 0) {
//         // Scroll down
//         currentIndex = Math.min(currentIndex + 1, sections.length - 1);
//       } else {
//         // Scroll up
//         currentIndex = Math.max(currentIndex - 1, 0);
//       }
//       scrollToSection(currentIndex);
//     });
//   });
  