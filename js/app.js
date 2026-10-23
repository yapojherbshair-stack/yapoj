/**
 * YAPOJ - AYURVEDIC HAIR OIL - Interactive Features
 * Modern, accessible client-side logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initDoctorLeadForm();
  initHairStageDiagnostic();
  initDemoTabs();
  initFaqAccordion();
  initCountdownTimer();
  initSmoothScrolls();
});

/* ==========================================================================
   1. Interactive Before & After Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('beforeAfterSlider');
  if (!container) return;

  const handle = container.querySelector('.slider-handle');
  if (!handle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;
    let percentage = (posX / rect.width) * 100;

    // Clamp between 5% and 95%
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;

    container.style.setProperty('--slider-pos', `${percentage}%`);
    container.setAttribute('aria-valuenow', Math.round(percentage));
  }

  // Pointer / Mouse events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events for mobile/tablet
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches && e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keyboard accessibility
  container.setAttribute('tabindex', '0');
  container.setAttribute('role', 'slider');
  container.setAttribute('aria-label', 'Before and After Hair Regrowth Comparison');
  container.setAttribute('aria-valuenow', '50');

  container.addEventListener('keydown', (e) => {
    let currentPct = parseFloat(getComputedStyle(container).getPropertyValue('--slider-pos')) || 50;
    if (e.key === 'ArrowLeft') {
      currentPct = Math.max(5, currentPct - 5);
      container.style.setProperty('--slider-pos', `${currentPct}%`);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      currentPct = Math.min(95, currentPct + 5);
      container.style.setProperty('--slider-pos', `${currentPct}%`);
      e.preventDefault();
    }
  });
}

/* ==========================================================================
   2. Doctor Consultation Lead Form & Modal
   ========================================================================== */
function initDoctorLeadForm() {
  const form = document.getElementById('doctorCallbackForm');
  const modal = document.getElementById('doctorModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalUserPhone = document.getElementById('modalUserPhone');
  const modalUserConcern = document.getElementById('modalUserConcern');
  const whatsappBtn = document.getElementById('modalWhatsAppBtn');

  if (!form || !modal) return;

  // Phone number numeric filtering
  const phoneInput = document.getElementById('userPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      // Allow only numbers and leading +
      let val = e.target.value;
      if (val.startsWith('+')) {
        val = '+' + val.substring(1).replace(/\D/g, '');
      } else {
        val = val.replace(/\D/g, '');
      }
      e.target.value = val;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName')?.value.trim() || 'Valued Customer';
    const phone = document.getElementById('userPhone')?.value.trim();
    const concernSelect = document.getElementById('hairConcern');
    const concern = concernSelect?.options[concernSelect.selectedIndex]?.text || 'Hair Thinning & Regrowth';

    if (!phone || phone.length < 8) {
      alert('Please enter a valid phone number so our team can reach you.');
      phoneInput?.focus();
      return;
    }

    // Build WhatsApp message with customer details
    const waMsg = encodeURIComponent(
      `Hello! I am interested in YAPOJ Ayurvedic Hair Oil.\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Hair Concern:* ${concern}\n\n` +
      `Please guide me on the right product and dosage.`
    );
    const waUrl = `https://wa.me/919494056908?text=${waMsg}`;

    // Directly redirect to WhatsApp
    window.open(waUrl, '_blank');

    // Also update modal button for reference
    if (whatsappBtn) {
      whatsappBtn.href = waUrl;
    }

    // Update modal info & show it
    if (modalUserPhone) modalUserPhone.textContent = phone;
    if (modalUserConcern) modalUserConcern.textContent = concern;
    openModal(modal);

    // Visual feedback on submit button
    const submitBtn = form.querySelector('.btn-submit-callback');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>✓ Connecting on WhatsApp...</span>`;
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 4000);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }

  // Click outside to dismiss
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  // Escape key to dismiss
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal(modal);
    }
  });
}

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   3. Hair Condition Stage Diagnostic Tool
   ========================================================================== */
function initHairStageDiagnostic() {
  const stageButtons = document.querySelectorAll('.stage-btn');
  const diagTitle = document.getElementById('diagTitle');
  const diagDesc = document.getElementById('diagDesc');
  const diagDuration = document.getElementById('diagDuration');
  const diagAction = document.getElementById('diagAction');
  const diagTriggerBtn = document.getElementById('diagTriggerBtn');

  if (!stageButtons.length) return;

  const stageData = {
    'stage1': {
      title: 'Stage 1: Early Thinning & Excessive Daily Shedding',
      desc: 'Hair strands are becoming noticeably finer, and you lose more than 100 strands per day during washing or brushing. Follicles are entering an early miniaturization phase caused by environmental toxins and initial DHT sensitivity.',
      duration: 'Recommended Therapy: 60 Days (2 Bottles)',
      action: 'Targeted Follicle Detox + Root Reinforcement',
      concernValue: 'hair_fall'
    },
    'stage2': {
      title: 'Stage 2: Widening Hair Parting & Temple Recession',
      desc: 'Clear recession at the M-line or widening central scalp parting. The scalp skin starts reflecting light under overhead lamps. Dormant follicles are still alive but starved of blood circulation.',
      duration: 'Recommended Therapy: 90 Days (Complete 3-Bottle Regrowth Kit)',
      action: 'Micro-circulation Awakening + Dermal Papilla Stimulation',
      concernValue: 'receding_hairline'
    },
    'stage3': {
      title: 'Stage 3: Crown Vertex Thinning & Visible Scalp Patches',
      desc: 'A distinct coin-sized or larger circular thinning zone on the crown or vertex. Hair roots are in deep telogen sleep. Requires potent cold-infused Bhringraj and Rosemary to restart active anagen growth.',
      duration: 'Recommended Therapy: 90 to 120 Days (3-Bottle Intensive Pack)',
      action: 'Intensive Follicular Revival + DHT Deactivation',
      concernValue: 'crown_thinning'
    },
    'stage4': {
      title: 'Stage 4: Advanced Hairline Recession & Broad Thinning',
      desc: 'Both temples and crown show extensive thinning, beginning to merge. Follicles have been dormant for over 12 months. Requires our doctor-guided scalp massage protocol alongside nightly elixir application.',
      duration: 'Recommended Therapy: 180 Days (Full Restoration Course)',
      action: 'Complete Scalp Cellular Regeneration + Doctor Care',
      concernValue: 'bald_patches'
    },
    'stage5': {
      title: 'Stage 5: Chronic Stubborn Alopecia & Prolonged Loss',
      desc: 'Long-standing smooth patches or severe thinning across the entire crown. Requires a certified trichologist one-on-one video diagnosis to assess follicle viability before therapy.',
      duration: 'Recommended Therapy: 180+ Days Doctor Supervised Plan',
      action: 'Personalized Clinical Regrowth Plan & Weekly Follow-ups',
      concernValue: 'alopecia'
    }
  };

  stageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      stageButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const stageKey = btn.dataset.stage;
      const data = stageData[stageKey];

      if (data) {
        if (diagTitle) diagTitle.textContent = data.title;
        if (diagDesc) diagDesc.textContent = data.desc;
        if (diagDuration) diagDuration.textContent = data.duration;
        if (diagAction) diagAction.textContent = data.action;

        // Update consultation trigger button
        if (diagTriggerBtn) {
          diagTriggerBtn.textContent = `Get Doctor Advice for ${btn.querySelector('.stage-label')?.textContent || 'This Stage'}`;
          diagTriggerBtn.onclick = () => {
            // Pre-select concern in hero form
            const concernSelect = document.getElementById('hairConcern');
            if (concernSelect) {
              concernSelect.value = data.concernValue;
            }
            // Scroll to hero form
            const formCard = document.getElementById('doctorCallbackForm');
            if (formCard) {
              formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              document.getElementById('userPhone')?.focus();
            }
          };
        }
      }
    });
  });
}

/* ==========================================================================
   4. Product Demo Tabs
   ========================================================================== */
function initDemoTabs() {
  const tabs = document.querySelectorAll('.demo-tab-btn');
  const panels = document.querySelectorAll('.demo-tab-content');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. Interactive FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others for clean accordion experience
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Dynamic Doctor Callback Countdown Timer
   ========================================================================== */
function initCountdownTimer() {
  const timerElem = document.getElementById('callCountdown');
  if (!timerElem) return;

  let totalSeconds = 14 * 60 + 58; // 14 mins 58 secs

  setInterval(() => {
    if (totalSeconds <= 0) {
      timerElem.textContent = 'Doctor is connecting now...';
      return;
    }

    totalSeconds--;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    timerElem.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

/* ==========================================================================
   7. Smooth Scrolling & CTA Triggers
   ========================================================================== */
function initSmoothScrolls() {
  const consultationTriggers = document.querySelectorAll('.trigger-consultation');
  const heroForm = document.getElementById('doctorCallbackForm');
  const phoneInput = document.getElementById('userPhone');

  consultationTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (heroForm) {
        heroForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          phoneInput?.focus();
        }, 600);
      }
    });
  });
}
