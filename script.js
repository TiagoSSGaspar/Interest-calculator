document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos do HTML
    const principalInput = document.getElementById('principal');
    const rateInput = document.getElementById('rate');
    const interestTypeSelect = document.getElementById('interest-type');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const rateTimeUnitSelect = document.getElementById('rate-time-unit');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    // --- NOVO: Define a data de início padrão como hoje ---
    const today = new Date().toISOString().split('T')[0];
    startDateInput.value = today;

    calculateBtn.addEventListener('click', () => {
        // Pega os valores dos inputs
        const principal = parseFloat(principalInput.value);
        const rate = parseFloat(rateInput.value) / 100;
        const startDateValue = startDateInput.value;
        const endDateValue = endDateInput.value;
        const interestType = interestTypeSelect.value;
        const rateTimeUnit = rateTimeUnitSelect.value;
        
        // Validação dos inputs
        if (isNaN(principal) || isNaN(rate) || principal <= 0 || rate < 0) {
            alert('Por favor, insira um valor principal e uma taxa válidos.');
            return;
        }
        if (!startDateValue || !endDateValue) {
            alert('Por favor, selecione a data de início e a data de fim.');
            return;
        }
        
        const startDate = new Date(startDateValue);
        const endDate = new Date(endDateValue);

        if (endDate <= startDate) {
            alert('A data de fim deve ser posterior à data de início.');
            return;
        }

        // --- LÓGICA DE CONVERSÃO ---
        
        // 1. Calcula o PERÍODO exato em dias entre as datas
        const diffTime = endDate.getTime() - startDate.getTime();
        const timeInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 2. Converte a TAXA para uma taxa diária equivalente (lógica inalterada)
        let dailyRate = rate;
        if (interestType === 'simple') {
            if (rateTimeUnit === 'monthly') {
                dailyRate = rate / 30; // Mês comercial
            } else if (rateTimeUnit === 'yearly') {
                dailyRate = rate / 365; // Ano comercial
            }
        } else { // interestType === 'compound'
            if (rateTimeUnit === 'monthly') {
                dailyRate = Math.pow(1 + rate, 1 / 30) - 1;
            } else if (rateTimeUnit === 'yearly') {
                dailyRate = Math.pow(1 + rate, 1 / 365) - 1;
            }
        }

        // --- CÁLCULO FINAL ---
        let totalAmount = 0;
        if (interestType === 'simple') {
            totalAmount = principal * (1 + dailyRate * timeInDays);
        } else { // 'compound'
            totalAmount = principal * Math.pow(1 + dailyRate, timeInDays);
        }
        
        const totalInterest = totalAmount - principal;
        
        displayResult(principal, totalInterest, totalAmount, timeInDays);
    });

    function displayResult(principal, interest, amount, days) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Resultado do Cálculo:</h3>
            <p>Valor Principal: <span>${principal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
            <p>Período Calculado: <span>${days} dia(s)</span></p>
            <p>Total de Juros: <span>${interest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
            <p>Montante Final: <span>${amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
        `;
    }
});
