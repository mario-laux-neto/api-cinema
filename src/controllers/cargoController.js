// Importa o modelo Cargo para interagir com o banco de dados
import Cargo from '../models/cargoModel.js';

// Função para obter os cargos (um específico ou todos)
const get = async (req, res) => {
    try {
        // Obtém o ID dos parâmetros da URL e remove qualquer caractere não numérico
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        // Se o ID não for fornecido, retorna todos os cargos
        if(!id) {
            const response = await Cargo.findAll({
                order: [['id', 'desc']], // Ordena os cargos pelo ID de forma decrescente
            });
        
            return res.status(200).send({
                message: 'Cargos encontrados',
                data: response, // Retorna os cargos encontrados
            });
        }

        // Caso o ID seja fornecido, tenta encontrar um cargo específico
        const response = await Cargo.findOne({
            where: {
                id: id // Busca o cargo com o ID informado
            }
        });

        // Se o cargo não for encontrado, retorna erro 404
        if(!response) {
            return res.status(404).send('Cargo não encontrado');
        }

        // Caso o cargo seja encontrado, retorna as informações do cargo
        return res.status(200).send({
            message: 'Cargo encontrado',
            data: response,
        });

    } catch (error) {
        // Caso ocorra algum erro durante a execução, retorna o erro 500
        return res.status(500).send({
            message: error.message
        });
    }
}

// Função para criar um novo cargo
const create = async (corpo) => {
    try {
        // Extrai a descrição do cargo do corpo da requisição
        const { descricao } = corpo;

        // Cria um novo cargo no banco de dados com a descrição fornecida
        const response = await Cargo.create({
            descricao
        });

        return response; // Retorna o cargo criado

    } catch (error) {
        // Se ocorrer um erro durante a criação, lança o erro
        throw new Error(error.message);
    }
}

// Função para atualizar um cargo existente
const update = async(corpo, id) => {
    try {
        // Busca o cargo pelo ID fornecido
        const response = await Cargo.findOne({
            where: {
                id
            }
        });

        // Se o cargo não for encontrado, lança um erro
        if(!response) {
            throw new Error('Cargo não encontrado');
        }

        // Atualiza o cargo com os novos dados fornecidos no corpo da requisição
        Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
        await response.save(); // Salva as alterações no banco de dados
        return response; // Retorna o cargo atualizado

    } catch (error) {
        // Se ocorrer um erro durante a atualização, lança o erro
        throw new Error(error.message);
    }
}

// Função para decidir se vai criar ou atualizar um cargo
const persist = async(req, res) => {
    try {
        // Obtém o ID dos parâmetros da URL e remove qualquer caractere não numérico
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        // Se o ID não for fornecido, cria um novo cargo
        if(!id) {
            const response = await create(req.body); // Chama a função create para criar um novo cargo
            return res.status(201).send({
                message: 'Cargo criado com sucesso',
                data: response // Retorna o cargo criado
            });
        }

        // Se o ID for fornecido, atualiza o cargo existente
        const response = await update(req.body, id); // Chama a função update para atualizar o cargo
        return res.status(200).send({
            message: 'Cargo atualizado com sucesso',
            data: response // Retorna o cargo atualizado
        });
        
    } catch (error) {
        // Se ocorrer um erro durante a operação de criação ou atualização, retorna o erro
        return res.status(500).send({
            message: error.message
        });
    }
}

// Função para excluir um cargo
const destroy = async (req, res) => {
    try {
        // Obtém o ID dos parâmetros da URL e remove qualquer caractere não numérico
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        // Se o ID não for informado, retorna erro 400
        if(!id) {
            return res.status(400).send('ID do cargo não informado');
        }

        // Busca o cargo pelo ID fornecido
        const response = await Cargo.findOne({
            where: {
                id
            }
        });

        // Se o cargo não for encontrado, retorna erro 404
        if(!response) {
            return res.status(404).send('Cargo não encontrado');
        }

        // Exclui o cargo encontrado
        await response.destroy();

        // Retorna uma mensagem de sucesso após a exclusão
        return res.status(200).send({
            message: 'Cargo excluído com sucesso',
            data: response
        });

    } catch (error) {
        // Se ocorrer um erro durante a exclusão, retorna o erro
        return res.status(500).send({
            message: error.message
        });
    }
}

// Exporta as funções para serem utilizadas nas rotas
export default {
    get,
    persist,
    destroy,
}
