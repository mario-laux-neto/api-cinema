// Importação do modelo Filme e do utilitário para upload de arquivos
import Filme from '../models/filmeModel.js';
import uploadFile from '../utils/uploadFile.js';  // Arquivo de utilitário de upload
import fs from 'fs';  // Módulo para manipulação de arquivos
import path from 'path';  // Módulo para manipulação de caminhos de arquivos

// Função para criar um novo filme
const create = async (req, res) => {
    try {
        // Extração dos dados do filme enviados no corpo da requisição
        const { nome, descricao, autor, duracao } = req.body;

        // Criação do filme no banco de dados
        const filme = await Filme.create({
            nome,
            descricao,
            autor,
            duracao,
        });

        // Verifica se há uma imagem associada à requisição
        if (req.files && req.files.imagem) {
            const extensoesPermitidas = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
            const extensao = path.extname(req.files.imagem.name).toLowerCase();

            // Valida a extensão da imagem
            if (!extensoesPermitidas.includes(extensao)) {
                console.log('Tentativa de upload de arquivo não permitido:', extensao);
                return res.status(400).send({ message: 'Apenas arquivos de imagem são permitidos.' });
            }

            // Faz o upload da imagem e associa ao filme
            const result = await uploadFile(req.files.imagem, {
                tipo: 'imagem',
                tabela: 'filmes',
                id: filme.id,
            });

            // Verifica se houve erro durante o upload
            if (result.type === 'erro') {
                return res.status(400).send({ message: result.message });
            }

            // Atualiza o caminho da imagem no filme
            const caminhoImagem = result.message.replace('public/', '');
            filme.imagem = caminhoImagem;
            await filme.save();  // Salva as alterações
        }

        // Retorna sucesso ao criar o filme
        return res.status(201).send({
            message: 'Filme criado com sucesso',
            data: filme
        });
    } catch (error) {
        // Retorna erro caso algo falhe
        return res.status(500).send({ message: error.message });
    }
};

// Função para atualizar um filme existente
const update = async (req, res) => {
    try {
        // Busca o filme pelo ID na requisição
        const id = req.params.id;
        const filme = await Filme.findByPk(id);

        // Verifica se o filme existe
        if (!filme) {
            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        // Atualiza os campos do filme com os dados enviados na requisição
        Object.keys(req.body).forEach(key => {
            filme[key] = req.body[key];
        });

        // Verifica se há uma nova imagem para ser associada ao filme
        if (req.files && req.files.imagem) {
            const extensoesPermitidas = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
            const extensao = path.extname(req.files.imagem.name).toLowerCase();

            // Valida a extensão da nova imagem
            if (!extensoesPermitidas.includes(extensao)) {
                console.log('Tentativa de upload de arquivo não permitido:', extensao);
                return res.status(400).send({ message: 'Apenas arquivos de imagem são permitidos.' });
            }

            // Apaga a imagem antiga, se houver
            if (filme.imagem) {
                const caminhoAntigo = path.join('public', filme.imagem);
                if (fs.existsSync(caminhoAntigo)) {
                    fs.unlinkSync(caminhoAntigo);  // Exclui a imagem do sistema de arquivos
                }
            }

            // Faz o upload da nova imagem
            const result = await uploadFile(req.files.imagem, {
                tipo: 'imagem',
                tabela: 'filmes',
                id: filme.id,
            });

            // Verifica se houve erro durante o upload
            if (result.type === 'erro') {
                return res.status(400).send({ message: result.message });
            }

            // Atualiza o caminho da nova imagem no filme
            const caminhoImagem = result.message.replace('public/', '');
            filme.imagem = caminhoImagem;
        }

        // Salva as alterações no filme
        await filme.save();

        // Retorna sucesso ao atualizar o filme
        return res.status(200).send({
            message: 'Filme atualizado com sucesso',
            data: filme
        });
    } catch (error) {
        // Retorna erro caso algo falhe
        return res.status(500).send({ message: error.message });
    }
};

// Função para excluir um filme
const destroy = async (req, res) => {
    try {
        // Busca o filme pelo ID
        const id = req.params.id;
        const filme = await Filme.findByPk(id);

        // Verifica se o filme existe
        if (!filme) {
            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        // Exclui a imagem associada ao filme, se houver
        if (filme.imagem) {
            const caminhoImagem = path.join('public', filme.imagem);
            if (fs.existsSync(caminhoImagem)) {
                fs.unlinkSync(caminhoImagem);  // Exclui a imagem do sistema de arquivos
            }
        }

        // Exclui o filme do banco de dados
        await filme.destroy();

        // Retorna sucesso na exclusão
        return res.status(200).send({
            message: 'Filme excluído com sucesso'
        });
    } catch (error) {
        // Retorna erro caso algo falhe
        return res.status(500).send({ message: error.message });
    }
};

// Função para buscar filmes ou um filme específico
const get = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            // Se não houver ID, busca todos os filmes ordenados pela ID
            const filmes = await Filme.findAll({ order: [['id', 'desc']] });
            return res.status(200).send({ data: filmes });
        }

        // Se houver ID, busca um filme específico
        const filme = await Filme.findByPk(id);

        if (!filme) {
            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        // Retorna o filme encontrado
        return res.status(200).send({ data: filme });
    } catch (error) {
        // Retorna erro caso algo falhe
        return res.status(500).send({ message: error.message });
    }
};

// Função para criar ou atualizar um filme, dependendo da presença do ID
const persist = async (req, res) => {
    if (req.params.id) {
        // Atualiza o filme se o ID for fornecido
        return update(req, res);
    } else {
        // Cria um novo filme se o ID não for fornecido
        return create(req, res);
    }
};

// Exporta as funções para serem utilizadas em outros arquivos
export default {
    get,
    create,
    update,
    destroy,
    persist
};
