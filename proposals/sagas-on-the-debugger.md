## The side effect saga

(maybe kinda title)

### Brain dump:

#### The context:

Browser debugger written in react.

#### The audience:
People interested in functional programming, and functional programming patterns that can be applied
elsewhere.

#### The problem:

Unmanageable and difficult to understand side effects, race conditions and multiple sources of
truths on debugger breakpoints. There are lot's of options for dealing with this, lets compare two.

#### Solution one (current solution):

Thunk args are a Redux middleware. A thunk refers to a subroutine which is used to complete a calculation
used by another subroutine. It is a piece of terminology that comes to use from the world of compilers, where
having arbitrary mathematical calculations that needed to be performed, rather than simple variables
needed a clearer way of being called. Thunk refers to the jocular derivative of "think" ([from wikipedia](https://en.wikipedia.org/wiki/Thunk) )
In React/Redux, thunk args make it easier to work with asynchronous resources. They rely on async/await, and return complex objects that have an async promise. Thunk args wrap an action creator and delay the execution of a function until it is ready. They can introduce race conditions by virtue of
having tasks pushed to them and make it difficult to make decisions regarding structuring actions and reducers

#### Solution two (proposed solution):

Sagas, also a Redux middleware, isolate side effects from actions and reducers. Sagas were introduced by
the database community in a 1987 paper as a way to cope with long lasting transactions, and might be
better described as process management. They have proven to be useful in a number of applications,
including distributed systems. The saga pattern was introduced into the React/Redux community as a
way to manage side effects. The purpose is to isolate side effects into a controlled environment.i
They limit race conditions by pulling tasks, rather than having tasks pushed to them. Sagas rely on
javascript generators. They return simple objects. They are have a sharper learning curve than thunk args.

#### potential questions

- why not redux-observable?

- why not use graphQL / Flux?

### Abstract

Functional programming has become popular for building robust, complex UIs. Using React and
Redux for example, alleviates many of the issues commonly found in UI programming. One in
particular is making changes in state are clear and predictable. However, there are some
problems which continue to be painful. Asynchronicity is one such pain point, since
changes to state which are asynchronous are difficult to predict and reason about.

In the Firefox debugger, we have explored two options within the react ecosystem for dealing with this:
thunk args and sagas.They take two different approaches to the problem of communicating with an async resource and updating the state.
Using a recent refactoring of debugger breakpoints as a case study, we will explore the
strengths and weaknesses of each. In the process we will clarify the rationale and histories behind the
patterns, how they solve the issue, and show how we came to our chosen solution. While the talk will be
focused on the issue from a front-end/UI perspective, it might prove an interesting inspiration for
similar problems in other places!

