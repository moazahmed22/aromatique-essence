import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Loader } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useCategories, Category } from "@/lib/categories.util";
import { supabase } from "@/lib/supabase.util";

type CategoryFormType = {
  id?: number;
  name: string;
  slug: string;
  description: string;
};

export default function Categories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<CategoryFormType>({
    name: "",
    slug: "",
    description: "",
  });
  const { toast } = useToast();
  const { data: categories, isLoading } = useCategories();

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
    });
    setEditMode(false);
  };

  const handleOpenEdit = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description.trim(),
      };

      if (editMode && formData.id) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", formData.id);

        if (error) throw error;

        toast({
          title: "Category updated",
          description: "Category has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([{ ...categoryData, product_count: 0 }]);

        if (error) throw error;

        toast({
          title: "Category added",
          description: "New category has been created successfully.",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: editMode
          ? "Failed to update category"
          : "Failed to add category",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Category deleted",
        description: "Category has been removed.",
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete category",
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
          <h1 className="font-heading text-3xl text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize your products into categories
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
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editMode ? "Update" : "Create a new"} category to organize your
                products.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Luxury"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-slug">Slug</Label>
                <Input
                  id="category-slug"
                  placeholder="luxury"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
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
              <Button onClick={handleSaveCategory}>
                {editMode ? "Update Category" : "Add Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              {/* product count is not yet implemented */}
              {/* <TableHead>Products</TableHead> */}
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {category.description}
                  </TableCell>
                  {/* product count is not yet implemented */}
                  {/* <TableCell>{category.product_count} products</TableCell> */}
                  <TableCell>
                    {new Date(category.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(category.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(category)}
                        disabled
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled
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
