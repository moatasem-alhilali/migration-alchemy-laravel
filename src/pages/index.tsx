import Header from "@/components/Header";
import MigrationUploader from "@/components/MigrationUploader";
import UtilitiesPanel from "@/components/UtilitiesPanel";
import MigrationList from "@/components/MigrationList";
import ActionBar from "@/components/ActionBar";
import { I18nProvider, useI18n } from "@/i18n/I18nContext";

function ResponsiveMain() {
  // Use language to set direction and support responsive
  const { dir } = useI18n();
  return (
    <div className={`min-h-screen bg-background text-foreground font-sans flex flex-col`} dir={dir}>
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-2 md:px-4 py-4 md:py-8 flex flex-col gap-5 md:gap-8">
        {/* Responsive stacking for small screens */}
        <MigrationUploader />
        <UtilitiesPanel />
        <MigrationList />
        <ActionBar />
      </main>
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
