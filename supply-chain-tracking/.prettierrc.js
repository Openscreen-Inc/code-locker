module.exports = {
  semi: false,                    // Semi-colons
  useTabs: false,                 // Indent lines with tabs instead of spaces
  tabWidth: 2,                    // Number of spaces per indentation-level
  endOfLine: 'lf',                // Unix-style line feed only (\n)
  quoteProps: 'as-needed',        // Only add quotes around object properties where required
  proseWrap: 'preserve',          // Respect line breaks in markdown
  printWidth: 120,                // Larger print width to account for TypeScript type annotations
  arrowParens: 'always',          // Include parentheses around sole arrow function parameter
  singleQuote: true,              // Single quotes instead of double quotes
  insertPragma: false,            // Insert "@format" pragma at the top of files specifying that the file has been formatted with prettier
  requirePragma: false,           // Restrict Prettier to only format files that contain a pragma at the top of the file
  trailingComma: 'all',           // For ES5, trailing commas cannot be used in function parameters
  bracketSpacing: false,          // Print spaces between brackets in object literals
  jsxSingleQuote: false,          // Use single quotes instead of double quotes in JSX
  vueIndentScriptAndStyle: false, // Whether or not to indent the code inside <script> and <style> tags in Vue files
}
