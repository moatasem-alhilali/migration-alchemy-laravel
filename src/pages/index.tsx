import Header from "@/components/Header";
import MigrationUploader from "@/components/MigrationUploader";
import UtilitiesPanel from "@/components/UtilitiesPanel";
import MigrationList from "@/components/MigrationList";
import ActionBar from "@/components/ActionBar";
import { I18nProvider, useI18n } from "@/i18n/I18nContext";
import React from "react";

// For metadata
function SEOHead() {
  return (
    <>
      <title>Laravel Migration File Organizer – Migration Alchemy</title>
      <meta name="description" content="Visually reorder, rename, and export Laravel migration files using an elegant drag-and-drop UI." />
      <meta name="keywords" content="laravel, migration, rename, reordering, php, timestamp, laravel tools, file management" />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content="Laravel Migration File Organizer – Migration Alchemy" />
      <meta property="og:description" content="Visually reorder, rename, and export Laravel migration files using an elegant drag-and-drop UI." />
      <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      <meta property="og:url" content="https://migration-alchemy.vercel.app" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Laravel Migration File Organizer – Migration Alchemy" />
      <meta name="twitter:description" content="Visually reorder, rename, and export Laravel migration files using an elegant drag-and-drop UI." />
      <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
      <link rel="canonical" href="https://migration-alchemy.vercel.app" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Migration Alchemy – Laravel Migration Organizer",
            url: "https://migration-alchemy.vercel.app",
            description: "A modern tool to reorder and rename Laravel migration files visually.",
            applicationCategory: "DeveloperTool",
            creator: {
              "@type": "Person",
              name: "Moatasem Alhilali",
              url: "https://github.com/moatasem-alhilali"
            }
          }),
        }}
      />
    </>
  );
}

function ResponsiveMain() {
  // Use language to set direction and support responsive
  const { dir } = useI18n();
  return (
    <div className={`min-h-screen bg-background text-foreground font-sans flex flex-col`} dir={dir}>
      <SEOHead />
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-2 md:px-4 py-4 md:py-8 flex flex-col gap-5 md:gap-8">
        {/* Responsive stacking for small screens */}
        <MigrationUploader />
        <UtilitiesPanel />
        <MigrationList />
        <ActionBar />
      </main>

      {/* Attribution Footer */}
      <footer className="w-full text-xs flex flex-col items-center gap-1 py-2 px-2 opacity-60 text-center">
        <span>
          Designed by{" "}
          <a className="underline hover:text-primary transition-colors" href="https://github.com/moatasem-alhilali" target="_blank" rel="noopener noreferrer">
            Moatasem Alhilali
          </a>{" "}
          &middot;{" "}
          <span>
            GitHub:{" "}
            <a className="underline hover:text-primary transition-colors" href="https://github.com/moatasem-alhilali" target="_blank" rel="noopener noreferrer">
              github.com/moatasem-alhilali
            </a>
          </span>{" "}
          &middot;{" "}
          <span>
            Source Code:{" "}
            <a className="underline hover:text-primary transition-colors" href="https://github.com/moatasem-alhilali/migration-alchemy-laravel" target="_blank" rel="noopener noreferrer">
              github.com/moatasem-alhilali/migration-alchemy-laravel
            </a>
          </span>
        </span>
      </footer>

      {/* Existing copyright */}
      <footer className="text-xs pb-8 pt-4 sm:pt-6 text-center opacity-60">
        &copy; {new Date().getFullYear()} Migration Master &ndash; For Laravel Developers
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <ResponsiveMain />
    </I18nProvider>
  );
}
