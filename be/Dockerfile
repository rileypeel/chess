FROM python:3.8-alpine
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY ./requirements.txt /requirements.txt
RUN apk add --update --no-cache postgresql-client jpeg-dev
RUN apk add --update --no-cache --virtual .tmp-build-deps \
	gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev python3-dev libffi-dev openssl-dev
RUN pip install -r /requirements.txt

RUN apk del .tmp-build-deps
RUN mkdir /app

WORKDIR /app

COPY ./app /app

RUN adduser -D user

USER user