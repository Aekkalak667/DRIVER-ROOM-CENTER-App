document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current date on banner
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' };
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString('th-TH', options);
    }

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
const formOverlay = document.getElementById('formOverlay');
if (formOverlay) {
    formOverlay.addEventListener('click', function (e) {
        if (e.target === this) {
            closeForm();
        }
    });
}

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

    // Apply styling with hardware acceleration (transform)
    indicator.style.width = `${element.offsetWidth}px`;
    indicator.style.transform = `translateY(-50%) translateX(${element.offsetLeft}px) translateZ(0)`;
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

import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============================================
// Employee Management (Admin)
// ============================================

// Add a new employee to Firestore
async function submitNewEmployee() {
    const empId = document.getElementById('admin_emp_id').value.trim();
    const empName = document.getElementById('admin_emp_name').value.trim();

    if (!empId || !empName) {
        alert("กรุณากรอกรหัสพนักงานและชื่อให้ครบถ้วน");
        return;
    }

    try {
        const btn = document.querySelector('.btn-submit');
        const origBtnText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> กำลังบันทึก...';
        btn.disabled = true;

        await addDoc(collection(db, "employees"), {
            empId: empId,
            name: empName,
            createdAt: serverTimestamp()
        });

        // Reset form
        document.getElementById('admin_emp_id').value = '';
        document.getElementById('admin_emp_name').value = '';

        // Reload list
        await loadEmployees();

        btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> บันทึกสำเร็จ';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        setTimeout(() => {
            btn.innerHTML = origBtnText;
            btn.style.background = '';
            btn.disabled = false;
        }, 1500);

    } catch (e) {
        console.error("Error adding document: ", e);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
}

// Load employees from Firestore
async function loadEmployees() {
    const listContainer = document.getElementById('employeeListContainer');
    const countBadge = document.getElementById('emp_count');

    if (!listContainer) return;

    listContainer.innerHTML = '<div style="text-align: center; padding: 20px 0; color: var(--text-muted);"><i class="fa-solid fa-circle-notch fa-spin"></i> กำลังโหลดข้อมูล...</div>';

    try {
        const q = query(collection(db, "employees"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        listContainer.innerHTML = ''; // Clear loading
        let count = 0;

        querySnapshot.forEach((docSnap) => {
            count++;
            const data = docSnap.data();
            const id = docSnap.id;

            const div = document.createElement('div');
            div.className = 'employee-item';
            div.style = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: white; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; margin-bottom: 6px;';
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
                    <div style="width: auto; height: 36px; padding: 0 12px; border-radius: 8px; background: rgba(79, 70, 229, 0.1); display: flex; align-items: center; justify-content: center; color: var(--primary); font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.9rem; letter-spacing: 0.5px;">
                        # ${data.empId}
                    </div>
                    <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <h5 style="margin: 0; font-family: 'Prompt', sans-serif; font-size: 1rem; color: var(--text-main); font-weight: 500;">${data.name}</h5>
                    </div>
                </div>
                <button type="button" onclick="deleteEmployee('${id}')" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; width: 36px; height: 36px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; margin-left: 12px;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            listContainer.appendChild(div);
        });

        countBadge.textContent = `${count} คน`;

        if (count === 0) {
            listContainer.innerHTML = '<div style="text-align: center; padding: 20px 0; color: var(--text-muted);">ยังไม่มีข้อมูลพนักงาน</div>';
        }

    } catch (e) {
        console.error("Error loading documents: ", e);
        listContainer.innerHTML = '<div style="text-align: center; padding: 20px 0; color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> ไม่สามารถโหลดข้อมูลได้</div>';
    }
}

// Delete an employee from Firestore
async function deleteEmployee(docId) {
    if (confirm('คุณต้องการลบข้อมูลพนักงานคนนี้ใช่หรือไม่?')) {
        try {
            await deleteDoc(doc(db, "employees", docId));
            await loadEmployees(); // Reload list after delete
        } catch (e) {
            console.error("Error deleting document: ", e);
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    }
}

// Expose functions to window for HTML onclick access (since this is now a module)
window.selectMenu = selectMenu;
window.openForm = openForm;
window.closeForm = closeForm;
window.submitForm = submitForm;
window.switchNav = switchNav;
window.switchToPage = switchToPage;
window.calculateEvDuration = calculateEvDuration;
window.showStationDetails = showStationDetails;
window.initTiltEffect = initTiltEffect;
window.setupRippleEffects = setupRippleEffects;
window.updateIndicator = updateIndicator;
window.currentPage = currentPage;

// Admin functions
window.submitNewEmployee = submitNewEmployee;
window.loadEmployees = loadEmployees;
window.deleteEmployee = deleteEmployee;
