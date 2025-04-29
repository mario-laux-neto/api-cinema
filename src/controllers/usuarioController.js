import Usuario from '../models/usuarioModel.js'; // Importa o modelo de usuário.
import Cargo from '../models/cargoModel.js'; // Importa o modelo de cargo (associado ao usuário).
import bcrypt from 'bcrypt'; // Importa a biblioteca bcrypt para criptografar senhas.
import jwt from 'jsonwebtoken'; // Importa o JWT para gerar tokens de autenticação.
import { randomInt } from 'crypto'; // Importa a função para gerar números aleatórios.
import sendMail from '../utils/email.js'; // Função utilitária para enviar e-mails.

const get = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null; // Extrai o ID da URL e remove qualquer caractere não numérico.

        if (!id) {
            const response = await Usuario.findAll({
                order: [['id', 'desc']], // Se não houver ID, busca todos os usuários, ordenados pela ID.
            });

            return res.status(200).send({
                message: 'Dados encontrados',
                data: response, // Retorna todos os usuários encontrados.
            });
        }

        const response = await Usuario.findOne({ where: { id } }); // Se houver ID, busca o usuário específico.

        if (!response) {
            return res.status(404).send('Usuário não encontrado'); // Retorna erro caso o usuário não seja encontrado.
        }

        return res.status(200).send({
            message: 'Dados encontrados',
            data: response, // Retorna o usuário encontrado.
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message, // Retorna erro caso haja algum problema.
        });
    }
};

const create = async (corpo) => {
    try {
        const { nome, cpf, email, password, estudante, idCargo } = corpo; // Extrai os dados do corpo da requisição.

        const verificarEmail = await Usuario.findOne({ where: { email } }); // Verifica se já existe um usuário com o mesmo e-mail.

        if (verificarEmail) {
            throw new Error('Já existe um usuário com esse email'); // Se o e-mail já existir, retorna erro.
        }

        const passwordHash = await bcrypt.hash(password, 10); // Criptografa a senha antes de salvar.

        const response = await Usuario.create({
            nome,
            cpf,
            email,
            estudante,
            idCargo,
            password: passwordHash // Cria um novo usuário com os dados fornecidos.
        });

        return response; // Retorna o usuário criado.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body; // Extrai os dados de login (e-mail e senha).

        const user = await Usuario.findOne({ where: { email } }); // Busca o usuário pelo e-mail.

        if (!user) {
            return res.status(400).send({
                message: 'Usuário ou senha incorretos' // Retorna erro caso o usuário não seja encontrado.
            });
        }

        const comparacaoSenha = await bcrypt.compare(password, user.password); // Compara a senha fornecida com a senha criptografada.

        if (comparacaoSenha) {
            const token = jwt.sign({
                idUsuario: user.id,
                nome: user.nome,
                email: user.email,
                idCargo: user.idCargo
            }, process.env.TOKEN_KEY, { expiresIn: '8h' }); // Cria um token JWT para o usuário com dados essenciais.

            return res.status(200).send({
                message: 'Sucesso!',
                response: token // Retorna o token gerado.
            });
        } else {
            return res.status(400).send({
                message: 'Usuário ou senha incorretos' // Retorna erro caso a senha não seja válida.
            });
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message // Retorna erro caso algo falhe.
        });
    }
};

const getDataByToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho de autorização.
        if (!token) {
            return res.status(400).send({ message: 'Token não informado' }); // Retorna erro caso o token não seja fornecido.
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY); // Verifica e decodifica o token.

        const user = await Usuario.findOne({
            where: { id: decoded.idUsuario },
            include: [
                {
                    model: Cargo,
                    as: 'cargo' // Inclui o cargo associado ao usuário na consulta.
                }
            ]
        });

        if (!user) {
            return res.status(404).send({ message: 'Usuário não encontrado' }); // Retorna erro se o usuário não for encontrado.
        }

        return res.status(200).send({
            message: 'Usuário e cargo encontrados com sucesso',
            data: user // Retorna o usuário e seu cargo.
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                message: 'Token expirado, por favor faça login novamente' // Retorna erro se o token expirou.
            });
        }
        return res.status(401).send({
            message: 'Token inválido ou expirado' // Retorna erro caso o token seja inválido.
        });
    }
};

const update = async (corpo, id) => {
    try {
        const response = await Usuario.findOne({ where: { id } }); // Busca o usuário pelo ID.

        if (!response) {
            throw new Error('Usuário não encontrado'); // Retorna erro se o usuário não for encontrado.
        }

        Object.keys(corpo).forEach((item) => {
            response[item] = corpo[item]; // Atualiza os dados do usuário com os dados fornecidos.
        });

        await response.save(); // Salva as alterações no banco de dados.
        return response; // Retorna o usuário atualizado.

    } catch (error) {
        throw new Error(error.message); // Retorna erro caso algo falhe.
    }
};

const persist = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null; // Extrai o ID da URL.

        if (!id) {
            const response = await create(req.body); // Se não houver ID, cria um novo usuário.
            return res.status(201).send({
                message: 'Criado com sucesso',
                data: response // Retorna o usuário criado.
            });
        }

        const response = await update(req.body, id); // Se houver ID, atualiza o usuário existente.
        return res.status(201).send({
            message: 'Atualizado com sucesso',
            data: response // Retorna o usuário atualizado.
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
            return res.status(400).send('ID não informado'); // Retorna erro se o ID não for fornecido.
        }

        const response = await Usuario.findOne({ where: { id } }); // Busca o usuário pelo ID.

        if (!response) {
            return res.status(404).send('Usuário não encontrado'); // Retorna erro se o usuário não for encontrado.
        }

        await response.destroy(); // Deleta o usuário do banco de dados.

        return res.status(200).send({
            message: 'Registro excluído',
            data: response // Retorna a confirmação da exclusão.
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message // Retorna erro caso algo falhe.
        });
    }
};

// >>> NOVAS FUNÇÕES <<<

// Enviar Código de Recuperação
const enviarCodigoRecuperacao = async (req, res) => {
    try {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ where: { email } }); // Verifica se o usuário existe.

        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' }); // Retorna erro caso o usuário não seja encontrado.
        }

        const codigo = randomInt(100000, 999999).toString(); // Gera um código aleatório de 6 dígitos.
        const expiracao = new Date(Date.now() + 30 * 60000); // Define a expiração do código para 30 minutos.

        usuario.codigoRecuperacao = codigo; // Salva o código no usuário.
        usuario.codigoExpira = expiracao; // Define a expiração do código.
        await usuario.save(); // Salva as alterações.

        const body = `
            <p>Seu código de recuperação de senha é: <b>${codigo}</b></p>
            <p>Este código é válido por 30 minutos.</p>
        `;

        await sendMail(usuario.email, 'Recuperação de Senha', body, 'Código de Recuperação'); // Envia o código por e-mail.

        return res.status(200).send({ message: 'Código enviado para o e-mail.' });

    } catch (error) {
        return res.status(500).send({ message: error.message }); // Retorna erro caso algo falhe.
    }
};

// Atualizar Senha com Código
const atualizarSenha = async (req, res) => {
    try {
        const { email, codigoRecuperacao, novaSenha } = req.body;

        const usuario = await Usuario.findOne({ where: { email } }); // Busca o usuário pelo e-mail.

        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' }); // Retorna erro se o usuário não for encontrado.
        }

        if (usuario.codigoRecuperacao !== codigoRecuperacao) {
            return res.status(400).send({ message: 'Código inválido' }); // Verifica se o código informado é válido.
        }

        if (usuario.codigoExpira < new Date()) {
            return res.status(400).send({ message: 'Código expirado' }); // Verifica se o código expirou.
        }

        const senhaHash = await bcrypt.hash(novaSenha, 10); // Criptografa a nova senha.
        usuario.password = senhaHash; // Atualiza a senha.
        usuario.codigoRecuperacao = null; // Remove o código de recuperação.
        usuario.codigoExpira = null; // Remove a data de expiração.

        await usuario.save(); // Salva as alterações no banco de dados.

        return res.status(200).send({ message: 'Senha atualizada com sucesso.' });

    } catch (error) {
        return res.status(500).send({ message: error.message }); // Retorna erro caso algo falhe.
    }
};

// Função adicional para envio de código de recuperação
const enviarCodigo = async (req, res) => {
    try {
        const { email } = req.body;

        // Verifica se o usuário existe no banco
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado.' });
        }

        // Gera código de recuperação
        const codigo = crypto.randomBytes(3).toString('hex').toUpperCase(); // Gera código aleatório em hexadecimal.

        // Define tempo de expiração para 30 minutos
        const expiracao = new Date();
        expiracao.setMinutes(expiracao.getMinutes() + 30);

        // Salva o código no banco
        await usuario.update({
            codigo_recuperacao: codigo,
            codigo_expiracao: expiracao,
        });

        // Envia e-mail com o código
        const assunto = 'Código de Recuperação de Senha';
        const corpo = `
            <h3>Olá, ${usuario.nome}!</h3>
            <p>Seu código de recuperação de senha é: <strong>${codigo}</strong></p>
            <p>Este código é válido por 30 minutos.</p>
        `;

        await sendMail(usuario.email, 'Suporte', corpo, assunto); // Envia o e-mail

        return res.status(200).send({
            message: 'Código de recuperação enviado para o e-mail.',
        });
    } catch (error) {
        return res.status(500).send({ message: error.message }); // Retorna erro caso algo falhe.
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
