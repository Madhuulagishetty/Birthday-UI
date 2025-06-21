import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://dummyjson.com/recipes');
        const data = await response.json();
        setRecipes(data.recipes.slice(0, 50));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const addToCart = (recipe) => {
    const existingItem = cart.find(item => item.id === recipe.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === recipe.id 
          ? {...item, quantity: item.quantity + 1} 
          : item
      ));
    } else {
      setCart([...cart, {...recipe, quantity: 1}]);
    }
  };

  const removeFromCart = (recipeId) => {
    const existingItem = cart.find(item => item.id === recipeId);
    if (existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === recipeId 
          ? {...item, quantity: item.quantity - 1} 
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== recipeId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <div className="relative">
          <ShoppingCart className="w-8 h-8" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-54"
          >
            <img 
              src={recipe.image} 
              alt='Akaay Studio Photography'
              title='Akaay Studio Photography'
              className="w-full h-48 object-cover"
            />
            <div className="p-4 ">
              <h2 className="text-xl font-semibold">{recipe.name}</h2>
              {cart.find(item => item.id === recipe.id) ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => removeFromCart(recipe.id)}
                    className="bg-red-500 text-white rounded-full p-1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{cart.find(item => item.id === recipe.id).quantity}</span>
                  <button 
                    onClick={() => addToCart(recipe)}
                    className="bg-green-500 text-white rounded-full p-1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                
              <div>
                 <br />
                 <button 
                  onClick={() => addToCart(recipe)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                 >
                  Add to Cart
                </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeApp;