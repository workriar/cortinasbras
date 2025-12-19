const axios = require('axios');

async function test() {
    try {
        const response = await axios.post('http://localhost:3001/api/leads', {
            nome: 'Teste de API',
            telefone: '11999999999',
            largura_parede: '3,50',
            altura_parede: '2,70',
            tecido: 'Linho',
            instalacao: 'Trilho',
            observacoes: 'Teste automatizado'
        });
        console.log('Sucesso:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Erro 500 recebido:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Erro na conexão:', error.message);
        }
    }
}

test();
