import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterButtons from "@/components/FilterButtons";
import ThreadCard from "@/components/ThreadCard";
import { useDesignThreads } from "@/hooks/useThreads";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "text" | "images">("all");
  const { data: threads, isLoading, error, refetch } = useDesignThreads();

  const filteredThreads = threads?.filter((thread) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "text") return thread.type === "text";
    if (activeFilter === "images") return thread.type === "image";
    return true;
  }) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Alert className="max-w-2xl mx-auto">
            <AlertDescription className="text-center">
              <p className="mb-4">Failed to load threads from the API.</p>
              <p className="text-sm text-muted-foreground mb-4">
                Make sure you have configured your Threads API access token in the .env file.
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <FilterButtons
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading design threads...</span>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No threads found for the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
