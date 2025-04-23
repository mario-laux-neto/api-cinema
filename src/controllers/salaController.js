import Sala from '../models/salaModel.js';

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await Sala.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Salas encontradas',
                data: response,
            });
        }

        const response = await Sala.findOne({
            where: { id }
        });

        if (!response) {
            return res.status(404).send('Sala não encontrada');
        }

        return res.status(200).send({
            message: 'Sala encontrada',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const create = async (corpo) => {
    try {
        const { idPadraoLugares, observacao } = corpo;

        const response = await Sala.create({
            idPadraoLugares,
            observacao,
        });

        return response;

    } catch (error) {
        throw new Error(error.message);
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Sala.findOne({
            where: { id }
        });

        if (!response) {
            throw new Error('Sala não encontrada');
        }

        Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
        await response.save();
        return response;

    } catch (error) {
        throw new Error(error.message);
    }
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await create(req.body);
            return res.status(201).send({
                message: 'Sala criada com sucesso',
                data: response
            });
        }

        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Sala atualizada com sucesso',
            data: response
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const destroy = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            return res.status(400).send('ID da sala não informado');
        }

        const response = await Sala.findOne({
            where: { id }
        });

        if (!response) {
            return res.status(404).send('Sala não encontrada');
        }
        await response.destroy();

        return res.status(200).send({
            message: 'Sala excluída com sucesso',
            data: response
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

export default {
    get,
    persist,
    destroy,
};
