FROM node:6.3.1-onbuild

# Create app directory
RUN mkdir /src
WORKDIR /src

# Install app dependencies
COPY package.json /src/
RUN npm install

# Bundle app source
COPY . /src

# Create tests
RUN npm run docs

# Boot app
CMD npm run start -- -c 2 -p 8881