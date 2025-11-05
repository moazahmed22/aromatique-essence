import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Loader, Target } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Perfume } from "@/types/Perfumes.type";
import { useProducts } from "@/lib/products.util";
import { supabase } from "@/lib/supabase.util";
import { incrementCategoryCount, decrementCategoryCount, useCategories } from "@/lib/categories.util";

// TODO: Replace static perfumes array with Supabase query
// const { data: products } = await supabase.from('products').select('*')
type ProductFormType = {
  id?: number;
  name: string;
  price: number | string;
  stock: number | string;
  category_slug: string;
  description: string;
  image?: File | string;
  volume: string;
  rating: number | string;
  bestseller: boolean;
  featured: boolean;
  notes_top: string;
  notes_middle: string;
  notes_base: string;
};

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProductFormType>({
    name: "",
    price: "",
    stock: "",
    category_slug: "",
    description: "",
    volume: "50ml",
    rating: 5,
    bestseller: false,
    featured: false,
    notes_top: "",
    notes_middle: "",
    notes_base: "",
  });
  const { toast } = useToast();
  const { data: perfumes, isLoading }: { data: Perfume[]; isLoading: boolean } =
    useProducts();
  const { data: categories } = useCategories();

  // Filter products based on search
  const filteredProducts = perfumes?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      category_slug: "",
      description: "",
      volume: "50ml",
      rating: 5,
      bestseller: false,
      featured: false,
      notes_top: "",
      notes_middle: "",
      notes_base: "",
    });
    setEditMode(false);
  };

  const handleOpenEdit = (product: Perfume) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category_slug: product.category_slug,
      description: product.description,
      volume: product.volume,
      rating: product.rating,
      bestseller: product.bestseller || false,
      featured: product.featured || false,
      notes_top: product.notes_top?.join(", ") || "",
      notes_middle: product.notes_middle?.join(", ") || "",
      notes_base: product.notes_base?.join(", ") || "",
      image: product.image,
    });
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      let imageURL: string | null = null;

      // Upload image if selected
      if (formData.image && formData.image instanceof File) {
        const file = formData.image;
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadedImage, error: uploadError } =
          await supabase.storage.from("images").upload(fileName, file);

        if (uploadError) {
          toast({
            title: "Image upload failed",
            description: "We'll use the existing image instead.",
            variant: "destructive",
          });
        } else {
          const { data: URL } = supabase.storage
            .from("images")
            .getPublicUrl(uploadedImage.path);
          imageURL = URL.publicUrl;
        }
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category_slug: formData.category_slug,
        description: formData.description.trim(),
        volume: formData.volume,
        rating: Number(formData.rating),
        bestseller: formData.bestseller,
        featured: formData.featured,
        notes_top: formData.notes_top
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
        notes_middle: formData.notes_middle
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
        notes_base: formData.notes_base
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
        ...(imageURL ? { image: imageURL } : {}),
      };

      if (editMode && formData.id) {
        // Get original product to check if category changed
        const originalProduct = perfumes?.find(p => p.id === formData.id);
        
        // Update existing product
        const { error } = await supabase
          .from("perfumes")
          .update(productData)
          .eq("id", formData.id);

        if (error) throw error;

        // Update category counts if category changed
        if (originalProduct && originalProduct.category_slug !== formData.category_slug) {
          await decrementCategoryCount(originalProduct.category_slug);
          await incrementCategoryCount(formData.category_slug);
        }

        toast({
          title: "Product updated",
          description: "Product has been updated successfully.",
        });
      } else {
        // Insert new product
        const { error } = await supabase
          .from("perfumes")
          .insert([productData])
          .select();

        if (error) throw error;

        // Increment category count
        await incrementCategoryCount(formData.category_slug);

        toast({
          title: "Product added",
          description: "New product has been added successfully.",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: editMode ? "Failed to update product" : "Failed to add product",
        description: "Please check your network or try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Get product to find its category
      const product = perfumes?.find(p => p.id === id);
      
      const { error } = await supabase.from("perfumes").delete().eq("id", id);

      if (error) throw error;

      // Decrement category count
      if (product) {
        await decrementCategoryCount(product.category_slug);
      }

      toast({
        title: "Product deleted",
        description: "Product has been removed from the catalog.",
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete product",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your perfume catalog
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details to {editMode ? "update" : "add"} a perfume{" "}
                {editMode ? "in" : "to"} your catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Golden Oud"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (AED)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2500"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="20"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_slug}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_slug: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="volume">Volume</Label>
                  <Select
                    value={formData.volume}
                    onValueChange={(value) =>
                      setFormData({ ...formData, volume: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30ml">30ml</SelectItem>
                      <SelectItem value="50ml">50ml</SelectItem>
                      <SelectItem value="100ml">100ml</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description..."
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes_top">Top Notes (comma-separated)</Label>
                <Input
                  id="notes_top"
                  placeholder="e.g., Bergamot, Lemon, Orange"
                  value={formData.notes_top}
                  onChange={(e) =>
                    setFormData({ ...formData, notes_top: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes_middle">
                  Middle Notes (comma-separated)
                </Label>
                <Input
                  id="notes_middle"
                  placeholder="e.g., Rose, Jasmine, Lavender"
                  value={formData.notes_middle}
                  onChange={(e) =>
                    setFormData({ ...formData, notes_middle: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes_base">Base Notes (comma-separated)</Label>
                <Input
                  id="notes_base"
                  placeholder="e.g., Oud, Musk, Amber"
                  value={formData.notes_base}
                  onChange={(e) =>
                    setFormData({ ...formData, notes_base: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2 pt-8">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.bestseller}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bestseller: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Bestseller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">
                  {editMode ? "Change Image (optional)" : "Product Image"}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0],
                    })
                  }
                />
                {editMode && typeof formData.image === "string" && (
                  <p className="text-sm text-muted-foreground">
                    Current: {formData.image}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>
                {editMode ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <p className="text-muted-foreground">Loading...</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category_slug}</TableCell>
                  <TableCell>AED {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={product.stock < 10 ? "text-destructive" : ""}
                    >
                      {product.stock} units
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
