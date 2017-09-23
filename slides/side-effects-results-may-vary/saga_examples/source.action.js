export function basicAction() {
  return ({ dispatch }) => {
    dispatch({ type: "BASIC_ACTION", message: "hi" });
}

///////////////////////

export function newSource(source: Source) {
  return ({ dispatch }) => {
    dispatch({ type: "ADD_SOURCE", source });
  })
}

export function loadSourceText(source: Source) {
  return ({ dispatch }) => {
    dispatch({ type: "LOAD_SOURCE_TEXT", source });
  })
}
