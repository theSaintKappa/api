FROM oven/bun AS build
WORKDIR /app

COPY bun.lockb .
COPY package.json .

RUN bun install --frozen-lockfile

COPY src ./src
COPY public ./public

RUN bun build ./src/index.ts --compile --outfile cli

FROM ubuntu:22.04
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/cli /app/cli
COPY --from=build /app/public /app/public

CMD ["/app/cli"]
