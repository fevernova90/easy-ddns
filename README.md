# EASY-DDNS

**Currently only supports [Cloudflare](https://api.cloudflare.com/).**

Latest tag: `0.0.1` `latest`

---

A nodejs container running a cron job to check your machine dynamic external IP and update your DNS Provider accordingly, using safest/minimal permission API token possible, instead of conventional dns client that uses username and password or global token.

## Getting Started

This container require environment variables to be set, preferably in binded .env file or docker-compose.yml file.

### Prerequisities

In order to run this container you'll need docker installed.

- [Windows](https://docs.docker.com/windows/started)
- [OS X](https://docs.docker.com/mac/started/)
- [Linux](https://docs.docker.com/linux/started/)

### Usage

#### Container Parameters

List the different parameters available to your container

Docker run command:

```shell
docker run --env-file=.env fevernova90/easy-ddns
```

Docker compose example:

```yml
version: "3"

services:
  easy-ddns:
    build:
      context: ./
      target: production
    image: easy-ddns
    environment:
      # crontab cannot have enclosed quotes
      - UPDATE_CRONTAB=0 * * * * *
      - DNS_RECORD_NAME=example.com
      - DNS_RECORD_TYPE=A
      - DNS_RECORD_TTL=300
      - CLOUDFLARE_BASE_URL=https://api.cloudflare.com/client/v4
      - CLOUDFLARE_ZONE_ID=
      - CLOUDFLARE_API_TOKEN=
```

#### Environment Variables

- `DNS_RECORD_NAME` - Your target domain name to update
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token (at least opted for DNS Record pemission)
- `CLOUDFLARE_ZONE_ID` - Your Cloudflare zone ID

#### Optional Environment Variables

- `UPDATE_CRONTAB` - Cron job to update your DNS record, default is `0 * * * * *`
- `DNS_RECORD_TYPE` - DNS record type, default is `A`
- `DNS_RECORD_TTL` - DNS record TTL, default is `300`
- `CLOUDFLARE_BASE_URL` - Cloudflare API base URL, default is `https://api.cloudflare.com/client/v4`

## Built With

- Nodejs LTS - Alpine

## Find Us

- [GitHub](https://github.com/fevernova90/easy-ddns)
- [Dockerhub](https://hub.docker.com/r/fevernova90/easy-ddns)

<!-- ## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/your/repository/tags). -->

## Authors

- **Muhaimin Taib** - _Initial work_ - [fevernova90](https://github.com/fevernova90)

<!-- See also the list of [contributors](https://github.com/your/repository/contributors) who
participated in this project. -->

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

<!-- ## Acknowledgments

- People you want to thank
- If you took a bunch of code from somewhere list it here -->
