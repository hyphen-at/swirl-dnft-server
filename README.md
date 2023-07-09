# Swirl dNFT SVG Renderer

See production deployment here: https://swirl.deno.dev/

The SVG render server for Swirl. Renders SVG with given parameters. If any external images found, it fetches and embed into the SVG so it can be rendered anywhere.

### Prerequisites

 * Deno 1.34 or higher

## Running the Server

Start the server with the command:

```
deno run --allow-net main.ts
```

This starts the server at http://localhost:8000/

## Deploying the Server

As new commits pushed into `main` branch, Deno deploys it automatically.


## API Documentation


### GET `/dnft/namecard.svg`

Renders Swirl Namecard image as SVG.

| Name | Description | Required | Example |
|---|---|---|---|
| `profile_img` | (Hex-encoded) Profile Image URL | **Yes** | `68747470733a2f2f692e736..` |
| `color` | (Hex-encoded) Card Color | **Yes** | `23366466316539` |
| `nickname` | Nickname | **Yes** | `therne` |


### GET `/dnft/moment.svg`

Renders Swirl Moment image as SVG.

| Name | Description | Required | Example |
|---|---|---|---|
| `profile_img` | (Hex-encoded) Profile Image URL | **Yes** | `68747470733a2f2f692e736...` |
| `color` | (Hex-encoded) Card Color | **Yes** | `23366466316539` |
| `nickname` | Nickname | **Yes** | `therne` |
| `met_at` | Moment Timestamp (POSIX) | **Yes** | `1659605937` |

