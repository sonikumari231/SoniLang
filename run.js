#!/usr/bin/env node
const fs = require("fs");
const readline = require("readline-sync");

const fileName = process.argv[2];

if (!fileName) {
  console.log("Usage: node run.js file.soni");
  process.exit(1);
}

const code = fs.readFileSync(fileName, "utf8");

let memory = {};

const lines = code.split("\n");

for (let line of lines) {

  line = line.trim();
  if (!line) continue;

  // ===== INT =====
  if (line.startsWith("int")) {

    let parts = line.replace(";", "").split("=");

    let name = parts[0].replace("int", "").trim();
    let valuePart = parts[1].trim();

    // input("message")
    if (valuePart.startsWith("input")) {

      let msg = valuePart
        .replace("input(", "")
        .replace(")", "")
        .replace(/"/g, "");

      let num = readline.question(msg);

      memory[name] = Number(num);
    }
    else {
      memory[name] = Number(valuePart);
    }
  }

  // ===== STRING =====
  else if (line.startsWith("string")) {

    let parts = line.replace(";", "").split("=");

    let name = parts[0].replace("string", "").trim();
    let valuePart = parts[1].trim();

    if (valuePart.startsWith("input")) {

      let msg = valuePart
        .replace("input(", "")
        .replace(")", "")
        .replace(/"/g, "");

      memory[name] = readline.question(msg);
    }
    else {
      memory[name] = valuePart.replace(/"/g, "");
    }
  }

  // ===== PRINT =====
else if (line.startsWith("print")) {
  let value = line
    .replace("print(", "")
    .replace(");", "")
    .trim();

  // ✅ print("text") or print('text')
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    console.log(value.slice(1, -1));
  }
  // ✅ print(variable)
  else {
    console.log(memory[value]);
  }
}
}