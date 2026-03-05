document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current date on banner
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' };
    dateElement.textContent = today.toLocaleDateString('th-TH', options);

    // 2. Set mock date in form
    const mockDate = document.getElementById('mockDate');
    if (mockDate) {
        mockDate.value = "วันนี้ (" + today.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }) + ")";
    }

    // 3. Initialize nav indicator
    setTimeout(() => {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            updateIndicator(activeItem);
        }
    }, 100);

    // 4. Setup 3D Tilt Effect for Banner
    initTiltEffect();

    // 5. Setup Ripple Effects
    setupRippleEffects();
});

let selectedMenuName = "";

// Handle menu card selection
function selectMenu(element) {
    // Save selected menu name for the drawer
    const title = element.querySelector('h4').textContent;
    selectedMenuName = title;

    // Small delay to let ripple animation play before opening
    setTimeout(() => {
        openForm(selectedMenuName);
    }, 150);
}

// Open Drawer function
function openForm(title) {
    const overlay = document.getElementById('formOverlay');
    const drawerTitle = document.getElementById('drawerTitle');

    drawerTitle.textContent = title || "กรอกข้อมูล";
    overlay.classList.add('active');

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

// Close Drawer function
function closeForm() {
    const overlay = document.getElementById('formOverlay');
    overlay.classList.remove('active');

    // Restore background scrolling
    document.body.style.overflow = '';
}

// Close drawer when clicking outside
document.getElementById('formOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closeForm();
    }
});

// Simulate Form Submission
function submitForm() {
    const btn = document.querySelector('.btn-submit');
    const originalContent = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>กำลังประมวลผล...</span>';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.9';

    setTimeout(() => {
        // Success state
        btn.innerHTML = '<i class="fa-solid fa-check-circle" style="font-size: 1.3rem;"></i> <span>บันทึกสำเร็จเปี่ยมคุณภาพ!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btn.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.4)';

        // Add a slight success pop animation
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);

        setTimeout(() => {
            closeForm();
            // Reset button after hiding
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                btn.style.boxShadow = '';
                btn.style.pointerEvents = 'auto';
                btn.style.opacity = '1';
            }, 400);
        }, 1500);
    }, 1500);
}

// Bottom Navigation logic
function switchNav(event, element) {
    event.preventDefault();

    // Remove active class from all
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active to clicked
    element.classList.add('active');

    // Move indicator
    updateIndicator(element);
}

function updateIndicator(element) {
    const indicator = document.querySelector('.active-indicator');
    const nav = document.querySelector('.bottom-nav');

    // Calculate position
    const navRect = nav.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();

    const leftPos = itemRect.left - navRect.left;
    const itemWidth = itemRect.width;

    // Apply styling with spring effect
    indicator.style.width = `${itemWidth}px`;
    indicator.style.left = `${leftPos}px`;
}

// Premium Micro-interactions: 3D Tilt Effect
function initTiltEffect() {
    const card = document.querySelector('.tilt-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8; // Maximum 8 degrees tilt
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
}

// Premium Micro-interactions: Material Ripple Effect
function setupRippleEffects() {
    const createRipple = (event) => {
        const button = event.currentTarget;

        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();

        // If the event is a mouse event, use coordinates, else default to center (for keyboard)
        const x = event.clientX ? event.clientX - rect.left : radius;
        const y = event.clientY ? event.clientY - rect.top : radius;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${x - radius}px`;
        circle.style.top = `${y - radius}px`;
        circle.classList.add('ripple');

        // Dark button gets light ripple, light card gets dark ripple
        if (button.classList.contains('menu-card') || button.classList.contains('nav-item')) {
            circle.style.backgroundColor = 'rgba(79, 70, 229, 0.15)';
        } else {
            circle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        }

        const rippleContainer = button.style.position === 'static' ? button : button;
        if (window.getComputedStyle(rippleContainer).position === 'static') {
            rippleContainer.style.position = 'relative';
        }
        rippleContainer.style.overflow = 'hidden';

        button.appendChild(circle);

        // Clean up
        setTimeout(() => {
            if (circle.parentElement) circle.remove();
        }, 600);
    };

    const selectors = ['.ripple-card', '.ripple-btn', '.ripple-icon'];
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.addEventListener('mousedown', createRipple));
        // Add touchstart for mobile
        elements.forEach(el => el.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            createRipple(mouseEvent);
        }, { passive: true }));
    });
}
