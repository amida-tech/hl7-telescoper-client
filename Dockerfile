# Builder image
FROM node:10.16.3 as builder
WORKDIR /app
COPY . /app/
RUN yarn
RUN yarn build

# Runner image
FROM node:10.16.3
WORKDIR /app
COPY --from=builder /app/ /app/
EXPOSE 3000
CMD ["yarn", "start"]