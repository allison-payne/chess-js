# VS Code Setup for Chess.js Project

This document outlines the recommended VS Code extensions and configuration for optimal development experience with this TypeScript React chess application.

## 🎯 Recommended Extensions

The project includes a `.vscode/extensions.json` file with curated extension recommendations. When you open this workspace, VS Code will prompt you to install the recommended extensions.

### Core Development Extensions

**TypeScript & React:**

- `ms-vscode.vscode-typescript-next` - Enhanced TypeScript language support
- `ms-vscode.vscode-react-refactor` - React refactoring tools
- `rodrigovallades.es7-react-js-snippets` - ES7+ React/Redux/GraphQL snippets
- `burkeholland.simple-react-snippets` - Simple React snippets

**Code Quality:**

- `esbenp.prettier-vscode` - Code formatter
- `ms-vscode.vscode-eslint` - ESLint integration
- `usernamehw.errorlens` - Inline error/warning display
- `streetsidesoftware.code-spell-checker` - Spell checking

**Styling (Emotion/styled-components):**

- `styled-components.vscode-styled-components` - Syntax highlighting for styled-components
- `jpoissonnier.vscode-styled-components` - Additional styled-components support
- `ms-vscode.vscode-css-peek` - CSS peek and goto definition

**Git & Version Control:**

- `eamodio.gitlens` - Enhanced Git capabilities
- `github.vscode-pull-request-github` - GitHub integration
- `donjayamanne.githistory` - Git history visualization

**Productivity:**

- `christian-kohler.path-intellisense` - Autocomplete for file paths
- `formulahendry.auto-rename-tag` - Auto rename paired HTML/JSX tags
- `alefragnani.bookmarks` - Bookmark lines in code
- `gruntfuggly.todo-tree` - TODO/FIXME highlighting
- `aaron-bond.better-comments` - Enhanced comment styling

## ⚙️ Workspace Configuration

### Automatic Setup

The workspace includes several configuration files that are automatically applied:

- **`.vscode/settings.json`** - Workspace-specific settings
- **`.vscode/tasks.json`** - Build and development tasks
- **`.vscode/launch.json`** - Debug configurations
- **`.prettierrc`** - Code formatting rules

### Key Features Enabled

1. **Format on Save** - Automatically formats code when saving
2. **ESLint Integration** - Real-time linting with auto-fix
3. **TypeScript Enhancements** - Inlay hints, auto-imports, and better IntelliSense
4. **Styled-Components Support** - Syntax highlighting and IntelliSense for CSS-in-JS
5. **Git Integration** - Enhanced Git features with GitLens
6. **Error Visualization** - Inline error display with Error Lens

## 🚀 Development Workflow

### Quick Commands

- **Ctrl+Shift+P** → "Tasks: Run Task" to access build tasks
- **F5** - Start debugging session
- **Ctrl+`** - Open integrated terminal
- **Ctrl+Shift+E** - Toggle file explorer

### Available Tasks

- `dev` - Start development server (default build task)
- `build` - Build for production
- `lint` - Run ESLint
- `preview` - Preview production build
- `install dependencies` - Install npm packages

### Debugging

The workspace includes debug configurations for:

- Chrome debugging with source maps
- Edge debugging (alternative)

## 🎨 Themes & Icons

**Recommended Visual Enhancements:**

- `pkief.material-icon-theme` - Material Design icons
- `zhuangtongfa.material-theme` - Material theme variants

## 📦 Package Management

**NPM Integration:**

- `christian-kohler.npm-intellisense` - NPM module autocomplete
- `eg2.vscode-npm-script` - NPM script runner
- `mskelton.npm-outdated` - Check for outdated packages

## 🔧 Custom Settings

### TypeScript Configuration

- Single quotes preferred
- Relative import paths
- Auto-import suggestions enabled
- Inlay hints for better code readability

### Formatting Rules

- 2-space indentation
- Single quotes for strings
- Trailing commas in ES5 contexts
- 80-character line width
- Semicolons enabled

### File Organization

- File nesting enabled for related files
- Optimized search exclusions
- Smart file associations

## 🎯 Chess Project Specific Features

### Code Organization

The setup is optimized for the chess application's structure:

- React component development
- TypeScript strict mode
- Emotion/styled-components styling
- Framer Motion animations
- Chess.js library integration

### Development Experience

- Live reloading during development
- Source map debugging
- Real-time error highlighting
- Automatic code formatting
- Import organization

## 📝 Tips for Chess Development

1. **Component Development**: Use React snippets for faster component creation
2. **Styling**: Leverage styled-components extensions for CSS-in-JS development
3. **Type Safety**: Enable TypeScript strict mode for better chess logic validation
4. **Debugging**: Use Chrome DevTools integration for debugging game state
5. **Performance**: Monitor re-renders and optimize with React DevTools

## 🔄 Staying Updated

To keep your development environment current:

1. Regularly update extensions through VS Code Extensions panel
2. Check for TypeScript updates: `npm update typescript`
3. Update ESLint and Prettier: `npm update eslint prettier`

## 🆘 Troubleshooting

**Common Issues:**

- If formatting doesn't work, ensure Prettier is set as default formatter
- For TypeScript errors, restart the TypeScript language server: Ctrl+Shift+P → "TypeScript: Restart TS Server"
- If ESLint isn't working, check the ESLint output panel for errors

---

This setup provides a professional development environment optimized for TypeScript React applications with a focus on code quality, productivity, and the specific needs of chess game development.
