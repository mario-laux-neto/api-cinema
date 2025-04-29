import PadraoLugares from '../models/padraoLugaresModel.js'; // Importa o modelo de Padrão de Lugares.

const get = async (req, res) => {
    try {
        // Extrai o ID da URL e remove caracteres não numéricos.
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            // Se não houver ID, busca todos os padrões de lugares.
            const response = await PadraoLugares.findAll({
                order: [['id', 'desc']], // Ordena os padrões de lugares pela ID em ordem decrescente.
            });

            return res.status(200).send({
                message: 'Padrões de Lugares encontrados',
                data: response, // Retorna todos os padrões de lugares encontrados.
            });
        }

        // Se houver ID, busca o padrão de lugar específico.
        const response = await PadraoLugares.findOne({
            where: { id }, // Filtra pelo ID do padrão de lugar.
        });

        if (!response) {
            return res.status(404).send('Padrão de Lugar não encontrado'); // Retorna erro caso o padrão de lugar não seja encontrado.
        }

        return res.status(200).send({
            message: 'Padrão de Lugar encontrado',
            data: response, // Retorna o padrão de lugar encontrado.
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message // Retorna erro caso algo falhe.
        });
    }
};

const create = async (corpo) => {
    try {
        const { lugares } = corpo; // Desestrutura os dados recebidos no corpo da requisição.

        // Cria um novo padrão de lugar com os dados fornecidos.
        const response = await PadraoLugares.create({
            lugares,
        });

        return response; // Retorna o padrão de lugar criado.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const update = async (corpo, id) => {
    try {
        // Busca o padrão de lugar pelo ID fornecido.
        const response = await PadraoLugares.findOne({
            where: { id }
        });

        if (!response) {
            throw new Error('Padrão de Lugar não encontrado'); // Retorna erro caso o padrão de lugar não seja encontrado.
        }

        // Atualiza os campos do padrão de lugar com os dados fornecidos.
        Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
        await response.save(); // Salva as alterações no banco de dados.
        return response; // Retorna o padrão de lugar atualizado.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null; // Extrai o ID da URL.

        if (!id) {
            // Se não houver ID, cria um novo padrão de lugar.
            const response = await create(req.body);
            return res.status(201).send({
                message: 'Padrão de Lugar criado com sucesso',
                data: response // Retorna o padrão de lugar criado.
            });
        }

        // Se houver ID, atualiza o padrão de lugar existente.
        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Padrão de Lugar atualizado com sucesso',
            data: response // Retorna o padrão de lugar atualizado.
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message // Retorna erro caso algo falhe.
        });
    }
};

const destroy = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null; // Extrai o ID da URL.

        if (!id) {
            return res.status(400).send('ID do Padrão de Lugar não informado'); // Retorna erro se o ID não for fornecido.
        }

        // Busca o padrão de lugar pelo ID.
        const response = await PadraoLugares.findOne({
            where: { id }
        });

        if (!response) {
            return res.status(404).send('Padrão de Lugar não encontrado'); // Retorna erro caso o padrão de lugar não seja encontrado.
        }
        await response.destroy(); // Exclui o padrão de lugar.

        return res.status(200).send({
            message: 'Padrão de Lugar excluído com sucesso',
            data: response // Retorna a confirmação da exclusão.
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message // Retorna erro caso algo falhe.
        });
    }
};

export default {
    get,
    persist,
    destroy,
};
