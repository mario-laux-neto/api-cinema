import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarioModel.js';

const autenticarUsuario = async (req, res, next) => {
    try {
        const cabecalhoAutorizacao = req.headers.authorization;

        if (!cabecalhoAutorizacao || !cabecalhoAutorizacao.startsWith('Bearer ')) {
            return res.status(401).send({ message: 'Token não informado' });
        }

        const token = cabecalhoAutorizacao.split(' ')[1];

        const dadosToken = jwt.verify(token, process.env.TOKEN_KEY);

        const usuario = await Usuario.findOne({ where: { id: dadosToken.idUsuario } });

        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        req.usuario = usuario;
        next();

    } catch (erro) {
        return res.status(401).send({
            message: 'Token inválido ou expirado',
            erro: erro.message
        });
    }
};

export default autenticarUsuario;
