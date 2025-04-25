import UsuarioSessao from '../models/usuarioSessaoModel.js';
import Sessao from '../models/sessoesModel.js';
import Filme from '../models/filmeModel.js';
import Sala from '../models/salaModel.js';
import { Op } from 'sequelize';
import moment from 'moment-timezone';

const cancel = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) return res.status(400).send('ID da sessão de usuário não informado');

        const response = await UsuarioSessao.findOne({ where: { id } });
        if (!response) return res.status(404).send('Sessão de usuário não encontrada');

        response.cancelado = true;
        await response.save();

        return res.status(200).send({
            message: 'Compra de ingresso cancelada com sucesso',
            data: response
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const comprarIngressos = async (req, res) => {
    try {
        const { idLugar } = req.params;
        const dados = req.body;

        if (!dados.idSessao || !dados.idUsuario || !idLugar) {
            return res.status(400).send({ message: 'Informações inválidas' });
        }

        const sessao = await Sessao.findOne({
            where: { id: dados.idSessao }
        });

        if (!sessao) {
            return res.status(404).send({ message: 'Sessão não encontrada' });
        }

        const lugar = sessao.lugares.find(l => l.id === Number(idLugar));
        if (!lugar) {
            return res.status(404).send({ message: 'Lugar não encontrado' });
        }

        if (lugar.vendido) {
            return res.status(400).send({ message: 'Lugar já vendido' });
        }

        lugar.vendido = true;
        lugar.idUsuario = dados.idUsuario;

        await sessao.save();

        return res.status(201).send({
            message: 'Ingresso comprado com sucesso',
            data: {
                idSessao: dados.idSessao,
                idUsuario: dados.idUsuario,
                lugar: lugar
            }
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const listarSessoesCompradas = async (req, res) => {
    const usuarioId = req.params.id;

    try {
        const sessoesCompradas = await UsuarioSessao.findAll({
            where: { idusuario: usuarioId },
            include: [
                {
                    model: Sessao,
                    as: 'sessao',
                    attributes: ['datainicio', 'datafim', 'idsala'],
                    include: [
                        {
                            model: Filme,
                            as: 'filme',
                            attributes: ['nome']
                        },
                    ]
                }
            ]
        });

        if (!sessoesCompradas.length) {
            return res.status(404).send({ message: 'Nenhuma sessão comprada encontrada para este usuário.' });
        }

        const resultado = sessoesCompradas.map(item => ({
            filme: item.sessao.filme.nome,
            sala: item.sessao.idsala,
            horario: `${item.sessao.datainicio} - ${item.sessao.datafim}`
        }));

        return res.status(200).send({
            message: 'Sessões compradas encontradas',
            data: resultado
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Erro ao buscar sessões compradas',
            error: error.message
        });
    }
};

const getSessoesDisponiveis = async (req, res) => {
    try {
        const sessoes = await Sessao.findAll({
            where: {
                datafim: {
                    [Op.gt]: moment().toDate() // Só exibe sessões futuras
                }
            },
            include: [
                {
                    model: Filme,
                    as: 'filme',
                    attributes: ['nome']
                },
                {
                    model: Sala,
                    as: 'sala',
                    attributes: ['nome']
                }
            ]
        });

        if (!sessoes.length) {
            return res.status(404).send({ message: 'Nenhuma sessão disponível no momento.' });
        }

        const resultado = sessoes.map(sessao => ({
            filme: sessao.filme.nome,
            sala: sessao.sala.nome,
            horario: `${sessao.datainicio} - ${sessao.datafim}`
        }));

        return res.status(200).send({
            message: 'Sessões disponíveis encontradas',
            data: resultado
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Método para listar o relatório de uma sessão
const relatorioPorSessao = async (req, res) => {
    try {
        const { idSessao } = req.params;  // Recebe o ID da sessão da URL

        // Buscar a sessão com o ID fornecido
        const sessao = await Sessao.findOne({
            where: { id: idSessao },
            include: [
                {
                    model: UsuarioSessao,
                    as: 'usuarios',
                    where: { cancelado: false },  // Exclui as compras canceladas
                    required: false  // Não força a sessão a ter compras
                }
            ]
        });

        if (!sessao) {
            return res.status(404).send({ message: 'Sessão não encontrada' });
        }

        // Calcular o valor total arrecadado e a quantidade de ingressos vendidos
        const assentosVendidos = sessao.usuarios.length;
        const valorArrecadado = assentosVendidos * sessao.preco;

        return res.status(200).send({
            message: 'Relatório da sessão gerado com sucesso',
            data: {
                idSessao: sessao.id,
                nomeFilme: sessao.filme.nome,
                sala: sessao.sala.nome,
                dataSessao: `${sessao.datainicio} - ${sessao.datafim}`,
                assentosVendidos,
                valorArrecadado: valorArrecadado.toFixed(2),  // Formato de valor monetário
            }
        });

    } catch (error) {
        console.error(error); // Log para depuração
        return res.status(500).send({ message: 'Erro ao gerar relatório da sessão', error: error.message });
    }
};

// Resto do controlador
const get = async (req, res) => {
    try {
        const { idsessao } = req.query;

        if (idsessao) {
            const sessao = await Sessao.findOne({ where: { id: idsessao } });
            if (!sessao) {
                return res.status(404).send({ message: 'Sessão não encontrada' });
            }

            const lugaresLivres = sessao.lugares.filter(lugar => !lugar.idusuario);

            return res.status(200).send({
                message: 'Lugares livres encontrados',
                data: lugaresLivres
            });
        }

        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await UsuarioSessao.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Usuários Sessões encontrados',
                data: response,
            });
        }

        const response = await UsuarioSessao.findOne({ where: { id } });

        if (!response) {
            return res.status(404).send('Sessão de usuário não encontrada');
        }

        return res.status(200).send({
            message: 'Sessão de usuário encontrada',
            data: response,
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await create(req.body);
            return res.status(201).send({
                message: 'Sessão de usuário criada com sucesso',
                data: response
            });
        }

        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Sessão de usuário atualizada com sucesso',
            data: response
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const usuarioSessoesController = {
    get,
    persist,
    cancel,
    listarSessoesCompradas,
    comprarIngressos,
    getSessoesDisponiveis,
    relatorioPorSessao,  // Método adicionado aqui
};

export default usuarioSessoesController;
