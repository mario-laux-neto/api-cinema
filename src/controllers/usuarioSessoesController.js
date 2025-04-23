import UsuarioSessao from '../models/usuarioSessaoModel.js';
import Sessao from '../models/sessoesModel.js';



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

const create = async (corpo) => {
    const { idsessao, idusuario, codigoLugar } = corpo;

    const sessao = await Sessao.findOne({ where: { id: idsessao } });
    if (!sessao) throw new Error('Sessão não encontrada');

    const lugares = sessao.lugares;
    const indexLugar = lugares.findIndex(l => l.codigo === codigoLugar);

    if (indexLugar === -1) throw new Error('Lugar não encontrado na sessão');
    if (lugares[indexLugar].idusuario) throw new Error('Lugar já ocupado');

    lugares[indexLugar].idusuario = idusuario;

    await sessao.update({ lugares });

    const novaCompra = await UsuarioSessao.create({
        idsessao,
        idusuario,
        valor_atual: sessao.preco,
        descricao: `Compra para o lugar ${codigoLugar} na sessão ${idsessao}`,
    });

    return novaCompra;
};

const update = async (corpo, id) => {
    try {
        const response = await UsuarioSessao.findOne({ where: { id } });
        if (!response) throw new Error('Sessão de usuário não encontrada');

        Object.keys(corpo).forEach(key => response[key] = corpo[key]);

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

const destroy = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) return res.status(400).send('ID da sessão de usuário não informado');

        const response = await UsuarioSessao.findOne({ where: { id } });
        if (!response) return res.status(404).send('Sessão de usuário não encontrada');

        await response.destroy();

        return res.status(200).send({
            message: 'Sessão de usuário excluída com sucesso',
            data: response
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const usuarioSessoesController = {
    get,
    persist,
    destroy,
};

export default usuarioSessoesController;
