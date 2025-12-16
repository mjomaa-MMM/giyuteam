import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, ShoppingBag, GripVertical, Upload, ImageIcon } from "lucide-react";

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

const AdminShop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/welcome');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('products-manage', {
        body: { action: 'list', sessionToken }
      });

      if (error || !data?.success) {
        throw error || new Error(data?.error || 'Failed to load products');
      }

      setProducts((data.products || []) as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    setSaving(product.id);
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('products-manage', {
        body: {
          action: 'update',
          id: product.id,
          data: {
            name: product.name,
            name_ar: product.name_ar,
            description: product.description,
            description_ar: product.description_ar,
            price: product.price,
            image_url: product.image_url,
            is_active: product.is_active,
            display_order: product.display_order
          },
          sessionToken
        }
      });

      if (error || !data?.success) {
        throw error || new Error(data?.error || 'Failed to update product');
      }

      toast({
        title: "Success",
        description: "Product updated successfully"
      });

      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const handleAddProduct = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) throw new Error('Not authenticated');

      const newOrder = products.length > 0 
        ? Math.max(...products.map(p => p.display_order)) + 1 
        : 1;

      const { data, error } = await supabase.functions.invoke('products-manage', {
        body: {
          action: 'create',
          data: {
            name: 'New Product',
            name_ar: 'منتج جديد',
            description: 'Product description',
            description_ar: 'وصف المنتج',
            price: 0,
            image_url: null,
            display_order: newOrder,
            is_active: true
          },
          sessionToken
        }
      });

      if (error || !data?.success) {
        throw error || new Error(data?.error || 'Failed to add product');
      }

      toast({
        title: "Success",
        description: "New product added"
      });

      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('products-manage', {
        body: { action: 'delete', id, sessionToken }
      });

      if (error || !data?.success) {
        throw error || new Error(data?.error || 'Failed to delete product');
      }

      toast({
        title: "Success",
        description: "Product deleted"
      });

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const updateProductField = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleImageUpload = async (productId: string, file: File) => {
    setUploading(productId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Delete old image if exists
      const product = products.find(p => p.id === productId);
      if (product?.image_url) {
        const oldPath = product.image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('product-images').remove([oldPath]);
        }
      }

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Update product with new image URL
      updateProductField(productId, 'image_url', publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/content')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Manage Shop Products</h1>
            </div>
          </div>
          <Button onClick={handleAddProduct} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="grid gap-6">
          {products.map((product, index) => (
            <Card key={product.id} className="border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Product #{index + 1}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={(checked) => updateProductField(product.id, 'is_active', checked)}
                      />
                      <Label className="text-sm text-muted-foreground">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name (English)</Label>
                    <Input
                      value={product.name}
                      onChange={(e) => updateProductField(product.id, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Name (Arabic)</Label>
                    <Input
                      value={product.name_ar || ''}
                      onChange={(e) => updateProductField(product.id, 'name_ar', e.target.value)}
                      placeholder="اسم المنتج"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Description (English)</Label>
                    <Textarea
                      value={product.description || ''}
                      onChange={(e) => updateProductField(product.id, 'description', e.target.value)}
                      placeholder="Product description"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Arabic)</Label>
                    <Textarea
                      value={product.description_ar || ''}
                      onChange={(e) => updateProductField(product.id, 'description_ar', e.target.value)}
                      placeholder="وصف المنتج"
                      dir="rtl"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.price}
                      onChange={(e) => updateProductField(product.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => fileInputRefs.current[product.id] = el}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(product.id, file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 flex-1"
                        onClick={() => fileInputRefs.current[product.id]?.click()}
                        disabled={uploading === product.id}
                      >
                        {uploading === product.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>
                      {product.image_url && (
                        <div className="h-10 w-10 rounded border overflow-hidden flex-shrink-0">
                          <img 
                            src={product.image_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input
                      type="number"
                      min="1"
                      value={product.display_order}
                      onChange={(e) => updateProductField(product.id, 'display_order', parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleUpdateProduct(product)}
                    disabled={saving === product.id}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving === product.id ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {products.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Button onClick={handleAddProduct} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminShop;
