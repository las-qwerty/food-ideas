import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";

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

  // 🔹 Fetch ideas
  const fetchIdeas = () => {
    fetch("http://localhost:4000/food-ideas")
      .then((res) => res.json())
      .then((data) => {
        // only keep Dinner
        const dinnerIdeas = data.filter((idea: FoodIdea) =>
          ["dinner", "breakfast", "lunch"].includes(
            idea.type?.toLowerCase().trim()
          )
        );

        setIdeas(dinnerIdeas);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ideas:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // 🔹 Listen for custom event after form submission
  useEffect(() => {
    const handleRefresh = () => fetchIdeas();
    window.addEventListener("food-ideas-updated", handleRefresh);
    return () => {
      window.removeEventListener("food-ideas-updated", handleRefresh);
    };
  }, []);

  if (loading) {
    return <p className="text-center py-4">Loading Dinner ideas...</p>;
  }

  if (ideas.length === 0) {
    return <p className="text-center py-4">No Dinner ideas yet. Create one!</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Dinner Ideas</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className="shadow-md">
            <CardHeader>
              <CardTitle>{idea.food}</CardTitle>
              <CardDescription>
                {idea.type} • Shared on {idea.socialMedia}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Done By:</strong> {idea.doneBy}
              </p>
              <p>
                <strong>Link:</strong>{" "}
                <a
                  href={idea.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {idea.link}
                </a>
              </p>
              <div>
                <strong>Recipe:</strong>
                <ul className="list-disc list-inside">
                  {idea.recipe.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
