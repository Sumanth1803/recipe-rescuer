import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, ChefHat } from 'lucide-react';

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

interface RecipeCardProps {
  dish: Dish;
  onMarkAsCooked: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ dish, onMarkAsCooked }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-herb-green text-white';
      case 'medium': return 'bg-golden-yellow text-warm-brown';
      case 'hard': return 'bg-tomato-red text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 border-border/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-foreground">{dish.name}</CardTitle>
            <CardDescription className="mt-1">{dish.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(dish.difficulty)}>
            {dish.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {dish.prep_time} min
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            {dish.cuisine_type}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {dish.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
          <ol className="text-sm space-y-1 text-muted-foreground">
            {dish.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-medium text-primary">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <Button 
          onClick={onMarkAsCooked} 
          className="w-full" 
          variant="chef"
        >
          Mark as Cooked
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;