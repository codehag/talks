## The side effect saga

(maybe kinda title)

### Breakdown:

(not the abstract! Just loosely thinking about the problem, and listing what comes to mind.)

#### The context:

Browser debugger written in react.

#### The problem:

unmanagable and difficult to understand side effects, race conditions and multiple sources of
truths on debugger breakpoints.

#### Solution one (current solution):

Thunk args are a redux middleware. Thunk args make it easier to work with asyncronous resources. They rely on
async/await, and return complex objects that have an async promise.  Thunk args wrap an action creator and
delay the execution of a function until it is ready. They can introduce race conditions by virtue of
having tasks pushed to them and make it difficult to make descisions regarding structuring actions and reducers

#### Solution two (proposed solution):

Sagas, also a redux middleware, isolate side effects from actions and reducers. Sagas were introduced by
the database community in a 1987 paper as a way to cope with long lasting transactions, and might be
better described as process management. They have proven to be useful in a number of applications,
including distributed systems. The saga pattern was introduced into the react/redux community as a
way to manage side effects. The purpose is to isolate side effects into a controlled environment.i
They limit race conditions by pulling tasks, rather than having tasks pushed to them. Sagas rely on
javascript generators, which are not yet fully accepted into the ES spec. They return simple objects.
They are have a sharper learning curve than Thunk Args.


### Abstract version 1:

Functional programming has become very popular for building robust, complex UIs, and using react and
redux is a pleasure. However, there are some problems which have not been fully addressed with the
react/redux pattern, for instance, the scourge of the side effect, the horrors of the race conditions,
and asyncronous hell. These problems are not endemic to react/redux -- as such the inspiration for addressing
these issues have come from a variety of different sources

On the Firefox debugger, we have explored two options within the react ecosystem for dealing with these problems
which reach outside of the clean react-redux pattern: Thunk args and Sagas. Using a recent refactoring of
debugger breakpoints as a case study, We will explore the strengths and weaknesses of each, the rational and
histories behind the patterns, and how we came to our chosen solution. The talk will be a bit advanced, and
assumes some knowledge of react, reframe or similar frontend framework.

