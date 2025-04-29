import Sala from '../models/salaModel.js'; // Importa o modelo de salas.

const get = async (req, res) => {
    try {
        // Extrai o ID da URL e remove caracteres não numéricos.
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            // Se não houver ID, busca todas as salas.
            const response = await Sala.findAll({
                order: [['id', 'desc']], // Ordena as salas pela ID em ordem decrescente.
            });

            return res.status(200).send({
                message: 'Salas encontradas',
                data: response, // Retorna todas as salas encontradas.
            });
        }

        // Se houver ID, busca a sala específica.
        const response = await Sala.findOne({
            where: { id }, // Filtra pela ID da sala.
        });

        if (!response) {
            return res.status(404).send('Sala não encontrada'); // Retorna erro caso a sala não seja encontrada.
        }

        return res.status(200).send({
            message: 'Sala encontrada',
            data: response, // Retorna a sala encontrada.
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message // Retorna erro caso algo falhe.
        });
    }
};

const create = async (corpo) => {
    try {
        const { idPadraoLugares, observacao } = corpo; // Desestrutura os dados recebidos no corpo da requisição.

        // Cria uma nova sala com os dados fornecidos.
        const response = await Sala.create({
            idPadraoLugares,
            observacao,
        });

        return response; // Retorna a sala criada.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const update = async (corpo, id) => {
    try {
        // Busca a sala pelo ID fornecido.
        const response = await Sala.findOne({
            where: { id }
        });

        if (!response) {
            throw new Error('Sala não encontrada'); // Retorna erro caso a sala não seja encontrada.
        }

        // Atualiza os campos da sala com os dados fornecidos.
        Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
        await response.save(); // Salva as alterações no banco de dados.
        return response; // Retorna a sala atualizada.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null; // Extrai o ID da URL.

        if (!id) {
            // Se não houver ID, cria uma nova sala.
            const response = await create(req.body);
            return res.status(201).send({
                message: 'Sala criada com sucesso',
                data: response // Retorna a sala criada.
            });
        }

        // Se houver ID, atualiza a sala existente.
        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Sala atualizada com sucesso',
            data: response // Retorna a sala atualizada.
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
            return res.status(400).send('ID da sala não informado'); // Retorna erro se o ID não for fornecido.
        }

        // Busca a sala pelo ID.
        const response = await Sala.findOne({
            where: { id }
        });

        if (!response) {
            return res.status(404).send('Sala não encontrada'); // Retorna erro caso a sala não seja encontrada.
        }
        await response.destroy(); // Exclui a sala.

        return res.status(200).send({
            message: 'Sala excluída com sucesso',
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
