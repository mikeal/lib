#!/bin/sh
// 2>/dev/null; exec deno run --allow-read --allow-run "$0" "$@"

import { sources_markdown, file_uris_from_source } from "../deno-sources.js";

function showHelp() {
  console.log(`Usage: deno-sources <target> [options]

Options:
  --json, -j       Output the file URIs in JSON format.
  --markdown, -m   Output the source files in Markdown format (default).
  --help, -h       Show this help message.

Examples:
  deno-sources ./path/to/your/source.js --markdown
  deno-sources ./path/to/your/source.js --json
  deno-sources ./path/to/your/source.js -m
  deno-sources ./path/to/your/source.js -j
`);
}

// CLI Entry Point
if (import.meta.main) {
  if (Deno.args.length < 1 || Deno.args.length > 2) {
    showHelp();
    Deno.exit(1);
  }

  const target = Deno.args[0];
  const outputFormat = Deno.args[1] || "--markdown";

  if (outputFormat === "--help" || outputFormat === "-h") {
    showHelp();
    Deno.exit(0);
  }

  try {
    if (outputFormat === "--json" || outputFormat === "-j") {
      const uris = await file_uris_from_source(target);
      console.log(JSON.stringify(uris, null, 2));
    } else if (outputFormat === "--markdown" || outputFormat === "-m") {
      const markdown = await sources_markdown(target);
      console.log(markdown);
    } else {
      console.error("Invalid flag. Use --json, --markdown, -j, -m, --help, or -h.");
      Deno.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    Deno.exit(1);
  }
}

// Example usage for testing or debugging
// deno-sources ./path/to/your/source.js --markdown
// deno-sources ./path/to/your/source.js --json
// deno-sources ./path/to/your/source.js -m
// deno-sources ./path/to/your/source.js -j

