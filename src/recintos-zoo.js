class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] }
        ];

        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(especie, quantidade) {
        const resultado = { erro: null, recintosViaveis: [] };

        // Validação do animal
        if (!this.animais[especie]) {
            resultado.erro = "Animal inválido";
            resultado.recintosViaveis = null;
            return resultado;
        }

        // Validação da quantidade
        if (quantidade <= 0) {
            resultado.erro = "Quantidade inválida";
            resultado.recintosViaveis = null;
            return resultado;
        }

        const animalInfo = this.animais[especie];
        const espacoNecessario = animalInfo.tamanho * quantidade;

        // Verifica recintos viáveis
        this.recintos.forEach(recinto => {
            const espacoOcupado = recinto.animais.reduce((total, a) => total + (a.tamanho * a.quantidade), 0);
            const haCarnivoros = recinto.animais.some(a => this.animais[a.especie].carnivoro);
            const haOutroAnimal = recinto.animais.some(a => a.especie !== especie);
            const espacoDisponivel = recinto.tamanho - espacoOcupado;

            // Verifica se o bioma é exatamente adequado (bioma principal)
            if (!animalInfo.biomas.includes(recinto.bioma.split(' e ')[0])) return;

            // Prioriza recintos vazios e com bioma exatamente correspondente
            if (recinto.animais.length === 0 && espacoDisponivel >= espacoNecessario) {
                resultado.recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoDisponivel - espacoNecessario,
                    tamanhoTotal: recinto.tamanho
                });
                return; // Prioriza recintos vazios
            }

            // Verifica o espaço disponível e adiciona 1 de espaço extra se houver outro animal
            const espacoTotalNecessario = espacoNecessario + (haOutroAnimal ? 1 : 0);
            if (espacoDisponivel < espacoTotalNecessario) return;

            // Carnívoros só podem viver com a própria espécie
            if (animalInfo.carnivoro && haCarnivoros && !recinto.animais.every(a => a.especie === especie)) return;

            // Hipopótamos só convivem com outras espécies em recintos com savana e rio
            if (especie === 'HIPOPOTAMO' && haOutroAnimal && recinto.bioma !== 'savana e rio') return;

            // Macacos não podem ser colocados com carnivoros
            if (especie === 'MACACO' && haCarnivoros) return;

            // Macacos não se sentem confortáveis sozinhos em recintos sem outro animal
            if (especie === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) return;

            // Adiciona recinto viável
            resultado.recintosViaveis.push({
                numero: recinto.numero,
                espacoLivre: espacoDisponivel - espacoTotalNecessario,
                tamanhoTotal: recinto.tamanho
            });
        });

        // Retorna erro se não houver recintos viáveis
        if (resultado.recintosViaveis.length === 0) {
            resultado.erro = "Não há recinto viável";
            resultado.recintosViaveis = null;
        } else {
            resultado.recintosViaveis = resultado.recintosViaveis
                .sort((a, b) => a.numero - b.numero)
                .map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.tamanhoTotal})`);
        }

        return resultado;
    }
}

export { RecintosZoo };
