import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChefHat, LogOut, Plus, X, Clock, Star, Trash2, Users } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import HistoryCard from '@/components/HistoryCard';

interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  difficulty: string;
  cuisine_type: string;
}

interface CookingHistoryItem {
  id: string;
  dish_id: string;
  ingredients_used: string[];
  cooked_date: string;
  rating?: number;
  notes?: string;
  dishes: Dish;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [suggestedDishes, setSuggestedDishes] = useState<Dish[]>([]);
  const [cookingHistory, setCookingHistory] = useState<CookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');
  const { toast } = useToast();

  useEffect(() => {
    fetchCookingHistory();
  }, []);

  const fetchCookingHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('cooking_history')
      .select(`
        *,
        dishes (*)
      `)
      .eq('user_id', user.id)
      .order('cooked_date', { ascending: false });

    if (error) {
      console.error('Error fetching cooking history:', error);
    } else {
      setCookingHistory(data || []);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, newIngredient.trim().toLowerCase()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  const findRecipes = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add some ingredients first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // First, store the ingredients input
      await supabase
        .from('ingredients_input')
        .insert({
          user_id: user?.id,
          ingredients: ingredients
        });

      // Find matching dishes from our database
      const { data: dishes, error } = await supabase
        .from('dishes')
        .select('*');

      if (error) throw error;

      // Filter dishes that can be made with available ingredients
      const matchingDishes = dishes?.filter(dish => 
        dish.ingredients.every(ingredient => 
          ingredients.some(userIngredient => 
            userIngredient.includes(ingredient.toLowerCase()) || 
            ingredient.toLowerCase().includes(userIngredient)
          )
        )
      ) || [];

      setSuggestedDishes(matchingDishes);
      setActiveTab('recipes');

      if (matchingDishes.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try adding more common ingredients like salt, oil, or spices",
        });
      } else {
        toast({
          title: "Recipes found!",
          description: `Found ${matchingDishes.length} recipe${matchingDishes.length > 1 ? 's' : ''} you can make`,
        });
      }
    } catch (error) {
      console.error('Error finding recipes:', error);
      toast({
        title: "Error",
        description: "Failed to find recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsCooked = async (dish: Dish) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cooking_history')
        .insert({
          user_id: user.id,
          dish_id: dish.id,
          ingredients_used: ingredients
        });

      if (error) throw error;

      toast({
        title: "Recipe saved!",
        description: `${dish.name} has been added to your cooking history`,
      });

      fetchCookingHistory();
    } catch (error) {
      console.error('Error saving to history:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to history",
        variant: "destructive"
      });
    }
  };

  const deleteFromHistory = async (historyId: string) => {
    try {
      const { error } = await supabase
        .from('cooking_history')
        .delete()
        .eq('id', historyId);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Recipe removed from your history",
      });

      fetchCookingHistory();
    } catch (error) {
      console.error('Error deleting from history:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe from history",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-cream-beige">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Recipe Rescuer</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="ingredients">My Ingredients</TabsTrigger>
            <TabsTrigger value="recipes">Recipe Suggestions</TabsTrigger>
            <TabsTrigger value="history">My Cooking History</TabsTrigger>
          </TabsList>

          {/* Ingredients Tab */}
          <TabsContent value="ingredients" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  What ingredients do you have?
                </CardTitle>
                <CardDescription>
                  Add the ingredients you currently have available in your kitchen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., tomato, onion, salt..."
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={addIngredient} variant="chef">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="text-sm">
                      {ingredient}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => removeIngredient(ingredient)}
                      />
                    </Badge>
                  ))}
                </div>

                <Button 
                  onClick={findRecipes} 
                  disabled={ingredients.length === 0 || loading}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  {loading ? "Finding Recipes..." : "Find Recipes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes" className="space-y-6">
            {suggestedDishes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedDishes.map((dish) => (
                  <RecipeCard
                    key={dish.id}
                    dish={dish}
                    onMarkAsCooked={() => markAsCooked(dish)}
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-medium">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ChefHat className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Add some ingredients and click "Find Recipes" to get started
                  </p>
                  <Button onClick={() => setActiveTab('ingredients')} variant="chef">
                    Add Ingredients
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {cookingHistory.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cookingHistory.map((historyItem) => (
                  <HistoryCard
                    key={historyItem.id}
                    historyItem={historyItem}
                    onDelete={() => deleteFromHistory(historyItem.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-medium">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No cooking history yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start cooking some recipes and they'll appear here
                  </p>
                  <Button onClick={() => setActiveTab('ingredients')} variant="chef">
                    Start Cooking
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;