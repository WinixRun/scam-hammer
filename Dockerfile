# Usa una imagen base oficial de Node.js 16, que soporta ES12
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Expone el puerto en el que tu aplicación está configurada para escuchar
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["node", "server.js"]
