export const initialState = {
  user: null,
  cart: {},
  userDoc: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "UPDATE_CART":
      return {
        ...state,
        cart: action.cart,
      };
    case "UPDATE_USERDOC":
      return {
        ...state,
        userDoc: action.userDoc,
        cart: action.userDoc.cart,
      };
    default:
      return state;
  }
}

export default reducer;
