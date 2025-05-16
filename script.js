document.addEventListener('DOMContentLoaded', function() {
    // Adiciona efeito de fade-in aos cards dos presidentes
    const presidentCards = document.querySelectorAll('.president-card');

    presidentCards.forEach((card, index) => {
        // Adiciona um atraso crescente para cada card
        setTimeout(() => {
            card.classList.add('visible');
        }, 100 * index);

        // Adiciona evento de clique para expandir informações
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    // Adiciona funcionalidade de filtro por período
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const period = this.getAttribute('data-period');

            // Remove classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Adiciona classe ativa ao botão clicado
            this.classList.add('active');

            // Filtra os cards
            presidentCards.forEach(card => {
                if (period === 'todos') {
                    card.style.display = 'block';
                } else {
                    const cardPeriod = card.getAttribute('data-period');
                    card.style.display = (cardPeriod === period) ? 'block' : 'none';
                }
            });
        });
    });

    // Adiciona funcionalidade de pesquisa
    const searchInput = document.getElementById('search-president');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        presidentCards.forEach(card => {
            const presidentName = card.querySelector('h3').textContent.toLowerCase();
            const presidentInfo = card.querySelector('.president-info p:last-child').textContent.toLowerCase();

            if (presidentName.includes(searchTerm) || presidentInfo.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Implementação do modo escuro
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    // Função para alternar o tema
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    // Adiciona evento de mudança ao switch
    toggleSwitch.addEventListener('change', switchTheme);

    // Verifica a preferência salva do usuário
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    // Implementação do modal da linha do tempo
    const modal = document.getElementById('timeline-modal');
    const btn = document.getElementById('timeline-btn');
    const span = document.getElementsByClassName('close')[0];
    let chart = null;

    // Abre o modal quando o botão é clicado
    btn.addEventListener('click', function() {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
            createTimelineChart();
        }, 10);
    });

    // Fecha o modal quando o X é clicado
    span.addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    // Fecha o modal quando o usuário clica fora dele
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });

    // Cria o gráfico da linha do tempo
    function createTimelineChart() {
        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('timeline-chart').getContext('2d');

        // Dados dos presidentes para o gráfico
        const presidentes = [
            { nome: 'Deodoro da Fonseca', inicio: 1889, fim: 1891 },
            { nome: 'Floriano Peixoto', inicio: 1891, fim: 1894 },
            { nome: 'Prudente de Morais', inicio: 1894, fim: 1898 },
            { nome: 'Campos Sales', inicio: 1898, fim: 1902 },
            { nome: 'Rodrigues Alves', inicio: 1902, fim: 1906 },
            { nome: 'Getúlio Vargas', inicio: 1930, fim: 1945 },
            { nome: 'Eurico Gaspar Dutra', inicio: 1946, fim: 1951 },
            { nome: 'Getúlio Vargas', inicio: 1951, fim: 1954 },
            { nome: 'Juscelino Kubitschek', inicio: 1956, fim: 1961 },
            { nome: 'Jânio Quadros', inicio: 1961, fim: 1961 },
            { nome: 'João Goulart', inicio: 1961, fim: 1964 },
            { nome: 'Castelo Branco', inicio: 1964, fim: 1967 },
            { nome: 'Costa e Silva', inicio: 1967, fim: 1969 },
            { nome: 'Emílio Médici', inicio: 1969, fim: 1974 },
            { nome: 'Ernesto Geisel', inicio: 1974, fim: 1979 },
            { nome: 'João Figueiredo', inicio: 1979, fim: 1985 },
            { nome: 'José Sarney', inicio: 1985, fim: 1990 },
            { nome: 'Fernando Collor', inicio: 1990, fim: 1992 },
            { nome: 'Itamar Franco', inicio: 1992, fim: 1995 },
            { nome: 'Fernando Henrique Cardoso', inicio: 1995, fim: 2003 },
            { nome: 'Luiz Inácio Lula da Silva', inicio: 2003, fim: 2011 },
            { nome: 'Dilma Rousseff', inicio: 2011, fim: 2016 },
            { nome: 'Michel Temer', inicio: 2016, fim: 2019 },
            { nome: 'Jair Bolsonaro', inicio: 2019, fim: 2023 },
            { nome: 'Luiz Inácio Lula da Silva', inicio: 2023, fim: 2026 }
        ];

        // Prepara os dados para o gráfico
        const labels = presidentes.map(p => p.nome + ' (' + p.inicio + '-' + p.fim + ')');
        const data = presidentes.map(p => p.fim - p.inicio);
        const backgroundColors = presidentes.map((p, i) => {
            if (p.inicio >= 1964 && p.fim <= 1985) {
                return 'rgba(255, 99, 132, 0.7)'; // Vermelho para ditadura
            } else if (p.inicio >= 1985) {
                return 'rgba(54, 162, 235, 0.7)'; // Azul para Nova República
            } else if (p.inicio >= 1930) {
                return 'rgba(255, 206, 86, 0.7)'; // Amarelo para Era Vargas
            } else {
                return 'rgba(75, 192, 192, 0.7)'; // Verde para República Velha
            }
        });

        // Cria o gráfico
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Duração do Mandato (anos)',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(c => c.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Anos no poder'
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 45
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Duração dos Mandatos Presidenciais',
                        font: {
                            size: 18
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const presidente = presidentes[context.dataIndex];
                                return `${presidente.nome}: ${context.raw} anos (${presidente.inicio}-${presidente.fim})`;
                            }
                        }
                    }
                }
            }
        });
    }
});
