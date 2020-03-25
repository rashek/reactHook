import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'; 
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import Search from './Search';

const ingredientReducer = (currentIngredients, action ) => {
  switch(action.type) {
    case 'SET':
    return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredients];
    case 'DELETE':
      return currentIngredients.filter(ing=> ing.id !== action.id)
    default:
      throw new Error('Should not come here!');
  }
}



const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer,[]);
  const {isLoading, 
    error, 
    data, 
    sendRequest, 
    reqExtra, 
    reqIdentifier} = useHttp();
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setLoading]=useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({type: 'DELETE', id: reqExtra})
    }
    else if(!isLoading && data && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', 
      ingredients: {id: data.name, ...reqExtra}})
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error])

  const filteredIngredientsHandler = useCallback(filteredIngredients =>{
    // setUserIngredients(filteredIngredients);
    dispatch({type:'SET', ingredients:filteredIngredients})
  },[])
  

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://rashekdemopp.firebaseio.com/ingredients.json', 
    'POST', 
    JSON.stringify(ingredient),
    'ADD_INGREDIENT'
    )},[sendRequest])
  const removeIngredientHandler = useCallback( ingredientId => {
    sendRequest(`https://rashekdemopp.firebaseio.com/ingredients/${ingredientId}.json`,
    'DELETE',
    null,
    ingredientId,
    'REMOVE_INGREDIENT'
    )      
  },[sendRequest])

  const clearModal = useCallback(() => {    
    dispatch({type: 'CLEAR'});
  },[])

  const ingredientList= useMemo(() => {
    return(
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
    )
  },[userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearModal}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient ={addIngredientHandler} loading= {isLoading}/>

      <section>
        <Search onloadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;

