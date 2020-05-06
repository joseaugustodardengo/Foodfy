CREATE DATABASE foodfy;

CREATE TABLE chefs (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    name text NOT NULL,
    avatar_url text NOT NULL,
    created_at timestamp NOT NULL
)

CREATE TABLE recipes (
	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
	chef_id integer NOT NULL,
    image text NOT NULL,
    title text NOT NULL,
    ingredients text[] NOT NULL,
    preparation text[] NOT NULL,
    information text,
    created_at timestamp NOT NULL
)        