function update(state, action) {
  switch (action.type) {
    case "BASIC_ACTION":
      return action.message;

    case "SUCCESSFUL_ACTION":
      return action.message;

    default:
      return state;
  }
}

/////////////////////////////

function update(state, action) {
  switch (action.type) {
    case "LOAD_SOURCE_TEXT":
      const source = action.source;
      const sourceData = { id: source.id, loadedState: "loading" }
      return updateSource(state, );

    case "SOURCE_TEXT_AVAILABLE":
      const { source, text, contentType } = action;
      const sourceData = {
        text: text,
        id: source.id,
        contentType: contentType,
        loadedState: "loaded"
      };
      return updateSource(state, sourceData);

    case "SOURCE_ERROR":
      const source = action.source;
      const sourceData = { id: source.id, error: action.error, loadedState: "error" }
      return updateSource(state, sourceData);

    default:
      return state;
  }
}
