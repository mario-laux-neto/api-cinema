// Middleware para autenticar o usuário com JWT
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarioModel.js';

const autenticarUsuario = async (req, res, next) => {
    try {
        // Obtém o cabeçalho de autorização da requisição
        const cabecalhoAutorizacao = req.headers.authorization;

        // Verifica se o cabeçalho de autorização existe e começa com "Bearer "
        if (!cabecalhoAutorizacao || !cabecalhoAutorizacao.startsWith('Bearer ')) {
            // Se não, retorna erro 401 (não autorizado) informando que o token não foi fornecido
            return res.status(401).send({ message: 'Token não informado' });
        }

        // Extrai o token do cabeçalho (depois de "Bearer ")
        const token = cabecalhoAutorizacao.split(' ')[1];

        // Verifica e decodifica o token com a chave secreta armazenada em process.env.TOKEN_KEY
        const dadosToken = jwt.verify(token, process.env.TOKEN_KEY);

        // Procura o usuário no banco de dados com base no id extraído do token
        const usuario = await Usuario.findOne({ where: { id: dadosToken.idUsuario } });

        // Se o usuário não for encontrado, retorna erro 404 (não encontrado)
        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        // Se o usuário for encontrado, anexa os dados do usuário à requisição
        req.usuario = usuario;

        // Chama o próximo middleware ou a rota
        next();

    } catch (erro) {
        // Caso ocorra um erro, retorna erro 401 com a mensagem de token inválido ou expirado
        return res.status(401).send({
            message: 'Token inválido ou expirado',
            erro: erro.message
        });
    }
};

export default autenticarUsuario;
