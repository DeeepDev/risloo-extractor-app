import fs from "fs/promises";
import { constants, mkdir } from "fs";
import path from "path";
import { Buffer } from "buffer";
import sharp from 'sharp';
const Handlebars = require("../handlebars/init");

// Profiles JS Files and Template Files Directory
const profilesJSDir = path.join(__dirname, "..", "profiles");
const profilesTemplatesDir = path.join(__dirname, "..", "..", "views", "profiles");

let dates = [];

async function loadInputDataFile(inputData) {
  // Check Whether Input Data File Exists or Not
  try {
    await fs.access(inputData, constants.F_OK);
  } catch (err) {
    throw new Error("1 (Not Found): Input Data File Does Not Exist!");
  }

  return JSON.parse(await fs.readFile(inputData));
}

async function prepareProfileCTX(
  profileName,
  dataset,
  profileVariant,
  measure
) {
  const profileClass = await loadProfileJSFile(profileName);

  try {
    const profileObj = new profileClass(dataset, profileVariant);
    const ctx = {
      ...profileObj.getTemplateEngineParams(),
      variant: profileVariant,
      measure: measure,
    };

    return ctx;
  } catch (err) {
    throw new Error("2 (Profile JS Error): Error in Instantiating the Profile Object");
  }
}

async function loadProfileJSFile(profileName) {
  const jsFileDir = path.join(profilesJSDir, `${profileName}.js`);

  // Check Whether JS File Exists or Not
  try {
    await fs.access(jsFileDir, constants.F_OK);
  } catch (err) {
    throw new Error("3 (Invalid Name): Profile Name Is Not Valid");
  }

  return require(jsFileDir);
}

async function loadProfileTemplateFile(profileName) {
  const templateFileDir = path.join(profilesTemplatesDir, `${profileName}.hbs`);

  // Check Whether Template File Exists or Not
  try {
    await fs.access(templateFileDir, constants.F_OK);
  } catch (err) {
    throw new Error("4 (Not Found): Profile Template File Does Not Exist");
  }

  const data = await fs.readFile(templateFileDir);
  return data.toString();
}

async function renderTemplate(profileName, ctx) {
  const templateFile = await loadProfileTemplateFile(profileName);
  const template = Handlebars.compile(templateFile, "utf-8");
  try {
    const xml = template(ctx);

    return xml;
  } catch (err) {
    throw err;
  }
}

async function ensureDirExistence(dir) {
  try {
    await fs.access(dir, constants.F_OK);
  } catch (err) {
    mkdir(dir, (err) => {
      if (err) throw err;
    });
  }
}

async function createSVG(xml, outputPath) {
  const mapObj = {
    'text-anchor="start"': 'text-anchor="end"',
    'text-anchor="end"': 'text-anchor="start"',
  };

  const svg = xml.replace(
    /text-anchor="start"|text-anchor="end"/g,
    (matched) => mapObj[matched]
  );

  try {
    await fs.writeFile(outputPath, svg);
  } catch (err) {
    if (err) throw err;
  }
}

async function createPNG(xml, outputPath) {
  xml = xml.replace(/<style.*>.*<\/style>/s, "");
  const buf = Buffer.from(xml, "utf8");
  let png;
  try {
    png = await sharp(buf, { density: 500 });
  } catch (err) {
    if (err) throw err;
  }

  await png.toFile(outputPath, (err) => {
    if (err) throw err;
  });
}

function createOutputName(options, id) {
  return {
    outputFileName: `${options.dev ? options.profileName : id}${
      options.profileVariant === "with-sidebar" ? "" : ".raw"
    }${options.measure ? "-m" : ""}`,
    outputPath: path.join(options.outputAddress, !options.dev ? id : ""),
  };
}

async function createProfile(options, dataset) {
  const ctx = await prepareProfileCTX(
    options.profileName,
    dataset,
    options.profileVariant,
    options.measure
  );

  dates[2] = Date.now();

  console.log(
    `Context Creating Finished! It Took ${(dates[2] - dates[1]) / 1000} Seconds`
  );

  const xml = await renderTemplate(options.profileName, ctx);

  dates[3] = Date.now();

  console.log(
    `Handlebars Rendering Finished! It Took ${
      (dates[3] - dates[2]) / 1000
    } Seconds`
  );

  const { outputFileName, outputPath } = createOutputName(
    options,
    ctx.dataset.info.id
  );

  dates[4] = Date.now();

  console.log(
    `Output Name Finished! It Took ${(dates[4] - dates[3]) / 1000} Seconds`
  );

  await ensureDirExistence(outputPath);

  dates[5] = Date.now();

  console.log(
    `Ensuring Dir Existence Finished! It Took ${
      (dates[5] - dates[4]) / 1000
    } Seconds`
  );

  createSVG(xml, path.join(outputPath, `${outputFileName}.svg`));
  dates[6] = Date.now();

  console.log(`SVG Created! It Took ${(dates[6] - dates[5]) / 1000} Seconds`);
  createPNG(xml, path.join(outputPath, `${outputFileName}.png`));
  dates[7] = Date.now();

  console.log(`PNG Created! It Took ${(dates[7] - dates[6]) / 1000} Seconds`);
  console.log(`Total Time: ${(dates[7] - dates[0]) / 1000} Seconds`);
}

export default async function draw(options) {
  // Suppose that both input & output type are "local"

  dates[0] = Date.now();

  const dataset = await loadInputDataFile(options.inputData);

  dates[1] = Date.now();

  console.log(
    `Dataset Loading Finished! It Took ${(dates[1] - dates[0]) / 1000} Seconds`
  );

  if (options.profileVariant === "both") {
    await createProfile({ ...options, profileVariant: "raw" }, dataset);
    await createProfile(
      { ...options, profileVariant: "with-sidebar" },
      dataset
    );
  } else {
    await createProfile(options, dataset);
  }
}
