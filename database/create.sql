-- execute script: psql -d namegator -f database/create.sql
create schema namegator;

create table namegator.item (
    id serial,
    type text not null,
    description text not null
);

insert into namegator.item (type, description) values ('prefix', 'Air');
insert into namegator.item (type, description) values ('prefix', 'jet');
insert into namegator.item (type, description) values ('prefix', 'Fligth');
insert into namegator.item (type, description) values ('sufix', 'Hub');
insert into namegator.item (type, description) values ('sufix', 'Station');
insert into namegator.item (type, description) values ('sufix', 'Mart');