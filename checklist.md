- [x]    Use multiple Scene classes (dictated by your game's style) (1)
- [x]    Properly transition between Scenes and allow the player to restart w/out having to reload the page (1)  
- [x]    Include in-game instructions using text or other means (e.g., tooltips, tutorial, diagram, etc.) (1)
- [x]    Have some form of player input/control appropriate to your game design (1)
- [x]    Include one or more animated characters that use a texture atlas/sprite sheet* (1)
- [x]    Simulate scrolling with a tileSprite (or equivalent means) (1)
- [x]    Implement proper collision detection (via Arcade Physics or a custom routine) (1)
- [x]    Have looping background music* (1)
- [x]    Use a minimum of four sound effects for key mechanics, UI, and/or significant events appropriate to your game design (1)
- [x]    Use randomness to generate escalating challenge, e.g. terrain, pickups, etc. (1)  
- [x]    Include some metric of accomplishment that a player can improve over time, e.g., score, survival time, etc. (1)
- [x]    Be theoretically endless (1)
- [x]    Be playable for at least 15 seconds for a new player of low to moderate skill (1)
- [x]    Run without significant crashes or errors (1)
- [ ]    Include in-game credits for all roles, assets, music, etc. (1)


...do something technically interesting? Are you particularly proud of a programming technique you implemented? Did you look beyond the class examples and learn how to do 
something new? (1)

> I implemented my own finite state machine, as well as some random utilities and object pooling (which I use for projectiles). I spent a bit of time trying to figure out how to write my own .d.ts file for those things so that I could get in-editor suggestions (and as a result also figured out how to use JSDoc to get those without needed the defs file, and you'll see that they are littered around my codebase). I also made a very simple parallax scrolling setup for the layers (just based on scalar multiples to movement speed) which makes the movement of things look significantly better in my opinion.


...have a great visual style? Does it use music or art that you're particularly proud of? Are you trying something new or clever with the endless runner form? (1)

> I had a lot of fun making the art for this, especially the animation I did for the powerup sprite. I also really like how the nebulae that I place randomly as decoration in the scene turned out, I think they add a lot to the feel of the game. I'm not necessarily trying anything new with this form, mostly I just had the idea that instead of making the classic shoot rocks in space thing, I'd try and make a bunch of obstacles that you wouldn't find in space, which landed me on cars and cardboard boxes. This is also what inspired the title "What's all this junk??", since the junk is more akin to what you might find on Earth instead of what we'd find in space.