CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS event (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    length VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT unique_name_user UNIQUE (name, user_id)
);

CREATE TABLE IF NOT EXISTS query (
    id INT NOT NULL AUTO_INCREMENT,
    prompt VARCHAR(100),
    response VARCHAR(100),
    date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS task (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20),
    description TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    event_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES event(id)
);


CREATE TABLE IF NOT EXISTS subscription (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    price_usd FLOAT,
    query_limit INT,
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS payment (
    id INT NOT NULL AUTO_INCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    amount FLOAT,
    subscription_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (subscription_id) REFERENCES subscription(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);


INSERT INTO subscription (name, price_usd, query_limit) VALUES   
    ('Free', 0.00, 10),   
    ('Premium', 9.99, 100),   
    ('Pro', 19.99, 1000);


