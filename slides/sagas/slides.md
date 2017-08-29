
Concept -- treat the talk like a play. the debugger is the stage, and there are a number of actors
on the stage. introduce each actor, describe their role, how they work. The "antagonist" is played
by asynchronous code. And then we have our two competing solutuions. The twist comes at the end.

#Sagas (Theme: don quixote)

This talk is ultimately about side effects. while not impossible, it is very difficult to build an
application of a certain level of complexity without using state. And state, by necessity, implies
impure functions

And, I am speaking from experience, when I say it is rather difficult to build a complex application
without state. I work as a developer tools developer at firefox. I work on this panel

#The Stage: Debugger (screenshot of the debugger)

The debugger. My day to day life is very meta. I am usually debugging the debugger with the debugger
while its debugging the browser running the debugger debugging -something-.

(screenshots or gif of the debugger debugging the debugger)

sometimes the debugger. There are all kinds of bits of state to be dealt with.
Breakpoints; watch expressions; pause state; current sources, loading sources; etc.

Our clientside used to be built in XUL, a custom DSL that firefox had developed for its UI, when
nothing better was available, and HTML was still in version 3.0. Now, almost immediately when it
was released, we wanted to get rid of it. XUL was full of state. At the time this was developed,
we did not have the patterns that we have now, for UI development. It was difficult to make changes.
It was difficult to know what consiquences a patch might have in a code base.

But times changed. Along came backbone, and then angular, and then react! But more importantly than any of these
frameworks, UI programming gained a lot of knowledge from other disciplines, and that influence
changed how we think about UIs. React was one of many, but one of the great things about react,
is this pattern

#Enter Left: Flux (a book about an epic knights quest)

called flux. The general idea of this pattern might be familiar. You keep all of your
state in a single spot. In the case of redux, you keep it in a store. And you communicate through
actions. Through events. And this is great for a UI, because a UI is essentially a stream of events
from the user. Or in our case, from the user, and from the debuggee.

We began making the move to React in the last two years. And in many ways it improved the experience
for people working on the code base. It was now much clearer what was happening, for example, when a
breakpoint is being set.

# Setting a breakpoint (screenshot of xul code next to redux code)

whereas before we had a mess, we could now say -- "user sets a breakpoint", then, we could respond
to that with every piece of the UI that is interested in a breakpoint being set.

# Great! but...

If applications were self contained, with a predictable exectution, things would be easy. but between
our two actors, on the stage of the debugger -- the user and the debuggee, there is a third, equally
important character

# Enter right: the asynchronous service (windmills and don quixote)

Now, many of you who have worked on the frontend know this character intimately. Perhaps you used
ajax, or the classic xhr to communicate with it. And when talking to an asynchronous service you
have to be mindfull of one thing in particular -- has the data from the service loaded yet... or
not?

And when you need to remember something like this... when you need to remember anything - you have
state

An asynchronous function is by definition stateful. But it does not fit neatly into the flux
pattern. And a good question here would be, well why not?

# Chapter 1: The promise (don quixote and the shepardess marcela, 2 images)

If you have been working with Javascript long enough to remember XHR, I feel for you. For those of
you who might not be as familiar with javascript, XHR required you add event listeners in order to
discover if the request was finished. Ajax improved this, adding a human readible wrapper around the
api, and it was finally officially improved in the form of a promise. A promise is a special type of
object that changes its own state. The possible state are pending, done and error.

Herein lies the problem. Flux is not prepared to deal with complex objects being sent as actions.
Where do you deal with failures of the request? in the action? in the reducer? neither place makes
sense, the reducer is for setting the final state, and the action is for telling what happened. So
what do we do, and keep our code maintainable?

# A real world example (code, diagram of redux -> server communication);

We talked about breakpoints before, lets take another look at them. The flow of data is quite clear,
a user sets a breakpoint, we should see a breakpoint appear in the UI. What we do not see in the
background, is that the debugger server is checking of the breakpoint is valid. If it is valid, the
breakpoint sticks. If it is invalid, the breakpoint slides to the nearest node below where it was
set. This is where our asynchronous code lies.

So we have our characters. We have our user, our debugger and our debuggee. We have our action --
adding a breakpoint, and we have our application state. And finally we have our asynchronous
service, waiting to be called, and to respond to our requests. But how do we fit these pieces
together, and still be able to look at our codebase and still be able to say "i think i know what is
going"?

# Chapter 2: A moment of inspiration.

As I mentioned at the beginning of this presentation, one of the truely exciting things in the
Javascript community right now, is the inspiration coming to it from other fields in computer
science, and I think this problem, that is -- asynchronous state -- illustrates that beautifully.
This issue was noticed by a number of people, and several solutions were put forward. I am going to
cover two of them from within the Redux echosystem -- Thunks and Sagas. I will begin with Thunks
because they are generally easier to understand.

#Thunks
Thunk args are a Redux middleware. A thunk refers to a subroutine which is used to complete a calculation
used by another subroutine. It is a piece of terminology that comes to use from the world of compilers, where
having arbitrary mathematical calculations that needed to be performed, rather than simple variables
needed a clearer way of being called. Thunk refers to the jocular derivative of "think" ([from wikipedia](https://en.wikipedia.org/wiki/Thunk) )
In React/Redux, thunk args make it easier to work with asynchronous resources. They rely on async/await, and return complex objects that have an async promise. Thunk args wrap an action creator and delay the execution of a function until it is ready. They can introduce race conditions by virtue of
having tasks pushed to them and make it difficult to make decisions regarding structuring actions and reducers

here is an example of how it looks when added to the data flow of our breakpoints action. As you can
see, it wraps all calls to the reducer

#Sagas
Sagas, also a Redux middleware, isolate side effects from actions and reducers. Sagas were introduced by
the database community in a 1987 paper as a way to cope with long lasting transactions, and might be
better described as process management. They have proven to be useful in a number of applications,
including distributed systems. The saga pattern was introduced into the React/Redux community as a
way to manage side effects. The purpose is to isolate side effects into a controlled environment.i
They limit race conditions by pulling tasks, rather than having tasks pushed to them. Sagas rely on
javascript generators. They return simple objects. They are have a sharper learning curve than thunk args.

here is an example of how it looks when added to the data flow of our breakpoints action. As you can
see, it queues calls, and decides when to act on a given message

#Looking at them side by side

#Chapter 3: the conclusion (don quixote, in bed, with the books burning)

Sagas are exciting and epic, and a brilliant solution to our problem. But we went with thunks for
now.

reasons:
- community (it is easier to work with thunks than sagas, and we dont have the training resources)
- a hidden fact, realigning ourselves with flux solved most of our problems
- we still have issues, but balancing the amount of time it would take to fully implement sagas, and
  the current large release we are facing - we have put it on hold

#Epilogue (quixote back on his horse)

Sagas are still on our todo list.
