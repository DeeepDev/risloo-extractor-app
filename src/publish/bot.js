const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const Handlebars = require("handlebars");
const readline = require("readline");
const https = require("https");
require("dotenv").config();

// New version image hbs directory
const templateDir = path.join(__dirname, "new-version.hbs");

// Version to be Released
// Remember you should run this script using 'npm ...' command to have npm environment variables
const version = process.env.npm_package_version;

// Telegram Bot Info (Bot Token Should Be Manually Provided Using dotenv)
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = "-651191778";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const releaseNotes = [];

rl.setPrompt("Release Notes:\n");

rl.prompt();

rl.on("line", function (ln) {
  releaseNotes.push(ln);
});

// Press Ctrl+C to Just Exit
rl.on("SIGINT", () => process.exit(0));

// Press Ctrl+D to Emit 'close' Event and Send Release Notes
rl.on("close", sendReleaseNotes);

// Returns Buffer of New Version Image
async function createReleaseImage() {
  return fs
    .readFile(templateDir)
    .then((templateBuffer) => {
      const template = Handlebars.compile(templateBuffer.toString(), "utf-8");
      let ctx = {
        version,
      };
      const xml = template(ctx);

      const buf = Buffer.from(xml, "utf8");
      return sharp(buf).jpeg({ quality: 100 }).toBuffer();
    })
    .catch((err) => {
      throw err;
    });
}

async function sendReleaseNotes() {
  // Text to be Sent
  const caption = `Version *${version}* Released!\n\n_Release Notes:_\n${releaseNotes.join("\n")}`;
  // const photoBuf = await createReleaseImage();

  // Data in JSON
  const data = JSON.stringify({
    chat_id: chatId,
    text: caption,
    parse_mode: "Markdown"
  });

  // HTTP Request Options (URL & Headers & Method)
  const options = {
    hostname: "api.telegram.org",
    path: `/bot${token}/sendMessage`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}
