const dataInicio = new Date('2024-10-29'); // Ajuste para sua data de início

function atualizarTempo() {
    const agora = new Date();
    const diff = agora - dataInicio;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const elementoExperiencia = document.getElementById('tempoExperiencia');
    if (elementoExperiencia) {
        elementoExperiencia.textContent = `Empresa CodiTech - ${dias} dias, ${horas} horas e ${minutos} minutos`;
    }
}

// Inicializa o contador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    atualizarTempo();
    setInterval(atualizarTempo, 60000); // Atualiza a cada minuto
}); 