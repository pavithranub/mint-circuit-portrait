/* controllers.js – Sticky chip bench, tab switching, pin legends, pulses */
export function initControllers() {
  const tabs   = document.querySelectorAll('.ctrl-tab');
  const panels = document.querySelectorAll('.ctrl-panel');
  const chipImg = document.querySelector('.chip-img-wrap img');
  const badge   = document.querySelector('.chip-badge');

  // CSS filter per controller to tint the base chip image
  const controllerData = {
    stm32: {
      filter: 'hue-rotate(200deg) saturate(1.2) brightness(1.1)',
      badge:  'STM32F103',
      color:  '#4a90d9',
    },
    esp32: {
      filter: 'hue-rotate(130deg) saturate(1.5) brightness(1.0)',
      badge:  'ESP32-WROOM',
      color:  '#6fe3c1',
    },
    pic: {
      filter: 'hue-rotate(300deg) saturate(0.8) brightness(1.2)',
      badge:  'PIC16F877A',
      color:  '#d6a933',
    },
    nuvoton: {
      filter: 'hue-rotate(0deg) saturate(1.2) brightness(0.9)',
      badge:  'Nuvoton M051',
      color:  '#d6b266',
    },
  };

  function activate(id) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.ctrl === id));
    panels.forEach(p => p.classList.toggle('active', p.id === `ctrl-${id}`));
    const d = controllerData[id];
    if (chipImg && d) {
      chipImg.style.filter = d.filter;
      chipImg.style.boxShadow = `0 0 40px ${d.color}44`;
    }
    if (badge && d) badge.textContent = d.badge;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.dataset.ctrl));
    tab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(tab.dataset.ctrl); }
    });
  });

  activate('stm32');
}
