// // Importa os modelos que representam as tabelas no banco de dados
// // Importando os modelos para poder sincronizá-los com o banco de dados
// // import usuario from './usuarioModel.js';
// // import sala from './salaModel.js';
// // import filme from './filmeModel.js';
// // import padraoLugares from './padraoLugaresModel.js';  
// // import usuarioSessao from './usuarioSessaoModel.js';  
// // import cargo from './cargoModel.js';
// // import sessoes from './sessoesModel.js';

// // Função assíncrona autoexecutada para sincronizar os modelos com o banco de dados
// (async () => {
//     // Usa o método `sync` do Sequelize para sincronizar os modelos com as tabelas do banco de dados.
//     // O parâmetro `{ alter: true }` significa que as tabelas serão atualizadas para corresponderem aos modelos,
//     // alterando as tabelas existentes, mas sem apagar dados.
    
//     await padraoLugares.sync({ alter: true });  // Sincroniza a tabela 'padrao_lugares'
//     await cargo.sync({ alter: true });  // Sincroniza a tabela 'cargos'
//     await filme.sync({ alter: true });  // Sincroniza a tabela 'filmes'
//     await sala.sync({ alter: true });  // Sincroniza a tabela 'salas'
//     await sessoes.sync({ alter: true });  // Sincroniza a tabela 'sessoes'
//     await usuario.sync({ alter: true });  // Sincroniza a tabela 'usuarios'
//     await usuarioSessao.sync({ alter: true });  // Sincroniza a tabela 'usuarios_sessoes'

//     // Após a sincronização das tabelas, imprime no console a mensagem de sucesso
//     console.log('Tabelas sincronizadas com sucesso.');
// })();
