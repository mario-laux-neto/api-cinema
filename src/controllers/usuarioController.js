import Usuario from '../models/usuarioModel.js';
import Cargo from '../models/cargoModel.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomInt } from 'crypto';
import sendMail from '../utils/email.js';

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if (!id) {
            const response = await Usuario.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados encontrados',
                data: response,
            });
        }

        const response = await Usuario.findOne({ where: { id } });

        if (!response) {
            return res.status(404).send('Usuário não encontrado');
        }

        return res.status(200).send({
            message: 'Dados encontrados',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const create = async (corpo) => {
    try {
        const {
            nome,
            cpf,
            email,
            password,
            estudante,
            idCargo
        } = corpo;

        const verificarEmail = await Usuario.findOne({ where: { email } });

        if (verificarEmail) {
            throw new Error('Já existe um usuário com esse email');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const response = await Usuario.create({
            nome,
            cpf,
            email,
            estudante,
            idCargo,
            password: passwordHash
        });

        return response;

    } catch (error) {
        throw new Error(error.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            return res.status(400).send({
                message: 'Usuário ou senha incorretos'
            });
        }

        const comparacaoSenha = await bcrypt.compare(password, user.password);

        if (comparacaoSenha) {
            const token = jwt.sign({
                idUsuario: user.id,
                nome: user.nome,
                email: user.email,
                idCargo: user.idCargo
            }, process.env.TOKEN_KEY, { expiresIn: '8h' });

            return res.status(200).send({
                message: 'Sucesso!',
                response: token
            });
        } else {
            return res.status(400).send({
                message: 'Usuário ou senha incorretos'
            });
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const getDataByToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).send({ message: 'Token não informado' });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        const user = await Usuario.findOne({
            where: { id: decoded.idUsuario },
            include: [
                {
                    model: Cargo,
                    as: 'cargo'
                }
            ]
        });

        if (!user) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        return res.status(200).send({
            message: 'Usuário e cargo encontrados com sucesso',
            data: user
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                message: 'Token expirado, por favor faça login novamente'
            });
        }
        return res.status(401).send({
            message: 'Token inválido ou expirado'
        });
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Usuario.findOne({ where: { id } });

        if (!response) {
            throw new Error('Usuário não encontrado');
        }

        Object.keys(corpo).forEach((item) => {
            response[item] = corpo[item];
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
                message: 'Criado com sucesso',
                data: response
            });
        }

        const response = await update(req.body, id);
        return res.status(201).send({
            message: 'Atualizado com sucesso',
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
            return res.status(400).send('ID não informado');
        }

        const response = await Usuario.findOne({ where: { id } });

        if (!response) {
            return res.status(404).send('Usuário não encontrado');
        }

        await response.destroy();

        return res.status(200).send({
            message: 'Registro excluído',
            data: response
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

// >>> NOVAS FUNÇÕES <<<

// Enviar Código de Recuperação
const enviarCodigoRecuperacao = async (req, res) => {
    try {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        const codigo = randomInt(100000, 999999).toString();
        const expiracao = new Date(Date.now() + 30 * 60000); // 30 minutos

        usuario.codigoRecuperacao = codigo;
        usuario.codigoExpira = expiracao;
        await usuario.save();

        const body = `
            <p>Seu código de recuperação de senha é: <b>${codigo}</b></p>
            <p>Este código é válido por 30 minutos.</p>
        `;

        await sendMail(usuario.email, 'Recuperação de Senha', body, 'Código de Recuperação');

        return res.status(200).send({ message: 'Código enviado para o e-mail.' });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Atualizar Senha com Código
const atualizarSenha = async (req, res) => {
    try {
        const { email, codigoRecuperacao, novaSenha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        if (usuario.codigoRecuperacao !== codigoRecuperacao) {
            return res.status(400).send({ message: 'Código inválido' });
        }

        if (usuario.codigoExpira < new Date()) {
            return res.status(400).send({ message: 'Código expirado' });
        }

        const senhaHash = await bcrypt.hash(novaSenha, 10);
        usuario.password = senhaHash;
        usuario.codigoRecuperacao = null;
        usuario.codigoExpira = null;

        await usuario.save();

        return res.status(200).send({ message: 'Senha atualizada com sucesso.' });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const enviarCodigo = async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar se o usuário existe no banco
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado.' });
        }

        // Gerar código de recuperação
        const codigo = crypto.randomBytes(3).toString('hex').toUpperCase();  // Código de 6 caracteres (ex: ABC123)

        // Gerar tempo de expiração para 30 minutos
        const expiracao = new Date();
        expiracao.setMinutes(expiracao.getMinutes() + 30);

        // Salvar o código de recuperação e data de expiração no banco
        await usuario.update({
            codigo_recuperacao: codigo,
            codigo_expiracao: expiracao,
        });

        // Configurar o conteúdo do e-mail
        const assunto = 'Código de Recuperação de Senha';
        const corpo = `
            <h3>Olá, ${usuario.nome}!</h3>
            <p>Seu código de recuperação de senha é: <strong>${codigo}</strong></p>
            <p>Este código é válido por 30 minutos.</p>
        `;

        // Enviar o e-mail
        await sendMail(usuario.email, 'Suporte', corpo, assunto);

        return res.status(200).send({
            message: 'Código de recuperação enviado para o e-mail.',
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export default {
    get,
    persist,
    destroy,
    login,
    getDataByToken,
    enviarCodigoRecuperacao,
    atualizarSenha,
    enviarCodigo,
};
