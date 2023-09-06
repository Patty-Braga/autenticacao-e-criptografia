const express = require('express');

const { cadastraUsuario, login } = require('./controladores/usuarios');
const verificarUsuarioLogado = require('./controladores/intermediarios/autenticacao');
const { cadastraPokemon, atualizaPokemon, listaTodosPokemons, detalhaPokemon, excluiPokemon } = require('./controladores/pokemons');

const rotas = express();


rotas.post('/usuario', cadastraUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado);

rotas.post('/pokemon', cadastraPokemon);
rotas.put('/pokemon/:id', atualizaPokemon);
rotas.get('/pokemon', listaTodosPokemons);
rotas.get('/pokemon/:id', detalhaPokemon);
rotas.delete('/pokemon/:id', excluiPokemon);

module.exports = rotas