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
import { add } from "date-fns";

// TODO: Replace static perfumes array with Supabase query
// const { data: products } = await supabase.from('products').select('*')
type addProductFromType = {
  name: string;
  price: number | string;
  stockQuantity: number | string;
  category_slug: string;
  description: string;
  image?: File | string;
};

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addProductFromData, setAddProductFromData] =
    useState<addProductFromType>({
      name: "",
      price: "",
      stockQuantity: "",
      category_slug: "",
      description: "",
    });
  const { toast } = useToast();
  const { data: perfumes, isLoading }: { data: Perfume[]; isLoading: boolean } =
    useProducts();

  // Filter products based on search
  const filteredProducts = perfumes?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async () => {
    try {
      let imageURL: string | null = null;

      // Upload image if selected
      if (
        addProductFromData.image &&
        addProductFromData.image instanceof File
      ) {
        const file = addProductFromData.image;
        const fileName = `${file.name}`;
        const { data: uploadedImage, error: uploadError } =
          await supabase.storage.from("images").upload(fileName, file);

        if (uploadError) {
          console.log(uploadError);

          toast({
            title: "Image upload failed",
            description: "We'll use the default placeholder image instead.",
          });
        } else {
          const { data: URL } = supabase.storage
            .from("images")
            .getPublicUrl(uploadedImage.path);
          imageURL = URL.publicUrl;
        }
      }

      // 🧹 Prepare clean object for Supabase
      const productToInsert = {
        name: addProductFromData.name.trim(),
        price: addProductFromData.price,
        stock: addProductFromData.stockQuantity,
        category_slug: addProductFromData.category_slug,
        description: addProductFromData.description.trim(),
        // spread the returned image value either as a string or undefined
        ...(imageURL ? { image: imageURL } : {}),
      };

      // 🪄 Insert into Supabase
      setTimeout(async () => {
        const { data, error } = await supabase
          .from("perfumes")
          .insert([productToInsert])
          .select();

        if (error) throw error;

        toast({
          title: "Product added",
          description: "New product has been added successfully.",
        });

        // ✅ Reset form & close dialog
        setAddProductFromData({
          name: "",
          price: "",
          stockQuantity: "",
          category_slug: "",
          description: "",
        });
        setIsDialogOpen(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to add product",
        description: "Please check your network or try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = (id: number) => {
    // TODO: Implement Supabase delete
    // await supabase.from('products').delete().eq('id', id)
    toast({
      title: "Product deleted",
      description: "Product has been removed from the catalog.",
    });
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new perfume to your catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Golden Oud"
                  required
                  value={addProductFromData.name}
                  onChange={(e) =>
                    setAddProductFromData({
                      ...addProductFromData,
                      name: e.target.value,
                    })
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
                    value={addProductFromData.price}
                    onChange={(e) =>
                      setAddProductFromData({
                        ...addProductFromData,
                        price: e.target.value,
                      })
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
                    value={addProductFromData.stockQuantity}
                    onChange={(e) =>
                      setAddProductFromData({
                        ...addProductFromData,
                        stockQuantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={addProductFromData.category_slug}
                  onValueChange={(e) =>
                    setAddProductFromData({
                      ...addProductFromData,
                      category_slug: e,
                    })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`${
                        addProductFromData.category_slug || "Select category"
                      }`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description..."
                  required
                  value={addProductFromData.description}
                  onChange={(e) =>
                    setAddProductFromData({
                      ...addProductFromData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                {/* upload image first */}
                <Input
                  id="image"
                  type="file"
                  placeholder="/images/product.png"
                  required
                  // value={addProductFromData.imageURL}
                  onChange={(e) =>
                    setAddProductFromData({
                      ...addProductFromData,
                      image: e.target.files[0],
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
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
                      <Button variant="ghost" size="icon">
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
