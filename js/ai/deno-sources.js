export async function extract_file_uris(text) {
  const fileUriPattern = /file:\/\/[^\s]+/g;
  const matches = text.match(fileUriPattern);
  return matches || [];
}

export async function file_uris_from_source(target) {
  const process = Deno.run({
    cmd: ["deno", "info", target],
    stdout: "piped",
    stderr: "piped",
  });

  const output = await process.output();
  const error = await process.stderrOutput();
  process.close();

  if (error.length > 0) {
    throw new Error(new TextDecoder().decode(error));
  }

  return extract_file_uris(new TextDecoder().decode(output));
}

export async function sources_markdown(target, cwd = Deno.cwd()) {
  const uris = await file_uris_from_source(target);

  // TODO: read files into an object keyed by filename relative to cwd
  const filesContent = {};
  for (const uri of uris) {
    const filePath = uri.replace('file://', '');
    const relativePath = filePath.replace(cwd + '/', '');
    try {
      const content = await Deno.readTextFile(filePath);
      filesContent[relativePath] = content;
    } catch (e) {
      console.error(`Failed to read file ${relativePath}:`, e);
    }
  }

  // TODO: create a markdown string with each file embedded in markdown that is suitable for AI
  let markdownString = "# Source Files\n\n";
  for (const [filename, content] of Object.entries(filesContent)) {
    const fileExtension = filename.split('.').pop();
    const language = fileExtension ? fileExtension : "";
    markdownString += `## ${filename}\n\n`;
    markdownString += "```" + language + "\n";
    markdownString += `${content}\n`;
    markdownString += "```\n\n";
  }

  return markdownString;
}

// Example usage
// sources_markdown("./path/to/your/source.js").then(console.log).catch(console.error);

