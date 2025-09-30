# tree-sitter-powerbuilder

[![CI](https://i.ytimg.com/vi/GlqQGLz6hfs/sddefault.jpg)
[![NPM Version](https://www.jsdelivr.com/open-graph/image/npm/web-tree-sitter)
[![NPM Downloads](https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/250px-Npm-logo.svg.png)
[![License: MIT](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Software_Categories_expanded.svg/1200px-Software_Categories_expanded.svg.png)

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for PowerBuilder, providing syntax highlighting, code navigation, and parsing capabilities for PowerBuilder source files.

## Features

- 🎯 **Complete PowerBuilder Grammar**: Supports PowerBuilder syntax including objects, functions, events, and data types
- 🌐 **Multi-Platform**: Works on Linux, Windows, and macOS
- 📦 **Multiple Bindings**: Available for Node.js, Python, Rust, Go, Swift, and C
- 🚀 **WebAssembly Support**: Can be used in web browsers
- 🔧 **IDE Integration**: Compatible with editors that support Tree-sitter
- ⚡ **Fast Parsing**: Incremental parsing for efficient code analysis

## Supported File Types

- `.srs` - PowerBuilder Source (Application)
- `.srf` - PowerBuilder Source (Function)
- `.srw` - PowerBuilder Source (Window)
- `.sru` - PowerBuilder Source (User Object)
- `.sra` - PowerBuilder Source (Application)
- `.srm` - PowerBuilder Source (Menu)

## Installation

### NPM (Node.js)

```bash
npm install tree-sitter-powerbuilder
```

### Usage with Tree-sitter CLI

```bash
# Install tree-sitter CLI
npm install -g tree-sitter-cli

# Clone this repository
git clone https://github.com/pb-shrugged/tree-sitter-powerbuilder.git
cd tree-sitter-powerbuilder

# Generate the parser
tree-sitter generate

# Test the parser
tree-sitter test

# Parse a PowerBuilder file
tree-sitter parse path/to/your/file.sru
```

## Usage

### Node.js

```javascript
const Parser = require('tree-sitter');
const PowerBuilder = require('tree-sitter-powerbuilder');

const parser = new Parser();
parser.setLanguage(PowerBuilder);

const sourceCode = `
global type w_main from window
end type

on w_main.create
// Window creation code
end on
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
```

### Web (WebAssembly)

```html
<script src="https://unpkg.com/web-tree-sitter@^0.22.0/tree-sitter.js"></script>
<script>
(async () => {
  await TreeSitter.init();
  const parser = new TreeSitter();
  const Lang = await TreeSitter.Language.load('tree-sitter-powerbuilder.wasm');
  parser.setLanguage(Lang);
  
  const tree = parser.parse('your PowerBuilder code here');
  console.log(tree.rootNode.toString());
})();
</script>
```

## Development

### Prerequisites

- Node.js 18+
- tree-sitter CLI: `npm install -g tree-sitter-cli`

### Setup

```bash
git clone https://github.com/pb-shrugged/tree-sitter-powerbuilder.git
cd tree-sitter-powerbuilder
npm install
```

### Development Commands

```bash
# Generate the grammar
npm run ts:generate

# Run tests
npm run ts:test

# Build WebAssembly
npm run ts:run

# Lint code
npm run lint

# Run all tests
npm test
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **CI Workflow**: Runs tests on every push and pull request across multiple platforms
- **Release Workflow**: Automatically creates GitHub releases when tags are pushed
- **Publish Workflow**: Automatically publishes to NPM when releases are created
- **Security Workflow**: Regular security audits and dependency reviews

### Automated Releases

To create a new release:

1. Use the "Update Version" workflow in GitHub Actions, or
2. Manually create a tag: `git tag v1.0.0 && git push origin v1.0.0`

The release process will automatically:
- Create a GitHub release with assets
- Publish the package to NPM
- Generate cross-platform binaries

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm run ts:test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) for the parsing framework
- PowerBuilder community for language insights and feedback

## Links

- [NPM Package](https://www.npmjs.com/package/tree-sitter-powerbuilder)
- [GitHub Repository](https://github.com/pb-shrugged/tree-sitter-powerbuilder)
- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)
- [PowerBuilder Documentation](https://docs.appeon.com/pb2022/)