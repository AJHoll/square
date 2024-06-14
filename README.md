# square

AtomSkills. Автоматизация площадки проведения мероприятий

## Установка

### Windows

Скачайте nodejs (Версия выше 18). [Ссылка на последнюю LTS версию](https://nodejs.org/en)

После установки нужно проверить ее корректность

```shell
node -v
```

Команда вернет версию установленной NodeJS

```shell
npm -v
```

Команда вернет версию пакетного менеджера npm

Скачайте postgresql (Версия выше 12). [Ссылка на актуальную версию](https://www.postgresql.org/download/)

Во время установки вас попросит ввести пароль пользователя postgres. Не забывайте его.

Если после установки у вас не получается вызвать команду psql - в дополнительных настройках
нужно в переменную среды Path - прописать путь до папки ./bin postgresa

После добавления переменной зайдите в консоль и проверьте установку командой

```shell
psql --version
```

Ниже должна вывестись версия СУБД

Далее скачиваем данный репозиторий

Заходим в папку `./database`

Запускаем `restore.cmd`
Скрипт восстановления трижды попросит вас ввести пароль от postgres, после чего восстановит
БД и подготовит ее к работе

После этого заходим в папку `./backend`
Выполните `install_and_run.cmd`

в консоли запустится серверная часть приложения

Чтобы запустить клиентскую часть прилоежния нужно зайти в папку `./frontend`

Запустить `install_and_build.cmd`

Скачать nginx ([ссылка на стабильную версию](https://nginx.org/download/nginx-1.26.1.zip))
Распакуйте ее в папку nginx
Откройте файл nginx.conf (путь `./nginx/nginx-1.26.1/conf/`)
и замените все содержимое на

```nginx configuration
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

	server {
		listen 80;
		listen [::]:80;

		root html;
		index index.html index.htm index.nginx-debian.html;

		server_name square.devsystem.space www.square.devsystem.space;

		location / {
			try_files $uri $uri/ /index.html;
		}

		location /api/ {
			proxy_pass_header Server;
			proxy_set_header Host $http_host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Forwarded-Proto $scheme;
			proxy_pass http://localhost:1024/;
		}
	}
}
```

скопируйте все файлы и папки из `frontend/build` в `nginx/nginx-1.26.1/html`

запустите `nginx/nginx-1.26.1/nginx.exe`
проверьте в бразуере `localhost`, если система запустилась - окно с nginx можно закрыть