
Concept -- treat the talk like a play. the debugger is the stage, and there are a number of actors
on the stage. introduce each actor, describe their role, how they work. The "antagonist" is played
by asynchronous code. And then we have our two competing solutuions. The twist comes at the end.

#Sagas (Theme: don quixote)

This talk is ultimately about side effects. while not impossible, it is very difficult to build an
application of a certain level of complexity without using state. And state, by necessity, implies
impure functions

#The Stage: Debugger (screenshot of the debugger)

(screenshots or gif of the debugger debugging the debugger)

We are going to look at one of the most important interactions users have with the debugger, and
that involves setting breakpoints. breakpoints allow you to stop the execution of a piece of code at
a designated location, and this in turn allows you to run code in that context to see what is going
wrong with your code. You can also inspect how different variables have been evaluated. There are
more complex things that can be done, such as watch expressions and conditional breakpoints, but for
now we will focus on this case.

[gif - breakpoint with console]

There is some pretty clear state that we need to deal with. We need to know if a break point exists,
where it is set, in which file, and what other breakpoints are associated with this domain.

# Breakpoints, the primary task of a debugger

Lets talk a bit about what breakpoints are. They are a list of points in code where you want to stop
the execution so that you can walk through the execution step by step.
when we are setting the breakpoint we essentially want to take a
user's interaction in the UI, and register it with the server

however, we have multiple UI interactions that could potentially set a breakpoint. You can set a
breakpoint from the gutter of the editor, but you can also modify it from the breakpoints panel --
making it active or inactive, or the entire group active or inactive. We also have multiple sources
that need to display the same breakpoint, for example a bundle file has a breakpoint at 40000, and
the sourcemapped version of the file has a breakpoint at line 10. We need to know about both of
these.

If we model this as an object oriented problem, it will be rather difficult to keep track of everything. instead, we are using a
rather well established pattern,

#Enter Left: Flux/redux (a book about an epic knights quest)

The general idea of this pattern might be familiar. You keep all of your
state in a single spot. In the case of redux, you keep it in a store held in memory. You communicate through
actions. Through events. This is great for a UI, we can have multiple interested views in a given piece of
data, and multiple places from which that can be influenced, yet it all stays in sync.

While the flux pattern is a smaller part of this story, i want to give a bit of context before
moving on, because this pattern will be crucial later on. After all, both Thunks and sagas are
middleware for flux.

Flux works with actions and reducers, we have the following flow of data

We have three characters in a flux dispatch. We have a dispatcher which takes care of sending an
object to a reducer. an action (probably created by an action creator) and the reducer, who updates
the store, and takes the existing state and combines it with the new state. You want both the action
and the reducer to be only concerned with one thing. The action should be interested in making a
simple object that says "what just happened". the reducer should take the data and mix it in with
the state as necessary.

dispatch ({ action }) -> reducer sets state

#Breakpoints, an epic journey of data

Lets get back to breakpoints. A naive implementation of this might look something like this:

UI event -> get breakpoint data -> set breakpoint data on the server -> set breakpoint on the client

the order of the last two doesnt matter so much, since we are not doing any validation in this naive
implementation. but lets continue with our user story about breakpoints

as a user, you are likely to get to a point where you want persisted breakpoints, for example, if the
functionality that you are trying to debug runs when the page loads, it helps that the breakpoint
doesnt disappear as soon as you refresh, or restart the browser.

UI event -> breakpoint data -> set initial breakpoint -> send to server -> save to persisted store

Now we have another data flow that could potentially occur, and that is -- restoring breakpoints on
initial load.

Load Source Event -> get breakpoint data -> set initial breakpoint -> send to server

ok, lets look at this conceptually more interesting case. You have a breakpoint that you have set in
your code, and your code changes. you reload the page -- and... suddenly you have a breakpoint that
is in an invalid location. so at the end of each of these steps we have to reset a breakpoint if it
has moved.

Cool. but when we are talking to the server, we are talking to something that does not execute in
line with our applciation. Its asynchronous. Which means, there is implicit state that we cannot
store in the reducer (it is not meaningful to the application). So what do we do

# Enter right: the asynchronous service (windmills and don quixote)

Now, many of you who have worked on the frontend know this character intimately. Perhaps you used
ajax, or the classic xhr to communicate with it. And when talking to an asynchronous service you
have to be mindfull of one thing in particular -- has the data from the service loaded yet... or
not?

And when you need to remember something like this... when you need to remember anything - you have
state. How do we deal with this

# Thunk it.

one solution, within the redux ecosystem, is redux-thunk
Thunk args are a Redux middleware. A thunk refers to a subroutine which is used to complete a calculation
used by another subroutine. It is a piece of terminology that comes to use from the world of compilers, where
having arbitrary mathematical calculations that needed to be performed, rather than simple variables
needed a clearer way of being called. Thunk refers to the jocular derivative of "think" ([from wikipedia](https://en.wikipedia.org/wiki/Thunk) )
In React/Redux, thunk args make it easier to work with asynchronous resources. They rely on async/await, and return complex objects that have an async promise. Thunk args wrap an action creator and delay the execution of a function until it is ready. They can introduce race conditions by virtue of
having tasks pushed to them and make it difficult to make decisions regarding structuring actions and reducers

here is an example of how it looks when added to the data flow of our breakpoints action. As you can
see, it wraps all calls to the reducer

# Chapter 1: The promise (don quixote and the shepardess marcela, 2 images)

For those of you who might not be as familiar with javascript for some time, you know about XHR.
XHR required you add event listeners in order to discover if the request was finished. Ajax improved
this, adding a human readible wrapper around the
api, and it was finally officially improved in the form of a promise. A promise is a special type of
object that changes its own state. The possible state are pending, done and error.


# A real world example (code, diagram of redux -> server communication);

So, in order to implement promises, we have a wrapper around the redux dispatch call.
this is a good way to solve our basic problem, which is that we do not have a problem with async
anymore

but lets look at another case of breakpoints.

# Lets look at another data flow: new sources

initial load -> newSource -> breakpoints -> load sourcetext -> construct symbols -> add breakpoints
initial load -> newSource -> loadSourcetext -> construct symbols -> show text

^ as code

# Chapter 2: the epic. or the saga. (don quixote as a proper night, with sancho as a mayor)

Lets take a look at an alternative to Thunks.
Sagas, also a Redux middleware, isolate side effects from actions and reducers. Sagas were introduced by
the database community in a 1987 paper as a way to cope with long lasting transactions, and might be
better described as process management. They have proven to be useful in a number of applications,
including distributed systems. The saga pattern was introduced into the React/Redux community as a
way to manage side effects. The purpose is to isolate side effects into a controlled environment.i
They limit race conditions by pulling tasks, rather than having tasks pushed to them. Sagas rely on
javascript generators. They return simple objects. They are have a sharper learning curve than thunk args.

here is an example of how it looks when added to the data flow of our breakpoints action. As you can
see, it queues calls, and decides when to act on a given message

# A short aside: Generators

Generators are a relatively new addition to javascript. They are essentially iterator constructors.
they build an object with a .next() method.

# Lets look at the same example from before: new sources

initial load -> newSource -> breakpoints -> load sourcetext -> construct symbols -> add breakpoints
initial load -> newSource -> loadSourcetext -> construct symbols -> show text

^ as code

# a couple of challenges

Our code base is already written as mentioned before. Our plan was, in spring, to start the
transition to sagas. We didn't do this. at least not yet.

first, we thought that our problem was much bigger than it was. we refactored our code to adhere
more closesly to the flux pattern, and a number of the problems we had with thunks disappeared.

secondly, we have a tight deadline right now. it doesnt make sense to make a refactoring of this
scale just yet

third, we have a bit of training to do, amongst ourselves and also among the community.
