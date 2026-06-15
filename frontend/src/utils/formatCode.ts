// Devuelve el parser de Prettier adecuado según el lenguaje del archivo.
function parserForLanguage(language: string): string | null {
  switch (language) {
    case "javascript":
      return "babel";
    case "typescript":
      return "babel-ts";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    case "markdown":
      return "markdown";
    default:
      return null;
  }
}

// Indica si un lenguaje se puede formatear.
export function canFormat(language: string): boolean {
  return parserForLanguage(language) !== null;
}

// Formatea el código con Prettier. Prettier y sus plugins se cargan de forma
// diferida (dynamic import) para no engordar el bundle inicial: solo se
// descargan la primera vez que el usuario pulsa "Formatear".
export async function formatCode(
  code: string,
  language: string
): Promise<string> {
  const parser = parserForLanguage(language);
  if (!parser) return code;

  const [
    prettier,
    parserBabel,
    parserHtml,
    parserPostcss,
    parserMarkdown,
    prettierPluginEstree,
  ] = await Promise.all([
    import("prettier/standalone"),
    import("prettier/plugins/babel"),
    import("prettier/plugins/html"),
    import("prettier/plugins/postcss"),
    import("prettier/plugins/markdown"),
    import("prettier/plugins/estree"),
  ]);

  return prettier.format(code, {
    parser,
    plugins: [
      parserBabel,
      parserHtml,
      parserPostcss,
      parserMarkdown,
      prettierPluginEstree,
    ],
    semi: true,
    singleQuote: false,
  });
}
