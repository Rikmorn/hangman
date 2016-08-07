# Create a base image
FROM ubuntu:14.04

# Prepare ENV variables
# Set DEBIAN_FRONTEND to noninteractive
ENV DEBIAN_FRONTEND noninteractive
# Set Nginx version to build
ENV NGINX_VERSION 1.9.11
# Set Nginx modules directory
ENV MODULESDIR /modules

# Fix locales
RUN locale-gen en_US.UTF-8 && \
    dpkg-reconfigure locales

# Install required packges
RUN apt-get update  && \
    apt-get install -y build-essential wget curl && \
    curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - && \
    apt-get build-dep -y nginx-full&& \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Pull Nginx from source
RUN cd /usr/src/ && \
    wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar xf nginx-${NGINX_VERSION}.tar.gz && \
    rm -f nginx-${NGINX_VERSION}.tar.gz

# Create modules directory
RUN mkdir ${MODULESDIR}

# Pull headers-more-nginx-module from source
RUN cd ${MODULESDIR} && \
    wget 'https://github.com/openresty/headers-more-nginx-module/archive/v0.261.tar.gz' && \
    tar xf v0.261.tar.gz && \
    rm -f v0.261.tar.gz

# Compiling nginx
RUN cd /usr/src/nginx-${NGINX_VERSION} && \
    ./configure \
    --prefix=/etc/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --sbin-path=/usr/sbin \
    --http-client-body-temp-path=/var/lib/nginx/body \
    --http-fastcgi-temp-path=/var/lib/nginx/fastcgi \
    --http-log-path=/var/log/nginx/access.log \
    --http-proxy-temp-path=/var/lib/nginx/proxy \
    --http-scgi-temp-path=/var/lib/nginx/scgi \
    --http-uwsgi-temp-path=/var/lib/nginx/uwsgi \
    --lock-path=/var/lock/nginx.lock \
    --pid-path=/var/run/nginx.pid \
    --with-http_addition_module \
    --with-http_dav_module \
    --with-http_geoip_module \
    --with-http_gzip_static_module \
    --with-http_image_filter_module \
    --with-http_realip_module \
    --with-http_stub_status_module \
    --with-http_ssl_module \
    --with-http_sub_module \
    --with-http_xslt_module \
    --with-ipv6 \
    --with-debug \
    --with-sha1=/usr/include/openssl \
    --with-md5=/usr/include/openssl \
    --add-module=${MODULESDIR}/headers-more-nginx-module-0.261

# Build Nginx
RUN cd /usr/src/nginx-${NGINX_VERSION} && \
    make && \
    make install

# Create the /var/lib/nginx directory for temporary paths
RUN mkdir -p /var/lib/nginx

#Copy config
COPY ./nginx.conf /etc/nginx/nginx.conf

CMD nginx -g 'daemon off;'