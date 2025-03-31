#FROM --platform=linux/amd64 node:19-bullseye-slim
FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

COPY . .

#RUN yarn install
#RUN yarn build

# 安装pnpm
RUN npm install -g pnpm

# 使用pnpm安装依赖并构建
RUN pnpm install
RUN pnpm build

EXPOSE 3000

#CMD ["yarn","start"]
CMD ["pnpm","start"]
