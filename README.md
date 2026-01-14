# Grammar & Spell Check App

A comprehensive grammar and spell checking web application built with React, TypeScript, and LanguageTool. Features intelligent highlighting, modal-based review workflow, and principles from Amy Einsohn's *The Copy Editor's Handbook*.

![Grammar Checker](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

### 📝 Rich Text Editor
- Powered by Lexical editor framework
- Real-time grammar and spelling checking
- Visual highlights for different issue types (errors, warnings, suggestions)
- Undo/redo support

### 🔍 Grammar Checking
- **LanguageTool Integration**: Uses the LanguageTool public API for comprehensive grammar and spell checking
- **Einsohn Principles**: Maps grammar rules to principles from *The Copy Editor's Handbook*
- **Real-time Analysis**: Automatically checks text with debouncing (1.5 seconds after typing stops)
- **Category Detection**: Identifies issues by category (grammar, spelling, punctuation, style, typography, consistency)

### 📊 Issues Sidebar
- Browse all detected issues grouped by category
- Filter issues by category
- Quick navigation to specific issues
- Shows issue count per category
- Collapsible for more workspace

### 💬 Issue Modal
- Step-through interface for reviewing each issue
- **Detailed Context**: Shows the error in context with highlighting
- **Multiple Suggestions**: Displays all suggested corrections from LanguageTool
- **Einsohn Integration**: Shows related principles from The Copy Editor's Handbook when available
- **Quick Actions**:
  - Accept first suggestion (or click any suggestion)
  - Skip/Reject issue
  - Navigate to next/previous issue
- **Keyboard Shortcuts**:
  - `←` Previous issue
  - `→` Next issue
  - `Esc` Close modal

### 📚 The Copy Editor's Handbook Integration

The app includes 30+ principles from Amy Einsohn's authoritative handbook, covering:

1. **Grammar & Syntax** (Chapters 6-7)
   - Subject-verb agreement
   - Pronoun-antecedent agreement
   - Parallel construction
   - Dangling and misplaced modifiers
   - Sentence fragments and run-ons

2. **Punctuation** (Chapter 4)
   - Serial comma (Oxford comma)
   - Comma usage
   - Apostrophes
   - Hyphenation
   - Em dashes and en dashes

3. **Style & Clarity** (Chapter 9)
   - Passive voice guidelines
   - Wordiness and redundancy
   - Ambiguous pronoun references
   - Jargon and technical terms

4. **Consistency** (Chapter 10)
   - Number style
   - Capitalization
   - Abbreviations and acronyms

5. **Typography** (Chapter 11)
   - Quotation marks
   - Ellipses
   - Spacing

Each grammar issue that maps to an Einsohn principle displays educational context in the modal, helping users learn proper grammar and style conventions.

### 📥 Import/Export
- **Import**: Load .txt or .md files
- **Paste**: Import text from clipboard
- **Copy**: Export corrected text to clipboard

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Text Editor**: Lexical (Facebook's modern editor framework)
- **State Management**: Zustand (lightweight, simple state management)
- **UI Components**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS
- **Grammar Engine**: LanguageTool public API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd grammar-checker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running the Production Build

```bash
npm run preview
```

## Usage

### Basic Workflow

1. **Enter or paste text** into the editor
2. **Wait 1.5 seconds** for automatic grammar checking
3. **Review issues** in the sidebar (grouped by category)
4. **Click an issue** to open the detail modal
5. **Review suggestions** and choose to accept or reject
6. **Navigate** through issues using the Next/Previous buttons or arrow keys
7. **Copy** your corrected text when done

### Tips

- **Modal Keyboard Shortcuts**: Use arrow keys to quickly navigate between issues
- **Sidebar Filters**: Click category names to filter issues (coming soon in future enhancement)
- **Einsohn Education**: Pay attention to the handbook principles shown in the modal to learn proper grammar rules
- **Import Files**: Drag and drop or use the Import button to load text files

## Architecture

### Project Structure

```
src/
├── components/
│   ├── Editor/           # Lexical editor components
│   ├── IssueModal/       # Modal for reviewing issues
│   ├── Sidebar/          # Issues sidebar
│   ├── Layout/           # App layout components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── languagetool/     # LanguageTool API client
│   ├── einsohn/          # Einsohn principles database
│   └── utils/            # Utility functions
├── store/                # Zustand stores
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

### Key Design Decisions

1. **Zustand for State Management**: Chosen over Redux for simplicity and less boilerplate. Three stores manage different concerns (grammar, editor, UI).

2. **Lexical Editor**: Facebook's modern editor framework provides extensibility for custom highlights and decorators.

3. **LanguageTool Public API**: No Docker setup required, but has rate limits (~20 requests/minute). Debouncing prevents excessive API calls.

4. **Einsohn Principles Mapping**: Custom database maps LanguageTool rule IDs to handbook principles for educational value.

5. **Issue Offset Management**: Critical logic in `useApplyFix.ts` handles adjusting offsets for remaining issues after text length changes.

## LanguageTool API Rate Limits

The app uses LanguageTool's **public API**, which has rate limits of approximately 20 requests per minute per IP address.

### Rate Limit Handling

- **Debouncing**: Checks are debounced by 1.5 seconds to avoid excessive requests
- **Error Messages**: Friendly error messages inform users if rate limits are hit
- **Retry**: Users can simply wait a moment and continue typing

### Self-Hosting LanguageTool (Optional)

For heavy usage or offline support, you can self-host LanguageTool:

1. Install Docker
2. Run LanguageTool:
   ```bash
   docker run -d -p 8010:8010 erikvl87/languagetool
   ```
3. Update `src/lib/languagetool/client.ts`:
   ```typescript
   const LANGUAGETOOL_API_URL = 'http://localhost:8010/v2/check';
   ```

## Known Limitations

1. **Highlight System**: The current implementation uses a simplified approach. A production version would use Lexical's decorator system or custom nodes for better integration with the editor.

2. **Large Documents**: Very large documents (>10,000 words) may experience slower grammar checking due to API latency.

3. **Rate Limits**: Public API rate limits may affect users with heavy usage patterns.

4. **Browser Compatibility**: Requires modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).

## Future Enhancements

- **Export Corrected Document**: Save corrected text as .txt or .md files
- **Custom Dictionary**: Add technical terms and proper nouns
- **Style Guide Presets**: Choose between AP, Chicago, MLA styles
- **Batch Actions**: Accept/reject all issues in a category
- **Advanced Highlighting**: Full Lexical decorator integration for better performance
- **Revision History**: Track changes and undo/redo corrected text
- **Offline Mode**: Cache LanguageTool results for offline use
- **Browser Extension**: Chrome/Firefox extension version

## Development

### Code Style

The project uses:
- **TypeScript strict mode** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for styling (following shadcn/ui conventions)

### Testing

To add tests (framework already configured with Vitest):

```bash
npm run test
```

## Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Share your experience using the app

## License

MIT License - feel free to use this project for learning or building your own grammar checker!

## Acknowledgments

- **LanguageTool**: Open-source grammar checking engine
- **Amy Einsohn**: Author of *The Copy Editor's Handbook*, the definitive guide for copy editors
- **Lexical**: Facebook's extensible text editor framework
- **shadcn/ui**: Beautiful, accessible component library
- **Zustand**: Simple and powerful state management

## Resources

- [LanguageTool API Documentation](https://languagetool.org/http-api/)
- [The Copy Editor's Handbook, 6th Edition](https://www.ucpress.edu/book/9780520271562/the-copyeditors-handbook)
- [Lexical Documentation](https://lexical.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

---

Built with ❤️ using React, TypeScript, and modern web technologies.
