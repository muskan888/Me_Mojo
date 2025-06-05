import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Clock,
  Users,
  Heart,
  Bookmark,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
  userData: any;
}

export const RecipeCard = ({ userData }: RecipeCardProps) => {
  const [currentRecipe, setCurrentRecipe] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for generated recipe in localStorage
    const savedRecipe = localStorage.getItem("memojo-last-recipe");
    if (savedRecipe) {
      try {
        const recipe = JSON.parse(savedRecipe);
        setCurrentRecipe(recipe);
        // Clear the saved recipe after displaying it
        localStorage.removeItem("memojo-last-recipe");
      } catch (error) {
        console.error("Error parsing saved recipe:", error);
      }
    } else {
      generateRecipe();
    }
  }, []);

  const generateRecipe = () => {
    const cuisines = userData.cuisines || ["Italian"];
    const preferences = userData.foodPreferences || ["Balanced"];
    const comfortFood = userData.comfortFood || "pasta";

    const recipes = [
      {
        id: 1,
        name: "Cozy Butter Chicken",
        cuisine: "Indian",
        cookTime: "30 mins",
        servings: 4,
        difficulty: "Easy",
        mood: "Comfort",
        ingredients: ["Chicken", "Tomatoes", "Cream", "Spices", "Rice"],
        description: `Perfect for when you're craving ${
          comfortFood.toLowerCase() === "indian food"
            ? "home flavors"
            : "something warming"
        }. Rich, creamy, and soul-satisfying.`,
        image:
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      },
      {
        id: 2,
        name: "Quick Aglio e Olio",
        cuisine: "Italian",
        cookTime: "15 mins",
        servings: 2,
        difficulty: "Easy",
        mood: "Quick Fix",
        ingredients: [
          "Pasta",
          "Garlic",
          "Olive Oil",
          "Chili Flakes",
          "Parsley",
        ],
        description:
          "Simple pasta perfection. When you want comfort without the fuss.",
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      },
      {
        id: 3,
        name: "Korean Kimchi Fried Rice",
        cuisine: "Korean",
        cookTime: "20 mins",
        servings: 2,
        difficulty: "Easy",
        mood: "Adventurous",
        ingredients: ["Rice", "Kimchi", "Egg", "Sesame Oil", "Scallions"],
        description:
          "Bold flavors for bold moods. Perfect comfort food with a kick.",
        image:
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
      },
    ];

    // Select recipe based on user preferences
    const preferredCuisine = cuisines[0]?.toLowerCase();
    const matchedRecipe =
      recipes.find((r) => r.cuisine.toLowerCase() === preferredCuisine) ||
      recipes[Math.floor(Math.random() * recipes.length)];

    setCurrentRecipe(matchedRecipe);
  };

  if (!currentRecipe) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-6 text-center">
          <ChefHat className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <Button onClick={generateRecipe}>Suggest a Recipe</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
        <img
          src={currentRecipe.image}
          alt={currentRecipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">
            {currentRecipe.mood || currentRecipe.difficulty}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-1">{currentRecipe.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {currentRecipe.cuisine ? `${currentRecipe.cuisine} • ` : ""}
              {currentRecipe.difficulty}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSaved(!saved)}
            className={saved ? "text-red-500" : ""}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-4">
          {currentRecipe.description}
        </p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {currentRecipe.cookTime}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Serves {currentRecipe.servings}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Ingredients:</h4>
          <div className="flex flex-wrap gap-2">
            {currentRecipe.ingredients.map(
              (ingredient: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ingredient}
                </Badge>
              )
            )}
          </div>
        </div>

        {currentRecipe.instructions && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              {currentRecipe.instructions.map(
                (instruction: string, index: number) => (
                  <li key={index}>{instruction}</li>
                )
              )}
            </ol>
          </div>
        )}

        {currentRecipe.tips && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {currentRecipe.tips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {currentRecipe.nutritionalInfo && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Nutritional Info:</h4>
            <p className="text-sm text-muted-foreground">
              {currentRecipe.nutritionalInfo}
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            <ChefHat className="w-4 h-4 mr-2" />
            Save Recipe
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={generateRecipe}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
