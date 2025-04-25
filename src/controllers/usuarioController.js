import Usuario from '../models/usuarioModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

        const comparacaoSenha = await bcrypt.compare(password, user.passwordHash);

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

        const usuario = jwt.verify(token, process.env.TOKEN_KEY);

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

        return res.status(200).send({
            message: 'Usuário autenticado com sucesso',
            response: user
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

export default {
    get,
    persist,
    destroy,
    login,
    getDataByToken
};
