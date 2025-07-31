import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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

interface HistoryCardProps {
  historyItem: CookingHistoryItem;
  onDelete: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ historyItem, onDelete }) => {
  const { dishes: dish } = historyItem;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-herb-green text-white';
      case 'medium': return 'bg-golden-yellow text-warm-brown';
      case 'hard': return 'bg-tomato-red text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-border/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-foreground">{dish.name}</CardTitle>
            <CardDescription className="mt-1">{dish.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(historyItem.cooked_date), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {dish.prep_time} min
          </div>
          <Badge className={getDifficultyColor(dish.difficulty)}>
            {dish.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Ingredients you used:</h4>
          <div className="flex flex-wrap gap-1">
            {historyItem.ingredients_used.map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm mb-2">Recipe ingredients:</h4>
          <div className="flex flex-wrap gap-1">
            {dish.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {historyItem.notes && (
          <div>
            <h4 className="font-semibold text-sm mb-1">Notes:</h4>
            <p className="text-sm text-muted-foreground">{historyItem.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryCard;