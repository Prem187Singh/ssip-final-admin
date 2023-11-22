import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  accessToken: localStorage.getItem('accessToken')
    ? localStorage.getItem('accessToken')
    : null,
    refreshToken: localStorage.getItem('refreshToken')
    ? localStorage.getItem('refreshToken')
    : null,
  batches: [],
  semesters: [],
  profileDetails: [],
  currentBatch: [],
  objectCount:[],

  accessTokenActive:false
};

function reducer(state, action) {
  switch (action.type) {
    case 'ACCESS_TOKEN':
      return { ...state, accessToken: action.payload };
    case 'REFRESH_TOKEN':
      return { ...state,refreshToken: action.payload}
    case 'SET_ACCESS_TOKEN_ACTIVE':
        return { ...state,accessTokenActive: action.payload}
    case 'USER_SIGNOUT':
      return {
        ...state,
        accessToken: null
      };
    case 'GET_BATCHES':
      return {
        ...state,
        batches : action.payload
      };
      case 'SET_404':
      return {
        ...state,
        set404 : action.payload
      };
      case 'GET_OBJECTS':
        return {
          ...state,
          objectCount : action.payload
        };
    case 'ADD_BATCHES':
      return{
        ...state,
        batches: state.batches.push(action.payload),
      }
    case 'GET_SEM':
      return {
        ...state,
        semesters: action.payload
      }
    case 'SET_PROFILE':
      return {
        ...state,
        profileDetails: action.payload
      }
      case 'CURRENT_BATCH_SLUG':
      return {
        ...state,
        currentBatch: action.payload
      }
    case 'ADD_SEM':
      return {
        ...state,
        semesters: state.semesters.push(action.payload)
      }
      case 'CURRENT_BATCH_SLUG':
              return{
                ...state,
                currentBatch:action.payload
              }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

// Add propTypes validation
StoreProvider.propTypes = {
  children: PropTypes.node.isRequired
};
