# ===== BUILD STAGE =====
FROM node:20-bullseye AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (dev + prod)
RUN npm install

# Копируем весь проект
COPY . .

# Ребилдим sharp, если нужен
RUN npm rebuild sharp --force

# Собираем TypeScript
RUN npm run build

# ===== PRODUCTION STAGE =====
FROM node:20-bullseye AS production

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только продовые зависимости
RUN npm install --production

# Для миграций/ts-node/typeorm
RUN npm install ts-node typeorm tsconfig-paths --no-save

# Копируем tsconfig и src для ts-node
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/src ./src

# Копируем скомпилированные JS файлы
COPY --from=build /app/dist ./dist

# Копируем миграции
COPY --from=build /app/migrations ./migrations

# Создаём папку temp для файлов
RUN mkdir -p /app/temp

# Открываем порт
EXPOSE 5000

# CMD с ожиданием БД и генерацией данных
CMD ["sh", "-c", "export NODE_ENV=production && npx wait-on tcp:postgres:5432 && npm run typeorm:run || true && npm run generate-data && node dist/src/server.js"]
