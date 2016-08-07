FROM node:6.3.1-onbuild

# Create app directory
RUN mkdir /src
WORKDIR /src

# Install app dependencies
COPY package.json /src/
RUN npm install

# Bundle app source
COPY . /src

RUN npm run build
RUN npm install http-server -g

# Boot app
CMD http-server ./build -p 8882