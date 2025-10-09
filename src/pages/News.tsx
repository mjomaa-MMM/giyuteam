import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import DojoNavigation from "@/components/DojoNavigation";
import Footer from "@/components/Footer";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DojoNavigation />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">News & Updates</h1>

          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No news available at the moment.
            </div>
          ) : (
            <div className="space-y-6">
              {news.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                      {item.content}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default News;
