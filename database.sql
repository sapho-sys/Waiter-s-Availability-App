CREATE TABLE my_waiters(
    id SERIAL NOT NULL PRIMARY KEY,
    waiter_name VARCHAR(255) NOT NULL
);

CREATE TABLE weekdays(
    id SERIAL NOT NULL PRIMARY KEY,
    shifts VARCHAR(255) NOT NULL
);

CREATE TABLE waiter_shifts(
    id SERIAL NOT NULL PRIMARY KEY,
    waiter_id INT NOT NULL,
    shift_id INT NOT NULL,
    FOREIGN KEY (waiter_id) REFERENCES my_waiters(id),
    FOREIGN KEY (shift_id) REFERENCES weekdays(id) 
);

INSERT INTO weekdays (shifts) VALUES ('Sunday')
,('Monday'),('Tuesday'),('Wednesday'),('Thursday')
,('Friday'),('Saturday'); 

