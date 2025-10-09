import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import DojoNavigation from '@/components/DojoNavigation';
import Footer from '@/components/Footer';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) {
      setNews(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DojoNavigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-primary text-center">News & Upcoming Events</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-3">{item.title}</h2>
                <p className="text-muted-foreground mb-3">{item.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {news.length === 0 && (
          <p className="text-center text-muted-foreground mt-12">No news available yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default News;
