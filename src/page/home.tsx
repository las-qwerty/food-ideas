import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function FoodFormCard() {
  const [formData, setFormData] = useState({
    type: "",
    food: "",
    socialMedia: "",
    doneBy: "",
    link: "",
    recipe: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert recipe (multiline text) into unordered list
    const recipeItems = formData.recipe
      .split("\n")
      .filter((line) => line.trim() !== "");

    const payload = {
      ...formData,
      recipe: recipeItems,
    };

    try {
      const res = await fetch("http://localhost:4000/food-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Food idea saved!");
        setFormData({
          type: "",
          food: "",
          socialMedia: "",
          doneBy: "",
          link: "",
          recipe: "",
        });
      } else {
        alert("❌ Failed to save food idea");
      }
    } catch (err) {
      console.error("Error saving food idea:", err);
      alert("⚠️ Could not connect to server");
    }
  };

  return (
    <div className="py-2 px-2">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Food Idea</CardTitle>
          <CardDescription>
            Fill out the form below to add a new food idea.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select onValueChange={(val) => handleChange("type", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Food */}
            <div className="space-y-2">
              <Label>Food</Label>
              <Input
                type="text"
                placeholder="Enter food name"
                value={formData.food}
                onChange={(e) => handleChange("food", e.target.value)}
              />
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <Label>Social Media</Label>
              <Select onValueChange={(val) => handleChange("socialMedia", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Done By */}
            <div className="space-y-2">
              <Label>Done By</Label>
              <Select onValueChange={(val) => handleChange("doneBy", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lawrence">Lawrence</SelectItem>
                  <SelectItem value="Ynna">Ynna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label>Link</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            </div>

            {/* Recipe */}
            <div className="space-y-2 pb-2">
              <Label>Recipe (one step per line)</Label>
              <Textarea
                placeholder="Enter recipe steps, each step on a new line"
                value={formData.recipe}
                onChange={(e) => handleChange("recipe", e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit">Create</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
