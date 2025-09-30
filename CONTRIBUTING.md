
# Contributing to tree-sitter-powerbuilder

Thank you for your interest in contributing to the PowerBuilder grammar for Tree-sitter! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Grammar Development](#grammar-development)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- tree-sitter CLI: `npm install -g tree-sitter-cli`
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/tree-sitter-powerbuilder.git
   cd tree-sitter-powerbuilder
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Generate the grammar:
   ```bash
   npm run ts:generate
   ```

5. Run tests to ensure everything works:
   ```bash
   npm run ts:test
   npm test
   ```

## Grammar Development

### Understanding the Grammar

The PowerBuilder grammar is defined in `grammar.js`. This file contains the rules that define how PowerBuilder code should be parsed.

### Key Grammar Concepts

- **Rules**: Define language constructs (e.g., functions, variables, statements)
- **Tokens**: Basic building blocks (keywords, operators, literals)
- **Precedence**: Defines operator precedence and associativity
- **Conflicts**: Handles ambiguous parsing situations

### Making Grammar Changes

1. Edit `grammar.js` to add or modify rules
2. Generate the updated parser:
   ```bash
   npm run ts:generate
   ```

3. Test your changes:
   ```bash
   npm run ts:test
   ```

4. Add test cases for new functionality in the `test/` directory (if it exists)

### Grammar Best Practices

- Use descriptive rule names that reflect PowerBuilder terminology
- Add comments to explain complex rules
- Consider performance implications of recursive rules
- Handle edge cases and error recovery
- Follow Tree-sitter naming conventions

## Testing

### Running Tests

```bash
# Run tree-sitter tests
npm run ts:test

# Run Node.js binding tests
npm test

# Run linting
npm run lint
```

### Adding Test Cases

When adding new grammar features:

1. Create test files in the `test/corpus/` directory
2. Use the Tree-sitter test format:
   ```
   ================================================================================
   Test name
   ================================================================================

   PowerBuilder code here

   --------------------------------------------------------------------------------

   (expected_tree_structure)
   ```

3. Run tests to verify your changes work correctly

### Testing with Real PowerBuilder Code

Test your grammar changes with real PowerBuilder code:

```bash
# Parse a PowerBuilder file
tree-sitter parse path/to/file.sru

# Parse and show the syntax tree
tree-sitter parse path/to/file.sru --debug
```

## Submitting Changes

### Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add support for new PowerBuilder feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request with:
   - Clear description of changes
   - Test cases for new functionality
   - Updated documentation if needed

### Commit Message Format

Use conventional commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test additions/changes
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

## Code Style

### Grammar Style

- Use consistent indentation (2 spaces)
- Group related rules together
- Use meaningful rule names
- Add comments for complex rules

### JavaScript Style

- Follow the ESLint configuration
- Use modern JavaScript features appropriately
- Keep functions focused and small

## Release Process

### Version Management

This project uses semantic versioning:
- **MAJOR**: Breaking changes to the grammar
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Creating Releases

Releases are automated through GitHub Actions:

1. Use the "Update Version" workflow to bump version
2. The workflow will create a tag and trigger the release process
3. GitHub releases and NPM publishing happen automatically

### Manual Release (if needed)

```bash
# Update version
npm version patch|minor|major

# Push changes and tags
git push && git push --tags
```

## Getting Help

- Open an issue for bugs or feature requests
- Use discussions for questions and ideas
- Check existing issues and PRs before creating new ones

## PowerBuilder Resources

- [PowerBuilder Documentation](https://docs.appeon.com/pb2022/)
- [PowerBuilder Language Reference](https://docs.appeon.com/pb2022/powerscript_reference/)
- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)

Thank you for contributing to tree-sitter-powerbuilder!
