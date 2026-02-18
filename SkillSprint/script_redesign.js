// ============================================
// SkillSprint Complete Redesign - JavaScript
// Interactive Features & Animations
// ============================================

// Smooth Scroll Behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// Navbar Scroll Effects
// ============================================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 50) {
    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.background = 'rgba(15, 23, 42, 0.8)';
    navbar.style.boxShadow = 'none';
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============================================
// Intersection Observer for Animations
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe service cards, portfolio items, testimonials
document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .process-step, .pricing-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease 0.1s';
  observer.observe(el);
});

// ============================================
// Contact Form Handling
// ============================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Validate
    if (!name || !email || !message) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Show success message
      showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      
      // Reset form
      contactForm.reset();
    }, 1500);
    
    // Alternatively, integrate with Formspree:
    // await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'Accept': 'application/json'
    //   }
    // }).then(response => {
    //   if (response.ok) {
    //     showNotification('Message sent successfully!', 'success');
    //     contactForm.reset();
    //   } else {
    //     showNotification('Error sending message', 'error');
    //   }
    // });
  });
}

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    z-index: 2000;
    animation: slideIn 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid;
  `;
  
  if (type === 'success') {
    notification.style.background = 'rgba(16, 185, 129, 0.1)';
    notification.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    notification.style.color = '#10b981';
  } else if (type === 'error') {
    notification.style.background = 'rgba(239, 68, 68, 0.1)';
    notification.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    notification.style.color = '#ef4444';
  } else {
    notification.style.background = 'rgba(109, 40, 217, 0.1)';
    notification.style.borderColor = 'rgba(109, 40, 217, 0.3)';
    notification.style.color = '#a78bfa';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// Counter Animation
// ============================================

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stat = entry.target;
      const number = stat.querySelector('h3');
      const text = number.textContent;
      
      // Extract number from text (e.g., "300+" -> 300)
      const match = text.match(/(\d+)/);
      if (match) {
        const targetNumber = parseInt(match[1]);
        animateCounter(number, targetNumber);
      }
      
      statsObserver.unobserve(stat);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
  statsObserver.observe(stat);
});

// ============================================
// Portfolio Lightbox (Simple)
// ============================================

document.querySelectorAll('.portfolio-item').forEach(item => {
  item.style.cursor = 'pointer';
  
  item.addEventListener('click', () => {
    const title = item.querySelector('h3').textContent;
    const description = item.querySelector('p').textContent;
    showPortfolioModal(title, description);
  });
});

function showPortfolioModal(title, description) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
    backdrop-filter: blur(5px);
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
    border: 1px solid rgba(148, 163, 184, 0.2);
    padding: 2rem;
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    animation: slideUp 0.3s ease;
    backdrop-filter: blur(20px);
  `;
  
  content.innerHTML = `
    <h2 style="margin-bottom: 1rem; background: linear-gradient(135deg, #6d28d9 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${title}</h2>
    <p style="margin-bottom: 2rem; color: #cbd5e1; line-height: 1.8;">${description}</p>
    <p style="color: #94a3b8; margin-bottom: 1rem; font-size: 0.95rem;">This is a demonstration of a portfolio case study. In a real implementation, this would display full project details, images, technologies used, and results achieved.</p>
    <button id="close-modal" style="
      background: linear-gradient(135deg, #6d28d9, #ec4899);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    ">Close</button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  const closeBtn = modal.querySelector('#close-modal');
  closeBtn.addEventListener('click', () => {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => modal.remove(), 300);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// ============================================
// Add Styles for Animations
// ============================================

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// Active Link Highlighting
// ============================================

const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = '#6d28d9';
      link.style.fontWeight = '700';
    }
  });
});

// ============================================
// Page Load Animations
// ============================================

window.addEventListener('load', () => {
  // Animate hero content
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
      heroContent.style.transition = 'all 0.8s ease';
    }, 100);
  }
  
  // Animate floating cards
  document.querySelectorAll('.floating-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
      card.style.transition = 'all 0.6s ease';
    }, 200 + index * 100);
  });
});

// ============================================
// Mouse Follow Effect (Optional Enhancement)
// ============================================

document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  const gradients = document.querySelectorAll('[class*="bg-gradient"]');
  gradients.forEach(grad => {
    grad.style.opacity = 0.15 + (x + y) * 0.1;
  });
});

// ============================================
// Console Welcome Message
// ============================================

console.log(
  `%c⚡ SkillSprint %c\nPremium Web Design & Development Studio\n\nWe transform ideas into stunning digital experiences.\n\nReady to work together? hello@skillsprint.com`,
  'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6d28d9, #ec4899); -webkit-background-clip: text; color: transparent; padding: 10px;',
  'font-size: 12px; color: #94a3b8;'
);

console.log('%cDesigned & Built with 💜 for brands that dream big', 'font-size: 12px; color: #6d28d9; font-weight: bold;');
