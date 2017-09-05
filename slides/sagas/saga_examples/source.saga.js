export function* watchBasicAction() {
  yield takeEvery('BASIC_ACTION', basicSaga)
}

function* basicSaga(args) {
  const message = yield call(asyncOperation, args); // { message: `hi ${user}` }
  yield put({ "SUCCESSFUL_ACTION", message });
}

/////////////////////////////


export function* watchNewSource() {
  yield takeEvery('NEW_SOURCE', newSource)
}

export function* newSource(source) {
  yield put({ type: "ADD_SOURCE", source });
  yield spawn(loadSourceMap(source));
  yield spawn(checkSelectedSource(source));
  yield spawn(checkPendingBreakpoints(source));
}

function* checkBreakpoints(source) {
  const breakpoints = yield select(getBreakpointsForSource, source.url);

  yield put.resolve({ type: "LOAD_SOURCE_TEXT", source });
  const breakpointsData = yield all(
    breakpoints.reduce(checkBreakpointLocation, [])
  )

  yield put({ type: "SYNC_BREAKPOINTS", breakpointsData, source });
}

function* selectSource(sourceId,) {
  const source = yield select(getSource, sourceId);
  yield put({ type: "LOAD_SOURCE_TEXT", source });
  yield put({ type: "SELECT_SOURCE", sourceId });
}

export function* watchLoadSourceText() {
  const requestChan = yield actionChannel('LOAD_SOURCE_TEXT')
  while (true) {
    const { payload: { source } } = yield take(requestChan)
    if (source.text) {
      yield source;
    } else {
      yield call(loadSourceText, source)
    }
  }
}

function* loadSourceMap(source) {
  if (hasSourceMap(source)) {
    const data = yield call(loadSourceMap, source);
    yield put({ type: "LOAD_SOURCE_MAP", source, ...data });
  }
}

function* loadSourceText(source) {
  const data = yield call(loadSourceTextContents, source);
  yield put.resolve({ type: "SOURCE_TEXT_AVAILABLE", source, ...data });
  yield call(setSymbols, source.id);
  yield call(setEmptyLines, source.id);
}

// retry and error handling
function* loadSourceTextRepeat(source) {
  for(let i = 0; i < 5; i++) {
    try {
      yield call(loadSourceText, source)
    } catch (err) {
      yield call(delay, 1000); // try again in a bit
    }
  }
  yield put({ type: "LOAD_TEXT_ERROR", source });
}
//
// retry and error handling
function* streamSource(source) {
  try {
    yield call(loadSourceText, source)
  } catch (err) {
    yield put({ type: "DELETE_SOURCE", source }); //re-enter the queue at the end
  }
}
