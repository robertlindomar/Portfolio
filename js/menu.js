document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os botões e pratos
    const dayButtons = document.querySelectorAll('.day-button');
    const menuItems = document.querySelectorAll('.menu-item');

    // Função para mostrar pratos do dia selecionado
    function showDayMenu(selectedDay) {
        // Atualiza os botões
        dayButtons.forEach(button => {
            if (button.dataset.day === selectedDay) {
                button.classList.remove('bg-gray-400');
                button.classList.add('bg-orange-600');
            } else {
                button.classList.remove('bg-orange-600');
                button.classList.add('bg-gray-400');
            }
        });

        // Mostra/esconde os pratos
        menuItems.forEach(item => {
            if (item.dataset.day === selectedDay) {
                item.classList.remove('hidden');
                // Adiciona animação de fade
                item.style.opacity = '0';
                item.classList.add('animate-fade-in');
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.classList.add('hidden');
                item.classList.remove('animate-fade-in');
            }
        });
    }

    // Adiciona evento de clique para cada botão
    dayButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedDay = this.dataset.day;
            showDayMenu(selectedDay);
        });
    });

    // Mostra o menu de segunda-feira por padrão
    showDayMenu('segunda');
});

// Adiciona animação de hover nos itens do menu
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseover', function () {
        this.classList.add('scale-102');
        this.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseout', function () {
        this.classList.remove('scale-102');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton.querySelector('i');

    mobileMenuButton.addEventListener('click', function () {
        // Toggle menu visibility
        mobileMenu.classList.toggle('hidden');

        // Toggle menu icon between bars and times (x)
        if (menuIcon.classList.contains('fa-bars')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Fechar menu ao clicar em um link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        });
    });

    // Fechar menu ao rolar a página
    window.addEventListener('scroll', () => {
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Funcionalidade do cardápio
    const dayButtons = document.querySelectorAll('.day-button');
    const menuItems = document.querySelectorAll('.menu-item');

    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            dayButtons.forEach(btn => {
                btn.classList.remove('bg-orange-600');
                btn.classList.add('bg-gray-400');
            });

            // Add active class to clicked button
            button.classList.remove('bg-gray-400');
            button.classList.add('bg-orange-600');

            // Hide all menu items
            menuItems.forEach(item => {
                item.classList.add('hidden');
            });

            // Show menu items for selected day
            const selectedDay = button.getAttribute('data-day');
            document.querySelectorAll(`.menu-item[data-day="${selectedDay}"]`).forEach(item => {
                item.classList.remove('hidden');
            });
        });
    });
});

// Função para rolagem suave
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os links que começam com #
    const links = document.querySelectorAll('a[href^="#"]');

    // Adiciona o evento de clique para cada link
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Previne o comportamento padrão do link

            // Pega o elemento alvo usando o href do link
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Fecha o menu mobile se estiver aberto
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu.classList.contains('block')) {
                mobileMenu.classList.remove('block');
                mobileMenu.classList.add('hidden');
            }

            // Faz a rolagem suave até o elemento
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Adiciona uma classe de destaque temporário (opcional)
            targetElement.classList.add('highlight');
            setTimeout(() => {
                targetElement.classList.remove('highlight');
            }, 2000);
        });
    });

    // Controle do menu mobile
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Controle do menu mobile
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Função para controlar o menu mobile
    menuButton.addEventListener('click', function () {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('block', 'menu-open');
        } else {
            mobileMenu.classList.remove('menu-open');
            mobileMenu.classList.add('menu-close');
            setTimeout(() => {
                mobileMenu.classList.remove('block', 'menu-close');
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    });

    // Função para destacar o item do menu ativo
    function setActiveMenuItem() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        // Obtém a posição atual do scroll
        const currentPos = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Ajuste conforme necessário
            const sectionBottom = sectionTop + section.offsetHeight;

            if (currentPos >= sectionTop && currentPos < sectionBottom) {
                // Remove a classe ativa de todos os links
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                });

                // Adiciona a classe ativa ao link correspondente
                const correspondingLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active-link');
                }
            }
        });
    }

    // Adiciona o evento de scroll para atualizar o menu ativo
    window.addEventListener('scroll', setActiveMenuItem);

    // Chama a função inicialmente para definir o item ativo
    setActiveMenuItem();

    // Rolagem suave para os links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Fecha o menu mobile se estiver aberto
                if (mobileMenu.classList.contains('block')) {
                    mobileMenu.classList.remove('block', 'menu-open');
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');
    
    // Função para atualizar o link ativo baseado na seção visível
    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100; // Offset para melhor detecção

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const targetId = section.getAttribute('id');
                
                mobileLinks.forEach(link => {
                    // Remove a classe ativa de todos os links
                    link.classList.remove('text-orange-600');
                    link.classList.add('text-gray-700');
                    
                    // Adiciona a classe ativa ao link correspondente à seção atual
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.remove('text-gray-700');
                        link.classList.add('text-orange-600');
                    }
                });
            }
        });
    }

    // Atualiza o link ativo quando a página rola
    window.addEventListener('scroll', updateActiveLink);
    
    // Atualiza o link ativo quando a página carrega
    updateActiveLink();
});