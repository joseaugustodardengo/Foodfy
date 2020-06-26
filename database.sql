DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

-- to run seeds
DELETE FROM users;
DELETE FROM chefs;
DELETE FROM recipes;
DELETE FROM files;
DELETE FROM recipes_files;

-- restart sequence auto_increment from tales ids
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_files_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

CREATE TABLE "chefs" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "file_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipes" (
  "id" SERIAL UNIQUE PRIMARY KEY NOT NULL,
  "chef_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text,
  "path" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipes_files" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "recipe_id" integer NOT NULL,
  "file_id" integer NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "recipes_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipes_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");


CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();  
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON files
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE OR REPLACE FUNCTION delete_files_when_recipes_files_row_was_deleted()
RETURNS TRIGGER AS $$
BEGIN
EXECUTE ('DELETE FROM files
WHERE id = $1')
USING OLD.file_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- user cascade trigger
CREATE TRIGGER delete_recipes_files
AFTER DELETE ON recipes_files
FOR EACH ROW
EXECUTE PROCEDURE delete_files_when_recipes_files_row_was_deleted();

-- DELETE CASCADE
ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES users("id")
ON DELETE CASCADE;

ALTER TABLE "recipes_files"
DROP CONSTRAINT recipes_files_recipe_id_fkey,
ADD CONSTRAINT recipes_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES recipes("id")
ON DELETE CASCADE;

ALTER TABLE "recipes_files"
DROP CONSTRAINT recipes_files_file_id_fkey,
ADD CONSTRAINT recipes_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES files("id")
ON DELETE CASCADE;