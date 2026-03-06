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
let selectedMenuId = "";

// Handle menu card selection
function selectMenu(element) {
    // Save selected menu name and data-menu id
    const title = element.querySelector('h4').textContent;
    const menuId = element.getAttribute('data-menu');
    selectedMenuName = title;
    selectedMenuId = menuId;

    // Small delay to let ripple animation play before opening
    setTimeout(() => {
        openForm(selectedMenuName, selectedMenuId);
    }, 150);
}

// Open Drawer function - now loads content dynamically
async function openForm(title, menuId) {
    const overlay = document.getElementById('formOverlay');
    const drawerTitle = document.getElementById('drawerTitle');
    const formContent = document.getElementById('formContent');

    drawerTitle.textContent = title || "กรอกข้อมูล";
    overlay.classList.add('active');

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    // Show loading spinner
    formContent.innerHTML = '<div style="text-align: center; padding: 40px 0; color: var(--text-muted);"><i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 12px;"></i><p>กำลังโหลด...</p></div>';

    // Load page content dynamically
    try {
        const response = await fetch('pages/' + menuId + '.html');
        if (response.ok) {
            formContent.innerHTML = await response.text();
        } else {
            formContent.innerHTML = '<div style="text-align: center; padding: 40px 0; color: var(--text-muted);"><i class="fa-solid fa-circle-exclamation" style="font-size: 2rem; margin-bottom: 12px;"></i><p>ไม่พบหน้านี้</p></div>';
        }
    } catch (err) {
        formContent.innerHTML = '<div style="text-align: center; padding: 40px 0; color: var(--text-muted);"><i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 12px;"></i><p>เกิดข้อผิดพลาดในการโหลด</p></div>';
    }
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

    // Apply styling with hardware acceleration (transform)
    indicator.style.width = `${itemWidth}px`;
    indicator.style.transform = `translateY(-50%) translateX(${leftPos}px) translateZ(0)`;
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
    const createRipple = function (event) {
        const button = event.currentTarget || this;

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
        elements.forEach(el => el.addEventListener('touchstart', function (e) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            createRipple.call(this, mouseEvent);
        }, { passive: true }));
    });
}

// EV Charge form real-time calculation
function calculateEvDuration() {
    const startInput = document.getElementById('ev_start_time');
    const endInput = document.getElementById('ev_end_time');
    const durationDisplay = document.getElementById('ev_duration');

    if (!startInput || !endInput || !durationDisplay) return;

    if (startInput.value && endInput.value) {
        const startParts = startInput.value.split(':');
        const endParts = endInput.value.split(':');

        let startMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        let endMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        // Handle cross-midnight calculations
        if (endMins < startMins) {
            endMins += 24 * 60;
        }

        const diffMins = endMins - startMins;
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        if (hours > 0 && mins > 0) {
            durationDisplay.value = `${hours} ชั่วโมง ${mins} นาที`;
        } else if (hours > 0) {
            durationDisplay.value = `${hours} ชั่วโมง`;
        } else if (mins > 0) {
            durationDisplay.value = `${mins} นาที`;
        } else {
            durationDisplay.value = `0 นาที (เวลาเท่ากัน)`;
        }
    } else {
        durationDisplay.value = '';
    }
}

// EV Charge: Show/hide station details based on dropdown selection
function showStationDetails(stationValue) {
    // Hide all station detail sections
    const allStations = document.querySelectorAll('[id^="station_"]');
    allStations.forEach(el => {
        el.style.display = 'none';
    });

    // Clear any previously selected radio buttons
    const radios = document.querySelectorAll('input[name="ev_station_type"]');
    radios.forEach(r => r.checked = false);

    // Show the selected station details
    if (stationValue) {
        const target = document.getElementById('station_' + stationValue);
        if (target) {
            target.style.display = 'block';
            target.style.animation = 'fadeInUp 0.4s ease both';
        }
    }
}

// ============================================
// Unified Page Transition System (3-page carousel)
// Pages: 0=Home, 1=Notification, 2=Profile
// ============================================
let currentPage = 0;

function switchToPage(targetPage) {
    if (targetPage === currentPage) return;

    const appContainer = document.querySelector('.app-container');
    const pages = [
        null, // Page 0 = app-container (handled separately)
        document.getElementById('notificationOverlay'),
        document.getElementById('profileOverlay')
    ];

    const goingRight = targetPage > currentPage; // target is to the right

    // --- Hide current page ---
    if (currentPage === 0) {
        // Home page slides away
        appContainer.classList.add(goingRight ? 'off-left' : 'off-right');
    } else {
        const currentOverlay = pages[currentPage];
        if (currentOverlay) {
            currentOverlay.classList.remove('page-active');
            currentOverlay.classList.add(goingRight ? 'off-left' : 'off-right');
        }
    }

    // --- Show target page ---
    if (targetPage === 0) {
        // Coming back to home
        appContainer.classList.remove('off-left', 'off-right');
        document.body.style.overflow = '';
    } else {
        const targetOverlay = pages[targetPage];
        if (targetOverlay) {
            // Position it on the correct side first (instant), then animate in
            targetOverlay.classList.remove('off-left', 'off-right');
            targetOverlay.classList.add(goingRight ? 'off-right' : 'off-left');

            // Force reflow to apply the starting position before animating
            targetOverlay.offsetHeight;

            targetOverlay.classList.remove('off-left', 'off-right');
            targetOverlay.classList.add('page-active');
            document.body.style.overflow = 'hidden';
        }
    }

    currentPage = targetPage;
}
