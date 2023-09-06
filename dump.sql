--1
create database catalogo_pokemons;

--a
create table usuarios (
    id serial unique primary key ,
    nome text not null,
    email text not null unique,
    senha integer not null
);

--b
create table pokemons (
    id serial unique primary key,
    usuario_id int references usuarios (id),
    nome text not null,
    habilidades text not null,
  	imagem text,
  	apelido text
);











