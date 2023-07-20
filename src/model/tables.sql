create table users (
  user_id int primary key auto_increment,
  username varchar(26) not null unique,
  email varchar(255) not null unique,
  password varchar(255),
  created_at timestamp
)

create table posts (
  post_id int primary key auto_increment,
  user_id int,
  game_title varchar(255),
  game_year int,
  game_dev varchar(255),
  status enum ('completed', 'started', 'watchlist'),
  created_at timestamp,
  foreign key (user_id) references users (user_id)
)