
import Header from "@/components/Header";
import MigrationUploader from "@/components/MigrationUploader";
import MigrationList from "@/components/MigrationList";
import ActionBar from "@/components/ActionBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-8 flex flex-col gap-8">
        <MigrationUploader />
        <MigrationList />
        <ActionBar />
      </main>
      <footer className="text-xs pb-8 pt-6 text-center opacity-60">
        &copy; {new Date().getFullYear()} Migration Master &ndash; For Laravel Developers
      </footer>
    </div>
  );
}
