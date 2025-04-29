import Sessao from '../models/sessoesModel.js'; // Importa o modelo de sessões.
import Filme from '../models/filmeModel.js'; // Importa o modelo de filmes.
import Sala from '../models/salaModel.js'; // Importa o modelo de salas.

const get = async (req, res) => {
    try {
        // Extrai o id da URL e remove caracteres não numéricos.
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            // Se não houver ID, busca todas as sessões.
            const response = await Sessao.findAll({
                include: [
                    {
                        model: Filme, // Inclui informações do filme associado à sessão.
                        as: 'filme', // Define o alias 'filme' para a associação.
                    },
                    {
                        model: Sala, // Inclui informações da sala associada à sessão.
                        as: 'sala', // Define o alias 'sala' para a associação.
                    }
                ],
                order: [['id', 'desc']], // Ordena as sessões pela ID em ordem decrescente.
            });

            return res.status(200).send({
                message: 'Sessões encontradas',
                data: response, // Retorna as sessões encontradas.
            });
        }

        // Se houver ID, busca a sessão específica.
        const response = await Sessao.findOne({
            where: { id }, // Filtra pela ID da sessão.
            include: [
                {
                    model: Filme, // Inclui o filme associado à sessão.
                    as: 'filme',
                },
                {
                    model: Sala, // Inclui a sala associada à sessão.
                    as: 'sala',
                }
            ]
        });

        if (!response) {
            return res.status(404).send('Sessão não encontrada'); // Retorna erro caso a sessão não seja encontrada.
        }

        return res.status(200).send({
            message: 'Sessão encontrada',
            data: response, // Retorna a sessão encontrada.
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message // Retorna erro caso algo falhe.
        });
    }
};

const create = async (corpo) => {
    try {
        const { idfilme, idsala, lugares, datainicio, datafim, preco } = corpo;

        // Cria uma nova sessão com os dados fornecidos.
        const response = await Sessao.create({
            idfilme,
            idsala,
            lugares,
            datainicio,
            datafim,
            preco,
        });

        return response; // Retorna a sessão criada.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const update = async (corpo, id) => {
    try {
        // Busca a sessão pelo ID.
        const response = await Sessao.findOne({ where: { id } });

        if (!response) {
            throw new Error('Sessão não encontrada'); // Retorna erro caso a sessão não seja encontrada.
        }

        // Atualiza os campos da sessão com os dados fornecidos.
        Object.keys(corpo).forEach((key) => {
            response[key] = corpo[key];
        });

        await response.save(); // Salva as alterações no banco de dados.
        return response; // Retorna a sessão atualizada.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null; // Extrai o ID da URL.

        if (!id) {
            // Se não houver ID, cria uma nova sessão.
            const response = await create(req.body);
            return res.status(201).send({
                message: 'Sessão criada com sucesso',
                data: response // Retorna a sessão criada.
            });
        }

        // Se houver ID, atualiza a sessão existente.
        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Sessão atualizada com sucesso',
            data: response // Retorna a sessão atualizada.
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
            return res.status(400).send('ID da sessão não informado'); // Retorna erro se o ID não for fornecido.
        }

        // Busca a sessão pelo ID.
        const response = await Sessao.findOne({ where: { id } });

        if (!response) {
            return res.status(404).send('Sessão não encontrada'); // Retorna erro caso a sessão não seja encontrada.
        }

        // Exclui a sessão.
        await response.destroy();

        return res.status(200).send({
            message: 'Sessão excluída com sucesso',
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
