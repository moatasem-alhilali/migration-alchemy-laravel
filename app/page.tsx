
import Head from "next/head";
import Header from "@/components/Header";
import MigrationUploader from "@/components/MigrationUploader";
import UtilitiesPanel from "@/components/UtilitiesPanel";
import MigrationList from "@/components/MigrationList";
import ActionBar from "@/components/ActionBar";

export default function Page() {
  return (
    <>
      <Head>
        <title>Laravel Migration File Organizer</title>
        <meta name="description" content="Drag, reorder, and rename your Laravel migration files visually." />
        <meta property="og:title" content="Laravel Migration File Organizer" />
        <meta property="og:description" content="Drag, reorder, and rename your Laravel migration files visually." />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lovable_dev" />
        <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Migration Master",
              description: "Reorder and organize Laravel migration files visually and safely.",
              url: "https://lovable.dev/projects/1beb7c4c-270d-4a17-a80a-470c7edc75d4"
            }),
          }}
        />
      </Head>
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        <Header />
        <main className="flex-1 container max-w-3xl px-4 py-8 flex flex-col gap-8">
          <MigrationUploader />
          <UtilitiesPanel />
          <MigrationList />
          <ActionBar />
        </main>
        <footer className="text-xs pb-8 pt-6 text-center opacity-60">
          &copy; {new Date().getFullYear()} Migration Master &ndash; For Laravel Developers
        </footer>
      </div>
    </>
  );
}
