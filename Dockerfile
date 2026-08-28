# use official bun image
FROM oven/bun AS base
WORKDIR /usr/src/app

# install build dependencies
FROM base AS build-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# build
FROM base AS build
COPY --from=build-deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN cp ./.env.example ./.env
ENV NODE_ENV=production
ENV BETTER_AUTH_SECRET=somethingtomakeitbuildwhatsoeverplease
RUN bun run build

# install release dependencies
FROM base AS release-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# copy reverything 
FROM base AS release 
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=release-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./

# run
USER bun
EXPOSE 3000
CMD ["bun", "index.js"]