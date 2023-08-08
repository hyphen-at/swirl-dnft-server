import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import {
  Application,
  Router,
  helpers,
} from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { encode as encodeBase64 } from "https://deno.land/std@0.194.0/encoding/base64.ts";
import oakLogger from "https://deno.land/x/oak_logger@1.0.0/mod.ts";
import { render } from "https://deno.land/x/resvg_wasm/mod.ts";

function decodeHex(hexString: string): string {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hexString");
  }
  const bytes = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

const [nametagSvgTemplate, momentTemplate, calendarIconTemplate] = await Promise.all([
  Deno.readTextFile("./assets/nametag.svg"),
  Deno.readTextFile("./assets/moment.svg"),
  Deno.readTextFile("./assets/calendar-icon.svg"),
]);

function renderSvgTemplate(template: string, args: Record<string, string>) {
  let rendered = template;
  for (const [key, value] of Object.entries(args)) {
    rendered = rendered.replace(`{{${key}}}`, value);
  }
  return rendered;
}

const router = new Router();
router.get("/", (context) => {
  context.response.body = {
    message: "Swirl!",
  };
});

router.get("/dnft/nametag.svg", async (ctx) => {
  const {
    profile_img: profileImageUrl,
    nickname,
    color,
  } = helpers.getQuery(ctx);
  const profileImage = await fetch(decodeHex(profileImageUrl)).then((res) =>
    res.arrayBuffer()
  );

  ctx.response.headers.set("Content-Type", "image/svg+xml");
  ctx.response.body = renderSvgTemplate(nametagSvgTemplate, {
    profileImageData: encodeBase64(profileImage),
    nickname,
    color: decodeHex(color),
  });
});

router.get("/dnft/moment.svg", async (ctx) => {
  const {
    profile_img: profileImageUrl,
    nickname,
    color,
    met_at: metAt,
  } = helpers.getQuery(ctx);
  const profileImage = await fetch(decodeHex(profileImageUrl)).then((res) =>
    res.arrayBuffer()
  );

  ctx.response.headers.set("Content-Type", "image/svg+xml");
  ctx.response.body = renderSvgTemplate(momentTemplate, {
    profileImageData: encodeBase64(profileImage),
    nickname,
    color: decodeHex(color),
    metAt: new Date(Number(metAt) * 1000).toLocaleDateString("en-US"),
  });
});

router.get('/assets/calendar.svg', async (ctx) => {
  const { day = '5' } = helpers.getQuery(ctx);
  ctx.response.headers.set("Content-Type", "image/png");
  ctx.response.body = await render(renderSvgTemplate(calendarIconTemplate, { day }));
});


const app = new Application();
app.use(oakCors());
app.use(oakLogger.logger);
app.use(router.routes());
app.use(router.allowedMethods());

console.log("server running on port http://localhost:8000");
await app.listen({ port: 8000 });
