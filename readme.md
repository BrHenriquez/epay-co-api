# Proyecto de Billetera Virtual

Este proyecto simula una billetera virtual con dos servicios REST: uno para interactuar con la base de datos (`db-service`) y otro para consumo desde el cliente (`api-service`). Incluye las siguientes funcionalidades:
1. Registro de clientes
2. Recarga de saldo en la billetera
3. Realización de pagos con confirmación mediante token
4. Consulta de saldo

## Requisitos Previos

- Node.js v14 o superior
- MongoDB
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/billetera-virtual.git
   cd billetera-virtual

2. Instalacion de librerias:
    npm i

3. Configurar variables de entorno estan prefedinifas en el `.env.example`

4. Correr el proyecto con los scripts del package.json
    `npm run dev`