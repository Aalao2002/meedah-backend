FROM php:8.4-cli

RUN apt-get update && apt-get install -y libpq-dev zip unzip git

RUN docker-php-ext-install pdo_pgsql pgsql

WORKDIR /var/www/html

COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer install --no-dev --optimize-autoloader

RUN php artisan config:clear

EXPOSE 8000

<<<<<<< HEAD
CMD php artisan serve --host=0.0.0.0 --port=8000
=======
CMD php artisan serve --host=0.0.0.0 --port=8000
>>>>>>> a425112c73c6b4b5c3923015241da66f88fb91a0
