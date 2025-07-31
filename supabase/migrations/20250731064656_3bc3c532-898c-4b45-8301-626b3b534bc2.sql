-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ingredients_input table to store user's available ingredients per session
CREATE TABLE public.ingredients_input (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredients TEXT[] NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dishes table to store recipe information
CREATE TABLE public.dishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  image_url TEXT,
  prep_time INTEGER, -- in minutes
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  cuisine_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cooking_history table to track user's cooked dishes
CREATE TABLE public.cooking_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
  ingredients_used TEXT[] NOT NULL,
  cooked_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients_input ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooking_history ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for ingredients_input
CREATE POLICY "Users can view their own ingredients" 
ON public.ingredients_input 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ingredient entries" 
ON public.ingredients_input 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredient entries" 
ON public.ingredients_input 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredient entries" 
ON public.ingredients_input 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for dishes (public read access)
CREATE POLICY "Anyone can view dishes" 
ON public.dishes 
FOR SELECT 
USING (true);

-- Create policies for cooking_history
CREATE POLICY "Users can view their own cooking history" 
ON public.cooking_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cooking history" 
ON public.cooking_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cooking history" 
ON public.cooking_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cooking history" 
ON public.cooking_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample dishes
INSERT INTO public.dishes (name, description, ingredients, instructions, prep_time, difficulty, cuisine_type) VALUES
('Simple Tomato Onion Curry', 'A quick and flavorful curry with just tomatoes and onions', 
 ARRAY['tomato', 'onion', 'salt'], 
 ARRAY['Heat oil in a pan', 'Slice onions and sauté until golden', 'Add chopped tomatoes', 'Season with salt', 'Cook until tomatoes break down', 'Simmer for 10 minutes'], 
 20, 'easy', 'Indian'),

('Onion Soup', 'Classic French onion soup made simple', 
 ARRAY['onion', 'salt'], 
 ARRAY['Slice onions thinly', 'Caramelize onions in a pot for 20 minutes', 'Add water to make soup consistency', 'Season with salt', 'Simmer for 15 minutes'], 
 35, 'easy', 'French'),

('Tomato Salad', 'Fresh and simple tomato salad', 
 ARRAY['tomato', 'salt'], 
 ARRAY['Slice tomatoes', 'Arrange on a plate', 'Sprinkle with salt', 'Let sit for 5 minutes before serving'], 
 10, 'easy', 'Mediterranean');