import Filme from '../models/filmeModel.js';
import uploadFile from '../utils/uploadFile.js';  // seu arquivo de upload
import fs from 'fs';
import path from 'path';

const create = async (req, res) => {
    try {
        const { nome, descricao, autor, duracao } = req.body;

        const filme = await Filme.create({
            nome,
            descricao,
            autor,
            duracao,
        });

        if (req.files && req.files.imagem) {
            const extensoesPermitidas = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
            const extensao = path.extname(req.files.imagem.name).toLowerCase();

            if (!extensoesPermitidas.includes(extensao)) {
                console.log('Tentativa de upload de arquivo não permitido:', extensao);
                return res.status(400).send({ message: 'Apenas arquivos de imagem são permitidos.' });
            }

            const result = await uploadFile(req.files.imagem, {
                tipo: 'imagem',
                tabela: 'filmes',
                id: filme.id,
            });

            if (result.type === 'erro') {
                return res.status(400).send({ message: result.message });
            }

            const caminhoImagem = result.message.replace('public/', '');
            filme.imagem = caminhoImagem;
            await filme.save();
        }

        return res.status(201).send({
            message: 'Filme criado com sucesso',
            data: filme
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


const update = async (req, res) => {
    try {
        const id = req.params.id;
        const filme = await Filme.findByPk(id);

        if (!filme) {
            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        Object.keys(req.body).forEach(key => {
            filme[key] = req.body[key];
        });

        if (req.files && req.files.imagem) {
            const extensoesPermitidas = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
            const extensao = path.extname(req.files.imagem.name).toLowerCase();

            if (!extensoesPermitidas.includes(extensao)) {
                console.log('Tentativa de upload de arquivo não permitido:', extensao);
                return res.status(400).send({ message: 'Apenas arquivos de imagem são permitidos.' });
            }

            // Apaga imagem antiga se existir
            if (filme.imagem) {
                const caminhoAntigo = path.join('public', filme.imagem);
                if (fs.existsSync(caminhoAntigo)) {
                    fs.unlinkSync(caminhoAntigo);
                }
            }

            const result = await uploadFile(req.files.imagem, {
                tipo: 'imagem',
                tabela: 'filmes',
                id: filme.id,
            });

            if (result.type === 'erro') {
                return res.status(400).send({ message: result.message });
            }

            const caminhoImagem = result.message.replace('public/', '');
            filme.imagem = caminhoImagem;
        }

        await filme.save();

        return res.status(200).send({
            message: 'Filme atualizado com sucesso',
            data: filme
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


const destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const filme = await Filme.findByPk(id);

        if (!filme) {
            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        // Excluir imagem se existir
        if (filme.imagem) {
            const caminhoImagem = path.join('public', filme.imagem);
            if (fs.existsSync(caminhoImagem)) {
                fs.unlinkSync(caminhoImagem);
            }
        }

        await filme.destroy();

        return res.status(200).send({
            message: 'Filme excluído com sucesso'
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const get = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            const filmes = await Filme.findAll({ order: [['id', 'desc']] });
            return res.status(200).send({ data: filmes });
        }

        const filme = await Filme.findByPk(id);

        if (!filme) {
            return res.status(404).send({ message: 'Filme não encontrado' });
        }

        return res.status(200).send({ data: filme });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
const persist = async (req, res) => {
    if (req.params.id) {
        return update(req, res);
    } else {
        return create(req, res);
    }
};


export default {
    get,
    create,
    update,
    destroy,
    persist
};
