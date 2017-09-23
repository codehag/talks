function update(state, action) {
  switch (action.type) {
    case "BASIC_ACTION":
      if (action.status === "start") {
        return action.message;
      }
      if (action.status === "done") {
        return action.message;
      }
      return state;

    default:
      return state;
  }
}

/////////////////////////////


function update(state, action) {
  switch (action.type) {
    case "LOAD_SOURCE_TEXT":
      const { value, source, status } = action;

      if (status === "start") {
        const sourceData =  { id: source.id, loadedState: "loading" };
        return updateSource(state, sourceData);
      }

      if (status === "done") {
        const sourceData = {
          text: value.text,
          id: source.id,
          contentType: value.contentType,
          loadedState: "loaded"
        };

        return updateSource(state, sourceData);
      }

      if (status === "error") {
        const sourceData = { id: source.id, error: action.error, loadedState: "error" };
        return updateSource(state, sourceData);
      }

      return state;


    default:
      return state;
  }
}

