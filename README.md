
# Migration Alchemy – Laravel Migration Organizer

---

## 🧩 1. Project Overview

Migration Alchemy is a modern, developer-focused tool for visually uploading, renaming, reordering, and exporting Laravel migration files. Built with Next.js 14+, it enables fast migration management for Laravel teams, featuring conflict detection, smart sorting, bilingual UI, and full mobile support.

### Features

- **Drag & drop** file reordering
- **Auto timestamp/prefix** renaming and suffix options
- **Manual filename editing** (inline or modal)
- **Table conflict detection** and warnings
- **Smart sorting suggestion** (create → add → update → drop)
- **Export**:
  - Renamed files (zip)
  - JSON rename map
  - README-style markdown list
- **Multilingual:** English & Arabic (RTL)
- **Fully responsive** (desktop/tablet/mobile)

---

## 📚 2. Tech Stack

| Library             | Purpose                                 |
|---------------------|-----------------------------------------|
| `Next.js 14+`       | Main React framework                    |
| `TailwindCSS`       | Styling, utility classes, responsiveness|
| `shadcn/ui`         | UI components (buttons, modals, inputs) |
| `@dnd-kit/core`     | Drag-and-drop list reordering           |
| `Zustand`           | Global state management (file/files UI) |
| `FileSaver.js`      | Client-side download/export             |
| `jszip`             | Unzipping `.php` files for upload       |
| `next-i18next`*     | Internationalization (i18n)/multilanguage |
| `<script type="application/ld+json">` | Structured data/SEO  |

\*or custom context-based i18n implementation

---

## 🏗️ 3. Folder Structure

```
/app/
  page.tsx               # Main app entry (Next.js 14+)
/src/
  components/
    Header.tsx
    LanguageSwitcher.tsx
    MigrationUploader.tsx
    MigrationList.tsx
    SortableFileItem.tsx
    UtilitiesPanel.tsx
    FileManualRenameInput.tsx
    FileNameDialogEditor.tsx
    MigrationFileDialogEditor.tsx
    ActionBar.tsx
  stores/
    fileStore.ts         # Zustand logic for files/settings
  utils/
    fileUtils.ts         # Filename parsing, renaming, sorting, etc.
    # zipUtils.ts        # (If split: Zip handling for file extraction)
    # i18nUtils.ts       # (If split: Helper for translations)
  i18n/
    I18nContext.tsx      # i18n context/provider
/public/
  locales/
    en/common.json       # English translation strings
    ar/common.json       # Arabic translation strings
README.md
```

---

## 🧠 4. Core Logic Description

- **Drag-and-Drop Reordering:**  
  List order managed by `@dnd-kit` – UI order matches export order.  
  Zustand persists the file array and history for undo.

- **Filename Transformation:**
  - *Incremental numbering*: `001_`, `002_`, etc.
  - *Prefix/suffix*: User-set via input
  - *Remove timestamp*: Toggle to delete initial `YYYY_MM_DD_HHMMSS_` from filename
  - *Manual override*: Edit name by clicking icon (inline or modal, with validation)

- **Conflict Detection:**  
  For each file, the tool parses its pattern to extract affected table. Warns if more than one migration targets the same table (e.g., two `create_users_table.php`).

- **Smart Sorting (Suggest Order):**  
  Assigns sorting weight based on key verbs (create > add > update > drop > delete). Secondary sort by table, then filename. User can undo sorting.

- **Export:**
  - *Files*: Renamed files zipped and downloaded via Blob/FileSaver.js
  - *JSON*: Map of original → new names
  - *Markdown*: README-friendly export of file order

---

## 🌍 5. i18n + RTL

- English and Arabic supported (translation JSON in `/public/locales/en/` and `/ar/`)
- Language switcher in UI (using Zustand/i18nContext)
- RTL (`dir="rtl"`) automatically set for Arabic – all UI/sorting/order, paddings, etc. flip using Tailwind’s `rtl:` classes

---

## 📱 6. Responsiveness

- Mobile-first layout using Tailwind’s `sm:` `md:` `lg:` breakpoints
- File list scrolls horizontally on narrow screens
- Modals/forms adapt for small devices (scaling, scrolling)
- Footer and header collapse elegantly

---

## 🔗 7. Links

- **Live demo:** [deployment link here]
- **GitHub:** [https://github.com/moatasem-alhilali/migration-alchemy-laravel](https://github.com/moatasem-alhilali/migration-alchemy-laravel)
- **Author:** Moatasem Alhilali – [GitHub Profile](https://github.com/moatasem-alhilali)

---

## ✅ Final Notes

- Built for real-world Laravel teams and individuals (OSS)
- Modern TypeScript/React practices, strong SEO/meta, accessible and fast
- Ready to extend with backend sync, workspace multiuser, or AI-based renaming!

---

