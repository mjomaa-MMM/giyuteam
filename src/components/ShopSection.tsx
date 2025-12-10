import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  price: number;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

const ShopSection = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderViaWhatsApp = (product: Product) => {
    const productName = isArabic && product.name_ar ? product.name_ar : product.name;
    const message = isArabic 
      ? `مرحباً، أود طلب: ${productName} - السعر: $${product.price}`
      : `Hello, I would like to order: ${productName} - Price: $${product.price}`;
    
    const whatsappNumber = "0096170520091";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="shop" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {isArabic ? "متجر المعدات" : "Equipment Shop"}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isArabic 
              ? "احصل على أفضل معدات التدريب لرحلتك في الكيوكوشين كاراتيه"
              : "Get the best training equipment for your Kyokushin Karate journey"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card"
              >
                <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={isArabic && product.name_ar ? product.name_ar : product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                  )}
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    ${Number(product.price).toFixed(2)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
                    {isArabic && product.name_ar ? product.name_ar : product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isArabic && product.description_ar ? product.description_ar : product.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    onClick={() => handleOrderViaWhatsApp(product)}
                    className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {isArabic ? "اطلب عبر واتساب" : "Order via WhatsApp"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isArabic ? "لا توجد منتجات متاحة حالياً" : "No products available at the moment"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;
