FROM python:3.9.18-slim-bullseye

RUN apt-get update && apt-get install --no-install-recommends -y \
    libpq-dev \
    musl-dev \
    python3-dev \
    postgresql-client \
    gcc \
    curl \
    bash \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/ ./requirements/
RUN pip install -r requirements/requirements.txt
RUN pip install -r requirements/requirements_dev.txt
