// deno test file to test the module
import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { extract_file_uris, file_uris_from_source, sources_markdown } from "../deno-sources.js";

Deno.test("extract_file_uris should extract file URIs from a given text", async () => {
  const text = "Here is a file URI: file:///some/path/to/file.txt and another one: file:///another/path/file2.txt";
  const result = await extract_file_uris(text);
  assertEquals(result, ["file:///some/path/to/file.txt", "file:///another/path/file2.txt"]);
});

Deno.test("file_uris_from_source should extract file URIs from the current test file", async () => {
  const target = import.meta.url;
  const uris = await file_uris_from_source(target);
  assertStringIncludes(uris.join("\n"), "file://");
});

Deno.test("sources_markdown should generate markdown with source files", async () => {
  const target = import.meta.url;
  const markdown = await sources_markdown(target);
  assertStringIncludes(markdown, "# Source Files");
  assertStringIncludes(markdown, "##");
  assertStringIncludes(markdown, "```\n");
});

