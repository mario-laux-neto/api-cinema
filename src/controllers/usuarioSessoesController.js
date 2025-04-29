import UsuarioSessao from '../models/usuarioSessaoModel.js';  // Importa o modelo de Sessão de Usuário
import Sessao from '../models/sessoesModel.js';  // Importa o modelo de Sessão
import Filme from '../models/filmeModel.js';  // Importa o modelo de Filme
import Sala from '../models/salaModel.js';  // Importa o modelo de Sala
import { Op } from 'sequelize';  // Importa o operador 'Op' do Sequelize, usado para comparações em consultas
import moment from 'moment-timezone';  // Importa o moment.js para manipulação de datas e fusos horários

// Método para cancelar uma sessão de usuário
const cancel = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;  // Extrai o ID da URL e remove caracteres não numéricos

        // Verifica se o ID foi informado
        if (!id) return res.status(400).send('ID da sessão de usuário não informado');

        // Busca a sessão de usuário no banco
        const response = await UsuarioSessao.findOne({ where: { id } });
        if (!response) return res.status(404).send('Sessão de usuário não encontrada');

        // Marca a sessão como cancelada
        response.cancelado = true;
        await response.save();

        return res.status(200).send({
            message: 'Compra de ingresso cancelada com sucesso',
            data: response
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });  // Retorna erro em caso de falha
    }
};

// Método para comprar ingressos
const comprarIngressos = async (req, res) => {
    try {
        const { idLugar } = req.params;  // Extrai o ID do lugar da URL
        const dados = req.body;  // Dados do corpo da requisição

        // Verifica se as informações obrigatórias estão presentes
        if (!dados.idSessao || !dados.idUsuario || !idLugar) {
            return res.status(400).send({ message: 'Informações inválidas' });
        }

        // Busca a sessão no banco
        const sessao = await Sessao.findOne({
            where: { id: dados.idSessao }
        });

        if (!sessao) {
            return res.status(404).send({ message: 'Sessão não encontrada' });
        }

        // Verifica se o lugar solicitado existe na sessão
        const lugar = sessao.lugares.find(l => l.id === Number(idLugar));
        if (!lugar) {
            return res.status(404).send({ message: 'Lugar não encontrado' });
        }

        // Verifica se o lugar já foi vendido
        if (lugar.vendido) {
            return res.status(400).send({ message: 'Lugar já vendido' });
        }

        // Marca o lugar como vendido e associa ao usuário
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
        return res.status(500).send({ message: error.message });  // Retorna erro em caso de falha
    }
};

// Método para listar sessões compradas por um usuário
const listarSessoesCompradas = async (req, res) => {
    const usuarioId = req.params.id;  // Extrai o ID do usuário da URL

    try {
        // Busca as sessões compradas pelo usuário
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

        // Se não houver sessões compradas, retorna uma mensagem de erro
        if (!sessoesCompradas.length) {
            return res.status(404).send({ message: 'Nenhuma sessão comprada encontrada para este usuário.' });
        }

        // Formata os dados das sessões compradas
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

// Método para listar sessões disponíveis
const getSessoesDisponiveis = async (req, res) => {
    try {
        // Busca as sessões futuras
        const sessoes = await Sessao.findAll({
            where: {
                datafim: {
                    [Op.gt]: moment().toDate()  // Só exibe sessões futuras
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

        // Se não houver sessões disponíveis, retorna uma mensagem de erro
        if (!sessoes.length) {
            return res.status(404).send({ message: 'Nenhuma sessão disponível no momento.' });
        }

        // Formata os dados das sessões disponíveis
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
        return res.status(500).send({ message: error.message });  // Retorna erro em caso de falha
    }
};

// Método para gerar o relatório de uma sessão
const relatorioPorSessao = async (req, res) => {
    try {
        const { idSessao } = req.params;  // Recebe o ID da sessão da URL

        // Busca a sessão com o ID fornecido
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

        // Se a sessão não for encontrada, retorna erro
        if (!sessao) {
            return res.status(404).send({ message: 'Sessão não encontrada' });
        }

        // Calcula o total arrecadado e o número de ingressos vendidos
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
                valorArrecadado: valorArrecadado.toFixed(2),  // Exibe o valor arrecadado formatado
            }
        });

    } catch (error) {
        console.error(error);  // Log para depuração
        return res.status(500).send({ message: 'Erro ao gerar relatório da sessão', error: error.message });
    }
};

// Método para obter sessões de usuário, com suporte a filtros
const get = async (req, res) => {
    try {
        const { idsessao } = req.query;

        if (idsessao) {
            // Busca a sessão com o ID fornecido
            const sessao = await Sessao.findOne({ where: { id: idsessao } });
            if (!sessao) {
                return res.status(404).send({ message: 'Sessão não encontrada' });
            }

            // Filtra os lugares livres na sessão
            const lugaresLivres = sessao.lugares.filter(lugar => !lugar.idusuario);

            return res.status(200).send({
                message: 'Lugares livres encontrados',
                data: lugaresLivres
            });
        }

        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await UsuarioSessao.findAll({
                order: [['id', 'desc']],  // Ordena as sessões de usuário por ID em ordem decrescente
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
        return res.status(500).send({ message: error.message });  // Retorna erro em caso de falha
    }
};

// Método para persistir ou atualizar uma sessão de usuário
const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            // Cria uma nova sessão de usuário caso o ID não seja fornecido
            const response = await create(req.body);
            return res.status(201).send({
                message: 'Sessão de usuário criada com sucesso',
                data: response
            });
        }

        // Atualiza uma sessão de usuário existente
        const response = await update(req.body, id);
        return res.status(200).send({
            message: 'Sessão de usuário atualizada com sucesso',
            data: response
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });  // Retorna erro em caso de falha
    }
};

// Exporta o controlador com todos os métodos
const usuarioSessoesController = {
    get,
    persist,
    cancel,
    listarSessoesCompradas,
    comprarIngressos,
    getSessoesDisponiveis,
    relatorioPorSessao,  // Método adicionado aqui
};

export default usuarioSessoesController;  // Exporta o controlador para ser utilizado em outras partes da aplicação
