
/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */
function isCrushed () {}

if (process.env.NODE_ENV !== 'production') {
  if (
    typeof isCrushed.name === 'string' &&
    isCrushed.name !== 'isCrushed'
  ) {
    console.error(
      "You are currently using minified code outside of NODE_ENV === 'production'. " +
        'This means that you are running a slower development build. ' +
        'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
        'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' +
        'to ensure you have the correct code for your production build.'
    )
  }
}

export const createStore = (state, plugins) => {
  const store = {state}

  if (process.env.NODE_ENV !== 'production') {
    if (!(plugins instanceof Array)) {
      throw new TypeError('createStore() expects second argument to be a list of plugins.')
    }
  }

  for (const plugin of plugins) plugin(store)

  return store
}
