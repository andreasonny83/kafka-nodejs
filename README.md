# Kafka NodeJS

## Start Kafka

```sh
$ docker-compose up
```

## Start the Node Server

```sh
$ pnpm start
```

The server will broadcast the Kafka event to [ably.com](https://ably.com).
Make sure to create a free Ably account and configure the `.env` file with your API key.