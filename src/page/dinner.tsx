// src/page/DinnerPage.tsx
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface FoodIdea {
  id: number;
  type: string;
  food: string;
  socialMedia: string;
  doneBy: string;
  link: string;
  recipe: string[];
}

export default function DinnerPage() {
  const [ideas, setIdeas] = useState<FoodIdea[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FoodIdea | null>(null);

  const BASE = "http://localhost:4000";

  // Fetch ideas
  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/food-ideas`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      const dinnerIdeas = data.filter((idea: FoodIdea) =>
        ["dinner", "breakfast", "lunch"].includes(
          (idea.type || "").toLowerCase().trim()
        )
      );
      setIdeas(dinnerIdeas);
    } catch (err) {
      console.error("Error fetching ideas:", err);
      // show friendly fallback - keep ideas as empty
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  useEffect(() => {
    const handleRefresh = () => fetchIdeas();
    window.addEventListener("food-ideas-updated", handleRefresh);
    return () =>
      window.removeEventListener("food-ideas-updated", handleRefresh);
  }, []);

  // Delete idea
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      const res = await fetch(`${BASE}/food-ideas/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", res.status, text);
        alert("Delete failed. See console for details.");
        return;
      }
      // refresh
      await fetchIdeas();
      // if current page now out of range, go back one page
      const filtered = ideas.filter((idea) =>
        (idea.food || "").toLowerCase().includes(search.toLowerCase())
      );
      const newTotalPages = Math.max(
        1,
        Math.ceil((filtered.length - 1) / rowsPerPage)
      );
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    } catch (err) {
      console.error("Error deleting idea:", err);
      alert("Delete failed. Check console.");
    }
  };

  // Edit handling
  const handleEdit = (idea: FoodIdea) => {
    // ensure recipe is array
    const recipeArr = Array.isArray(idea.recipe)
      ? idea.recipe
      : (idea.recipe || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
    setEditData({ ...idea, recipe: recipeArr });
    setIsEditing(true);
  };

  const handleChange = (field: keyof FoodIdea, value: string) => {
    if (!editData) return;
    if (field === "recipe") {
      const arr = value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      setEditData({ ...editData, recipe: arr });
    } else {
      setEditData({ ...editData, [field]: value } as FoodIdea);
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      // ensure recipe is array of strings
      const payload = {
        ...editData,
        recipe: Array.isArray(editData.recipe)
          ? editData.recipe
          : String(editData.recipe)
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
      };
      const res = await fetch(`${BASE}/food-ideas/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Update failed:", res.status, text);
        alert("Update failed. See console for details.");
        return;
      }
      setIsEditing(false);
      setEditData(null);
      await fetchIdeas();
    } catch (err) {
      console.error("Error updating idea:", err);
      alert("Update failed. Check console.");
    }
  };

  // Filter by search (search across multiple fields)
  const filteredIdeas = ideas.filter(
    (idea) =>
      (idea.food || "").toLowerCase().includes(search.toLowerCase()) ||
      (idea.type || "").toLowerCase().includes(search.toLowerCase()) ||
      (idea.doneBy || "").toLowerCase().includes(search.toLowerCase()) ||
      (idea.socialMedia || "").toLowerCase().includes(search.toLowerCase()) ||
      (idea.link || "").toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(idea.recipe) ? idea.recipe.join(" ") : idea.recipe || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredIdeas.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedIdeas = filteredIdeas.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  if (loading) {
    return <p className="text-center py-4">Loading Dinner ideas...</p>;
  }

  if (ideas.length === 0) {
    return <p className="text-center py-4">No Dinner ideas yet. Create one!</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Food Ideas</h1>

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by food, type, done by, social media, link, recipe..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-120"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Food</TableHead>
            <TableHead>Social Media</TableHead>
            <TableHead>Done By</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Recipe</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedIdeas.map((idea) => (
            <TableRow key={idea.id}>
              <TableCell>{idea.type}</TableCell>
              <TableCell>{idea.food}</TableCell>
              <TableCell>{idea.socialMedia}</TableCell>
              <TableCell>{idea.doneBy}</TableCell>
              <TableCell>
                <a
                  href={idea.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {idea.link}
                </a>
              </TableCell>
              <TableCell>
                <ul className="list-disc list-inside">
                  {idea.recipe?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(idea)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(idea.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Food Idea</DialogTitle>
          </DialogHeader>

          {editData && (
            <div className="space-y-4">
              {/* Type (dropdown) */}
              <Select
                value={editData.type}
                onValueChange={(val) => handleChange("type", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>

              {/* Food */}
              <Input
                value={editData.food}
                onChange={(e) => handleChange("food", e.target.value)}
                placeholder="Food name"
              />

              {/* Social Media */}
              <Input
                value={editData.socialMedia}
                onChange={(e) => handleChange("socialMedia", e.target.value)}
                placeholder="Social Media"
              />

              {/* Done By */}
              <Input
                value={editData.doneBy}
                onChange={(e) => handleChange("doneBy", e.target.value)}
                placeholder="Done By"
              />

              {/* Link */}
              <Input
                value={editData.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="Link"
              />

              {/* Recipe */}
              <Textarea
                value={
                  Array.isArray(editData.recipe)
                    ? editData.recipe.join("\n")
                    : editData.recipe || ""
                }
                onChange={(e) => handleChange("recipe", e.target.value)}
                placeholder="Recipe (one step per line)"
                className="min-h-[120px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditData(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
