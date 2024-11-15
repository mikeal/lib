#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run
import { confirm } from "jsr:@nathanwhit/promptly";
import { diff } from "jsr:@libs/diff";

if (Deno.args.length !== 2) {
  console.error(`Usage: diffr.js <new_content> <file_to_replace>
`);
  Deno.exit(1);
}

const newContent = Deno.args[0];
const filePath = Deno.args[1];

const fileContent = await Deno.readTextFile(filePath);

if (fileContent === newContent) {
  console.log("No changes detected."); 
  Deno.exit(0);
}

// Use the diff library to compare the file content with the new content
const _diff = diff(fileContent, newContent);

console.log("Proposed changes:");
console.log(_diff);

if (await confirm("Do you want to apply these changes?")) {
  await Deno.writeTextFile(filePath, newContent);
  console.log("Changes applied.");
}

