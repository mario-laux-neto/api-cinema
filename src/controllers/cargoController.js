import Cargo from '../models/cargoModel.js';

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id) {
            const response = await Cargo.findAll({
                order: [['id', 'desc']],
            });
        
            return res.status(200).send({
                message: 'Cargos encontrados',
                data: response,
            });
        }

        const response = await Cargo.findOne({
            where: {
                id: id
            }
        });

        if(!response) {
            return res.status(404).send('Cargo não encontrado');
        }

        return res.status(200).send({
            message: 'Cargo encontrado',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

const create = async (corpo) => {
    try {
        const { descricao } = corpo;

        const response = await Cargo.create({
            descricao
        });

        return response;

    } catch (error) {
        throw new Error(error.message);
    }
}

const update = async(corpo, id) => {
    try {
        const response = await Cargo.findOne({
            where: {
                id
            }
        });

        if(!response) {
            throw new Error('Cargo não encontrado');
        }
        Object.keys(corpo).forEach((item) => response[item] = corpo[item]);
        await response.save();
        return response;

    } catch (error) {
        throw new Error(error.message);
    }
}

const persist = async(req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id) {
            const response = await create(req.body);
            return res.status(201).send({
                message: 'Cargo criado com sucesso',
                data: response
            });
        }

        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Cargo atualizado com sucesso',
            data: response
        });
        
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

const destroy = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id) {
            return res.status(400).send('ID do cargo não informado');
        }

        const response = await Cargo.findOne({
            where: {
                id
            }
        });

        if(!response) {
            return res.status(404).send('Cargo não encontrado');
        }
        await response.destroy();

        return res.status(200).send({
            message: 'Cargo excluído com sucesso',
            data: response
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
}

export default {
    get,
    persist,
    destroy,
}