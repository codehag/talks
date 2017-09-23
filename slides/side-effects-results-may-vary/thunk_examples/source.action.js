export function basicAction() {
  return ({ dispatch }) => {
    dispatch({ type: "BASIC_ACTION", message: "hi" });
}


/////////////////

export function newSource(source) {
  return async ({ dispatch, getState }) => {
    dispatch({ type: "ADD_SOURCE", source });
    dispatch(loadSourceMap(source)); // an async operation
    await checkSelectedSource(getState(), dispatch, source);
    await checkPendingBreakpoints(getState(), dispatch, source);
  };
}

export function loadSourceText(source) {
  return async ({ dispatch, getState }) => {
    if (source.text) {
      return Promise.resolve(source);
    }

    await dispatch({
      type: "LOAD_SOURCE_TEXT",
      source: source,
      [PROMISE]: loadSourceTextContents(source)
    });

    await dispatch(setSymbols(source.id));
    await dispatch(setEmptyLines(source.id));
  };
}
