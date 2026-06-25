FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080
ENV DEBUG=False

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN SECRET_KEY=build-time-collectstatic-key python manage.py collectstatic --noinput

EXPOSE 8080

CMD exec gunicorn artistico.wsgi:application --bind 0.0.0.0:${PORT:-8080}
