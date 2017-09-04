export async function basicPromise(arg) {
  const message = await asyncOperation; // { message: `hi ${user}` }
  return message;
}

/////////////////////////////

export function newSource(source) {
  return async ({ dispatch, getState }) => {
    dispatch({ type: "ADD_SOURCE", source });

    dispatch(loadSourceMap(source)); // an async operation

    await checkSelectedSource(getState(), dispatch, source);
    await checkPendingBreakpoints(getState(), dispatch, source);
  };
}

async function checkBreakpoints(state, dispatch, source) {
  const breakpoints = getBreakpointsForSource(state, source.url);

  await dispatch(loadSourceText(source));
  const breakpointsData = Promise.all(
    breakpoints.reduce(checkBreakpointLocation, [])
  )
  await dispatch(syncBreakpoints(source, breakpointsData);
}

export function selectSource(sourceId}) {
  return ({ dispatch, getState }) => {
    const source = getSource(getState(), id);

    dispatch(loadSourceText(source));
    return dispatch({ type: "SELECT_SOURCE", sourceId });
  };
}

export function loadSourceText(source) {
  return async ({ dispatch }) => {
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
