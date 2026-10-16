(() => {
  const messages = {
    geral: 'Olá! Vim pelo site da Sistemas WS e gostaria de atendimento.',
    orientacao: 'Olá! Vim pelo site da Sistemas WS e gostaria de orientação para escolher um sistema para minha empresa.',
    clipppro: 'Olá! Vim pelo site da Sistemas WS e quero conhecer o ClippPro.',
    zweb: 'Olá! Vim pelo site da Sistemas WS e quero conhecer o ZWeb.',
    gfood: 'Olá! Vim pelo site da Sistemas WS e quero conhecer o Gfood para meu estabelecimento.',
    empresa: 'Olá! Vim pelo site e gostaria de conhecer melhor a Sistemas WS e seu atendimento.'
  };
  const phone = window.WS_CONFIG?.whatsapp || '5566996965492';
  if (!/^\d{12,15}$/.test(phone)) throw new Error('Número de WhatsApp inválido');
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(messages[link.dataset.whatsapp] || messages.geral)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu-principal');
  if (toggle && nav) {
    document.documentElement.classList.add('js');
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
  }
})();

