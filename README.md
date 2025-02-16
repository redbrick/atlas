# CS++'s Website

![Deployment](https://img.shields.io/github/actions/workflow/status/cs-soc-tudublin/plume/deploy-to-vps.yaml)

Plume is CS++'s website, written in 11ty.
It is forked from Redbrick's amazing [Atlas](https://github.com/redbrick/atlas) site.


## Adding Content

Plume is designed to be more-or-less static.

The more commonly changing content (Such as Committe List, invite links, etc.) are available in `src/_data/site.yml`.

### Adding Blogs

To add blog posts, go to 📚[cs-soc-tudublin/blog](https://github.com/cs-soc-tudublin/blog). When you add a new blog post, don't forget to update the Global Blog link in `src/_data/site.yml`!

### Adding / Modifying Images

All images should be uploaded to `/src/site/assets/img` in the relevant section (Such as committee photos going to `/committee`). It is important that these are stored as WEBP for storage-size reasons.

### Adding / Modifying Theming

The theme is managed in our universal [IdentityFlip](https://github.com/cs-soc-tudublin/IdentityFlip) identity kit.
This includes our universal graphics, styling themes, and fonts.

Plume should always adhere to the identity kit, and exceptions to this should be approved before release.

### Adding / Modifying Structure

Should you need to change the structure, follow the file structure of the repository. Structural changes include modifications to the currently existing sections, header and footer, and adding sections.

## Development

To develop Plume, please ensure you have [Node.JS](https://nodejs.org/), [Yarn](https://yarnpkg.com/), and [Docker](https://www.docker.com/) installed.

_Plume uses a specific version of Node. You can use [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) to easily switch between Node versions._

1. Clone the repository

```bash
git clone https://github.com/cs-soc-tudublin/Plume.git
```

2. Install the dependencies with yarn

```bash
yarn install
```

3. Run the development server

```bash
yarn run dev
```

The development server will rebuild the site with any changes made and auto-refresh the page in your browser.

If for some reason this does not give an accurate view of the site, you can try serving it with docker.

### Using Docker

1. Create a .env file, and place the following into it

```bash
EXPOSED_PORT=[Chosen_Port_Number]
```

2. Build and start the Docker container

```bash
docker compose up -d --build
```

Once the container has successfully started, navigate to `localhost:[Chosen_Port_Number]` to view the site.

## Deployment

Internally, CS++ deploys Plume automatically to its infrastructure upon a commit to the `main` branch. The GitHub action for this can be found in `.github/workflows/deploy-to-vps.yaml`.

In addition, Plume is designed to be served through a Proxy, like [NGINX](https://nginx.org/), and not run standalone.
