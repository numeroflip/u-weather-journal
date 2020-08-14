CREATE TABLE entries(
   ID                   BIGSERIAL       NOT NULL PRIMARY KEY,
   AUTHOR               VARCHAR(100)    NOT NULL,
   CITY                 VARCHAR(100)    NOT NULL,
   POST_CONTENT         TEXT            NOT NULL,
   COUNTRY              VARCHAR(100)    NOT NULL,
   POSTING_DATE         DATE            NOT NULL,
   WEATHER_CODE         INT             NOT NULL,
   WEATHER_DESCRIPTION  VARCHAR(40)     NOT NULL,
   TEMP_CELS            INT             NOT NULL
);

INSERT INTO entries (author, city, post_content, country, posting_date, weather_code, weather_description, temp_cels)
VALUES ('Test author', 'Budapest', 'Congratulations, the database is connected', 'Hungary', '2020-08-14', '7', 'Cloudy', '23' );