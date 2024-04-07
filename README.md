# HackITBA-2024


## Nosotros
Grupo: Beta Builders

Integrantes:
- Santiago Torres
- Luca Mancuso
- Tomas Pietravallo

> Somos un grupo de estudiantes de Ing. Informática en el ITBA que se conocieron durante la cursada. Nos gusta mucho programar y realizar proyectos por lo que nos atrajo mucho la idea del hackathon.

## Ejecutar el proyecto

Se debe contar con [docker/docker-compose](https://docs.docker.com/manuals/) instalados para poder ejecutar la imagen que contiene el proyecto.

Luego de clonar el [repositorio de Github](https://github.com/betabuilders/hackitba-2024), y atraves de una terminal de comandos, posicionarse de modo que el directorio actual de trabajo coincida con la carpeta del repositorio (`hackitba-2024`)

```sh
git clone https://github.com/betabuilders/hackitba-2024.git
cd hackitba-2024
```

Se construye el contenedor con el siguiente comando
```sh
docker-compose build
```

Luego, se ejecuta la imagen que crea los servidores, y se comunica con los puertos necesarios
```sh
docker-compose up
```

Al correr estos comandos en su terminal, luego podra ingresar a `http://localhost:3000` para acceder a la pagina web del servicio.

> Nota: Si usted o su computadora estuviera utilizando este puerto, puede que la URL resulte diferente. Asegurese de no tener puertos ocupados o procesos que pudieran interrumpir con la conexion