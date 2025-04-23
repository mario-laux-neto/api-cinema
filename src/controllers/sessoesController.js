import Sessao from '../models/sessoesModel.js';
import Filme from '../models/filmeModel.js';
import Sala from '../models/salaModel.js';

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await Sessao.findAll({
                include: [
                    {
                        model: Filme,
                        as: 'filme',
                    },
                    {
                        model: Sala,
                        as: 'sala',
                    }
                ],
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Sessões encontradas',
                data: response,
            });
        }

        const response = await Sessao.findOne({
            where: { id },
            include: [
                {
                    model: Filme,
                    as: 'filme',
                },
                {
                    model: Sala,
                    as: 'sala',
                }
            ]
        });

        if (!response) {
            return res.status(404).send('Sessão não encontrada');
        }

        return res.status(200).send({
            message: 'Sessão encontrada',
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
        const { idfilme, idsala, lugares, datainicio, datafim, preco } = corpo;

        const response = await Sessao.create({
            idfilme,
            idsala,
            lugares,
            datainicio,
            datafim,
            preco,
        });

        return response;

    } catch (error) {
        throw new Error(error.message);
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Sessao.findOne({ where: { id } });

        if (!response) {
            throw new Error('Sessão não encontrada');
        }

        Object.keys(corpo).forEach((key) => {
            response[key] = corpo[key];
        });

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
                message: 'Sessão criada com sucesso',
                data: response
            });
        }

        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Sessão atualizada com sucesso',
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
            return res.status(400).send('ID da sessão não informado');
        }

        const response = await Sessao.findOne({ where: { id } });

        if (!response) {
            return res.status(404).send('Sessão não encontrada');
        }

        await response.destroy();

        return res.status(200).send({
            message: 'Sessão excluída com sucesso',
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
