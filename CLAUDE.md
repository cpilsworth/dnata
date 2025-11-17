# CLAUDE.md - AI Assistant Guide for DNATA AEM Project

## Project Overview

This is an **Adobe Experience Manager (AEM) Edge Delivery Services** project built on the AEM Block Collection foundation. It combines modern web frontend components with edge compute capabilities to deliver high-performance content experiences.

**Key Characteristics:**
- **Frontend**: Block-based component architecture using vanilla JavaScript
- **Backend**: Fastly Compute edge functions for server-side processing
- **Content**: da.live (Document Authoring) content platform integration
- **Editing**: Universal Editor (UE) support for in-context content editing
- **License**: Apache License 2.0

## Repository Structure

```
/home/user/dnata/
├── blocks/                    # 16 reusable UI component blocks
│   ├── accordion/            # Collapsible content sections
│   ├── cards/               # Card grid layouts (common pattern: decorate function)
│   ├── carousel/            # Image/content carousel
│   ├── columns/             # Responsive column layouts
│   ├── embed/               # Embedded content (iframe, media)
│   ├── footer/              # Site footer navigation
│   ├── form/                # Form submission handling
│   ├── fragment/            # Reusable content fragments
│   ├── header/              # Site header and navigation
│   ├── hero/                # Hero banner sections
│   ├── modal/               # Modal dialog overlays
│   ├── quote/               # Quotes and testimonials
│   ├── search/              # Search functionality
│   ├── table/               # Data table rendering
│   ├── tabs/                # Tabbed content interface
│   └── video/               # Video player embedding
│
├── compute/                  # Fastly Compute edge functions
│   ├── src/
│   │   ├── index.js         # Main router (5 endpoints: /, /hello-world, /weather, /skywards, /esi)
│   │   ├── weather.js       # Weather API integration
│   │   ├── skywards.js      # Skywards loyalty integration
│   │   ├── esi.js           # Edge Side Includes support
│   │   ├── templates.js     # Mustache template rendering
│   │   └── lib/             # Utilities (config, logging, response)
│   ├── test/                # Mocha test suite
│   ├── config/              # Configuration files (gitignored secrets)
│   ├── fastly.toml          # Fastly service configuration
│   ├── Makefile             # Build and deployment automation
│   └── package.json         # Compute dependencies
│
├── ue/                      # Universal Editor configuration
│   ├── models/
│   │   ├── blocks/          # 10 block-specific UE configs (JSON)
│   │   ├── component-*.json # Schema definitions (definitions, models, filters)
│   │   ├── section.json     # Section component config
│   │   ├── page.json        # Page metadata config
│   │   └── image.json, text.json  # Basic element configs
│   └── scripts/             # UE-specific JavaScript
│
├── scripts/                 # Core frontend JavaScript
│   ├── aem.js              # Core AEM utilities (block loading, decoration, RUM)
│   ├── scripts.js          # Auto-block generation, page decoration
│   ├── sidekick.js         # Sidekick plugin configuration
│   ├── context.js          # Context utilities
│   └── delayed.js          # Delayed script loading
│
├── styles/                  # Global CSS
│   ├── styles.css          # Main stylesheet (5KB)
│   ├── fonts.css           # Font definitions
│   ├── context.css         # Context-specific styles
│   └── lazy-styles.css     # Lazy-loaded styles
│
├── tools/                   # Development utilities
│   ├── demo/               # Demo application
│   ├── demo-app/           # Demo app components
│   └── sidekick/           # Sidekick configuration
│
├── fonts/                   # Web font files
├── icons/                   # SVG icon assets
├── .well-known/            # Web standards metadata (e.g., cloudmanager-challenge.txt)
│
├── Configuration Files:
│   ├── fstab.yaml          # Content source mount point (da.live)
│   ├── package.json        # Root npm config (linting, build scripts)
│   ├── .eslintrc.js        # ESLint rules (Airbnb base)
│   ├── .stylelintrc.json   # CSS linting rules
│   ├── .renovaterc.json    # Automated dependency updates
│   ├── .husky/             # Git hooks (pre-commit)
│   └── head.html           # Default HTML head injection
│
└── .github/
    └── workflows/
        └── main.yaml       # CI/CD: lint on push (Node 20)
```

## Technology Stack

### Frontend
- **AEM Edge Delivery Services**: Adobe's modern web delivery platform
- **Vanilla JavaScript**: No framework dependencies, pure DOM manipulation
- **HTML/CSS**: Semantic markup with modern CSS (Grid, Flexbox)
- **da.live**: Document-based content authoring
- **Universal Editor**: In-context WYSIWYG editing

### Backend/Edge Compute
- **Fastly Compute@Edge**: JavaScript edge computing (WASM runtime)
- **@fastly/expressly**: Express-like routing framework
- **@fastly/js-compute**: Fastly JavaScript runtime
- **Mustache**: Template rendering engine

### Development Tools
- **Node.js 20**: JavaScript runtime (minimum version)
- **Mocha**: Test framework
- **ESLint** (Airbnb): JavaScript linting
- **StyleLint**: CSS linting
- **Husky**: Git hooks management
- **npm-run-all**: Parallel script execution
- **merge-json-cli**: JSON configuration merging

### CI/CD
- **GitHub Actions**: Automated linting on every push
- **Renovate**: Automated dependency updates
- **AEM Code Sync**: GitHub app for content synchronization

## Development Setup

### Initial Setup

```bash
# 1. Install AEM CLI globally
npm install -g @adobe/aem-cli

# 2. Clone repository
git clone <repository-url>
cd dnata

# 3. Install dependencies
npm install

# 4. Start local development server
aem up
# Server runs at http://localhost:3000
```

### Compute/Edge Development

```bash
cd compute

# Install dependencies
npm install

# Build Fastly Compute package (compiles to WASM)
make build
# or: npm run build

# Run tests
make test
# or: npm test

# Start local Fastly server
make serve
# Server runs at http://127.0.0.1:7676

# Deploy to Fastly (requires AEM_COMPUTE_SERVICE env var)
make deploy AEM_COMPUTE_SERVICE=<service-id>

# View logs
make tail-logs AEM_COMPUTE_SERVICE=<service-id>
```

### Common Commands

```bash
# Linting
npm run lint              # Run all linting (JS + CSS)
npm run lint:js           # ESLint only
npm run lint:css          # StyleLint only

# Build UE configuration
npm run build:json        # Merge all UE JSON configs
npm run build:json:models      # Merge component models
npm run build:json:definitions # Merge component definitions
npm run build:json:filters     # Merge component filters

# Git hooks
npm run prepare           # Install Husky hooks
```

## Block Development Patterns

### Block Structure

Each block follows this structure:
```
blocks/block-name/
├── block-name.js    # Decorator function (default export)
└── block-name.css   # Block-specific styling
```

### Block Decorator Pattern

```javascript
// blocks/cards/cards.js
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // 1. Transform DOM structure
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // 2. Add semantic classes
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });

  // 3. Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    );
  });

  // 4. Replace block content
  block.replaceChildren(ul);
}
```

### Key Block Patterns

1. **Default Export**: Every block exports a `decorate(block)` function
2. **DOM Transformation**: Restructure block HTML for semantic markup
3. **Class-based Styling**: Use BEM-like naming (`block-name__element`)
4. **Image Optimization**: Use `createOptimizedPicture()` from aem.js
5. **No Direct Rendering**: Transform existing DOM, don't create from scratch
6. **Lazy Loading**: Blocks load only when needed via Intersection Observer

### Importing AEM Utilities

```javascript
import {
  createOptimizedPicture,  // Create responsive picture elements
  decorateIcons,           // Replace :icon-name: with SVG
  loadBlock,               // Manually load a block
  loadBlocks,              // Load multiple blocks
  loadCSS,                 // Load CSS file dynamically
  sampleRUM,              // Real User Monitoring
  getMetadata,            // Get page metadata
  toClassName,            // Convert text to class name
} from '../../scripts/aem.js';
```

## Edge Compute Development

### Router Pattern

```javascript
// compute/src/index.js
import { Router } from "@fastly/expressly";
import * as response from './lib/response.js';
import { log } from './lib/log.js';

const router = new Router();

// Middleware: Response logging
router.use((req, res) => {
  res.on("finish", (finalResponse) => {
    log(req, finalResponse);
  });
});

// Error handling
router.use((err, req, res) => {
  if (err.status === 404) {
    res.send(response.notFound());
  } else {
    console.log(err);
    res.send(response.error());
  }
});

// Route handlers
router.get("/weather", async (req, res) => {
  return res.send(await weatherHandler(req));
});

router.listen();
```

### Current Endpoints

1. **GET /** - Hello world response
2. **GET /hello-world** - Hello world response
3. **GET /weather** - Weather API integration
4. **GET /skywards** - Skywards loyalty integration
5. **GET /esi** - Edge Side Includes processing

### Secret Store Usage

```javascript
// compute/src/lib/config.js
import { env, ConfigStore } from "@fastly/js-compute";

export function getSecretStore(storeName) {
  const secretStore = new ConfigStore(storeName);
  return secretStore;
}
```

## Universal Editor Configuration

### UE Model Structure

Each block in `/ue/models/blocks/` has three sections:

```json
{
  "definitions": [
    {
      "title": "Block Name",
      "id": "block-id",
      "plugins": {
        "da": {
          "unsafeHTML": "<div class='block-name'>...</div>"
        }
      }
    }
  ],
  "models": [
    {
      "id": "block-id",
      "fields": [
        {
          "component": "text",
          "name": "title",
          "label": "Title",
          "valueType": "string"
        }
      ]
    }
  ],
  "filters": [
    {
      "id": "block-id",
      "components": ["text", "image"]
    }
  ]
}
```

### Field Mapping Pattern

Fields use CSS selectors to map to DOM elements:
```json
{
  "component": "reference",
  "valueType": "string",
  "name": "image",
  "label": "Image",
  "multi": false
}
```

### Building UE Configs

```bash
npm run build:json
# Merges all /ue/models/**/*.json files into root-level:
# - component-models.json
# - component-definition.json
# - component-filters.json
```

## Code Conventions

### JavaScript

**ESLint Configuration** (.eslintrc.js):
- **Base**: Airbnb style guide
- **Extensions Required**: Use `.js` in all imports
  ```javascript
  import { func } from './module.js'; // ✓ Correct
  import { func } from './module';    // ✗ Wrong
  ```
- **Line Breaks**: Unix (LF) only
- **Parameter Reassignment**: Allowed for object properties
  ```javascript
  function update(obj) {
    obj.prop = 'value'; // ✓ Allowed
  }
  ```
- **Cyclic Imports**: Allowed (modules can import each other)

### CSS

**StyleLint Configuration** (.stylelintrc.json):
- **Base**: `stylelint-config-standard`
- **Scope**: All block CSS and global styles
- **Conventions**:
  - Use BEM-like naming
  - Scope styles to block class (`.block-name`)
  - Avoid global selectors

### Naming Conventions

- **Blocks**: Kebab-case (`accordion`, `hero`, `cards`)
- **Classes**: Kebab-case BEM-like (`.cards-card-image`)
- **Files**: Match block name (`cards.js`, `cards.css`)
- **Functions**: camelCase (`decorate`, `createOptimizedPicture`)

### File Organization

- **Block JS**: Import utilities, export single `decorate()` function
- **Block CSS**: Single file, scoped to block class
- **Compute**: Separate handler files for each feature
- **Tests**: Mirror source structure in `/compute/test/`

## Content Source Configuration

### fstab.yaml

```yaml
mountpoints:
  /:
    url: https://content.da.live/aemsites/da-block-collection/
    type: markup
```

**Purpose**: Maps root path to da.live content source

**Key Points**:
- Content is authored in da.live
- AEM Code Sync GitHub app pushes updates
- Content is markup (Markdown/HTML)
- Changes to fstab.yaml require re-deployment

## Testing

### Frontend Testing
- Currently no automated frontend tests
- Manual testing via AEM CLI (`aem up`)
- Use browser DevTools for debugging

### Compute Testing

```bash
cd compute
npm test  # or: make test
```

- Framework: Mocha
- Location: `/compute/test/`
- Pattern: Mirror source structure
- Run locally before deploying

## CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/main.yaml**:
```yaml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: 20
    - run: npm ci
    - run: npm run lint
```

**Triggers**: Every push to any branch
**Checks**: JavaScript + CSS linting
**Required**: All checks must pass

### Git Hooks (Husky)

Configured in `.husky/` directory:
- **Pre-commit**: Runs linting before commit
- **Installation**: Automatic via `npm install`

## Deployment

### Frontend Deployment

Frontend is automatically deployed via AEM Edge Delivery Services:
1. Push code to `main` branch
2. AEM Code Sync detects changes
3. Content is published to edge
4. No manual deployment needed

### Compute Deployment

```bash
cd compute

# Build WASM package
make build

# Deploy to Fastly
make deploy AEM_COMPUTE_SERVICE=<service-id>

# Verify deployment
make tail-logs AEM_COMPUTE_SERVICE=<service-id>
```

**Requirements**:
- Fastly CLI installed
- `AEM_COMPUTE_SERVICE` environment variable set
- Fastly API token configured

## Common Tasks for AI Assistants

### Creating a New Block

1. **Create directory**:
   ```bash
   mkdir blocks/new-block
   ```

2. **Create JS file** (blocks/new-block/new-block.js):
   ```javascript
   export default function decorate(block) {
     // Transform block DOM
   }
   ```

3. **Create CSS file** (blocks/new-block/new-block.css):
   ```css
   .new-block {
     /* Block styles */
   }
   ```

4. **Optional: Create UE config** (ue/models/blocks/new-block.json):
   ```json
   {
     "definitions": [...],
     "models": [...],
     "filters": [...]
   }
   ```

5. **Build UE configs**:
   ```bash
   npm run build:json
   ```

6. **Test locally**:
   ```bash
   aem up
   ```

### Adding a Compute Endpoint

1. **Create handler file** (compute/src/feature.js):
   ```javascript
   export async function featureHandler(req) {
     const response = new Response("Feature response", {
       status: 200,
       headers: { "Content-Type": "text/html" }
     });
     return response;
   }
   ```

2. **Add route** (compute/src/index.js):
   ```javascript
   import { featureHandler } from "./feature.js";

   router.get("/feature", async (req, res) => {
     return res.send(await featureHandler(req));
   });
   ```

3. **Test locally**:
   ```bash
   cd compute
   npm test
   make serve
   ```

4. **Deploy**:
   ```bash
   make deploy AEM_COMPUTE_SERVICE=<service-id>
   ```

### Modifying Block Behavior

1. **Read block code**: `/home/user/dnata/blocks/<block-name>/<block-name>.js`
2. **Understand decorate function**: How it transforms DOM
3. **Make changes**: Modify DOM transformation logic
4. **Update CSS if needed**: Match new DOM structure
5. **Test locally**: `aem up` and verify changes
6. **Lint**: `npm run lint`
7. **Commit**: Follow conventional commit messages

### Debugging Tips

1. **Frontend**:
   - Use browser DevTools
   - Check console for RUM events
   - Inspect block classes and structure
   - Verify image optimization

2. **Compute**:
   - Check logs: `make tail-logs`
   - Test locally: `make serve`
   - Use `console.log()` for debugging
   - Verify response headers and status

3. **Content**:
   - Check fstab.yaml mount point
   - Verify da.live content exists
   - Check AEM Code Sync app installation

## Important Patterns and Gotchas

### Block Loading

- Blocks are **lazy-loaded** by default
- Loaded when visible (Intersection Observer)
- Eager blocks: Add `data-block-eager` attribute
- Load order: Eager → LCP → Lazy

### Image Optimization

Always use `createOptimizedPicture()`:
```javascript
createOptimizedPicture(
  img.src,           // Source URL
  img.alt,           // Alt text
  false,             // Eager loading?
  [{ width: '750' }] // Breakpoints
)
```

### Icon Handling

Icons use special syntax in content:
```
:icon-name:
```

Decorated via `decorateIcons()` function, which replaces with SVG from `/icons/icon-name.svg`.

### Auto-blocks

Some blocks are **auto-generated** (scripts/scripts.js):
- **Hero**: H1 + Picture in first section
- **Modal**: Links with `#modal` or `data-modal-path`

### Context Support

Project supports context-aware rendering:
- Check `context.js` and `context.css`
- Used for personalization or A/B testing

### RUM (Real User Monitoring)

- Automatically collects performance metrics
- Sampling: 1% of users (100% with `?rum=on`)
- Checkpoints: top, lazy, cwv, error, etc.
- Data sent to `https://rum.hlx.page`

### ESI (Edge Side Includes)

Compute service supports ESI via `/esi` endpoint:
- Include dynamic content at edge
- Useful for personalization
- See `compute/src/esi.js` for implementation

## Key Files Reference

### Critical Frontend Files
- **/scripts/aem.js** - Core AEM utilities (21KB, 600+ lines)
- **/scripts/scripts.js** - Page decoration, auto-blocks
- **/head.html** - HTML head injection (meta tags, preconnect)
- **/fstab.yaml** - Content source configuration

### Critical Compute Files
- **/compute/src/index.js** - Main router (63 lines)
- **/compute/fastly.toml** - Service configuration
- **/compute/Makefile** - Build and deployment automation

### Critical Configuration Files
- **/.eslintrc.js** - JavaScript linting rules
- **/package.json** - npm scripts and dependencies
- **/.github/workflows/main.yaml** - CI/CD pipeline

## Performance Considerations

1. **Lazy Loading**: Blocks load on-demand
2. **Image Optimization**: WebP with fallbacks
3. **CSS Splitting**: Block CSS loads with block
4. **Edge Caching**: Fastly CDN caches responses
5. **Font Loading**: Preconnect and font-display: swap
6. **RUM Monitoring**: Track real-world performance

## Security Notes

1. **Secret Management**: Use Fastly Secret Store (compute/src/lib/config.js)
2. **Content Security**: Validate all user inputs
3. **CORS**: Configure in Fastly compute responses
4. **XSS Prevention**: Sanitize content, avoid innerHTML with user data
5. **Dependencies**: Renovate auto-updates for security patches

## Best Practices for AI Assistants

1. **Always lint before committing**: `npm run lint`
2. **Test locally first**: Use `aem up` for frontend, `make serve` for compute
3. **Follow block patterns**: Use existing blocks as templates
4. **Preserve structure**: Don't reorganize directories unnecessarily
5. **Document changes**: Update CLAUDE.md if adding major features
6. **Check CI**: Ensure GitHub Actions pass
7. **Review UE configs**: Rebuild JSON after model changes (`npm run build:json`)
8. **Use utilities**: Import from aem.js, don't reimplement
9. **Semantic HTML**: Blocks should output semantic markup
10. **Accessibility**: Consider a11y in all changes (ARIA, keyboard nav)

## Resources

- **AEM Edge Delivery Docs**: https://www.aem.live/docs/
- **da.live**: https://da.live/
- **Fastly Compute**: https://developer.fastly.com/learning/compute/
- **Universal Editor**: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction.html

## Project-Specific Context

- **Modified for DA compatibility**: This repo includes changes for da.live live preview
- **Content source**: https://content.da.live/aemsites/da-block-collection/
- **Original template**: Based on Adobe's AEM Block Collection
- **Custom endpoints**: Weather and Skywards integrations in compute

## Version Information

- **Node.js**: 20 (minimum)
- **AEM CLI**: Latest (`@adobe/aem-cli`)
- **Fastly Compute Runtime**: Latest
- **License**: Apache License 2.0

---

**Last Updated**: 2025-11-17
**Maintained by**: AI Assistant (Claude)
**Repository**: cpilsworth/dnata
