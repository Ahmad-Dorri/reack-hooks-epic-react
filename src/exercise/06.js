// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

const reducerFunction = (state, action) => {
  switch (action.type) {
    case 'pending':
      return {
        status: 'pending',
      }
    case 'resolved':
      return {
        status: 'resolved',
        data: action.payload,
      }
    case 'rejected':
      return {
        status: 'rejected',
        data: action.payload,
      }
    default:
      throw Error('invalid type')
  }
}

function PokemonInfo({pokemonName}) {
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState(null)
  // const [status, setStatus] = React.useState('idle')
  const [state, dispatch] = React.useReducer(reducerFunction, {
    status: pokemonName ? 'pending' : 'idle',
  })
  // idle, pending, resolved, rejected
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    if (!pokemonName) return
    dispatch({type: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        dispatch({type: 'resolved', payload: pokemon})
      },
      error => {
        dispatch({type: 'rejected', payload: error.message})
      },
    )
  }, [pokemonName])

  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  if (state.status === 'idle') {
    return 'Submit a pokemon'
  }

  if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (state.status === 'rejected') {
    throw state.data
  }
  if (state.status === 'resolved')
    return <PokemonDataView pokemon={state.data} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary resetKeys={[pokemonName]} onReset={handleReset}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
