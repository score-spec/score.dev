#!/usr/bin/env sh
set -e

if [ -z "$DOCS_ENV" ]; then
  echo "Empty DOCS_ENV variable"
  exit 1
fi


if [ "$DOCS_ENV" = "staging" ] ; then
    cp /usr/staging/nginx.conf /etc/nginx/nginx.conf
    cp /usr/staging/.htpasswd /etc/nginx/.htpasswd
fi

if [ "$DOCS_ENV" = "production" ] ; then
    cp /usr/production/nginx.conf /etc/nginx/nginx.conf
fi

rm -rf /usr/share/nginx/html
ln -s "/usr/share/nginx/html-$DOCS_ENV" /usr/share/nginx/html
