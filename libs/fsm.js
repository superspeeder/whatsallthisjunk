// Simple FSM library written by me (Andy Newton). See /defs/fsm.d.ts for some simple type documentation on how this works.
class FSMState {
    stateMachine

    onEnter(stateMachine) {
    }

    onLeave(stateMachine) {
    }

    onUpdate(stateMachine) {
    }
}
class FSMStateMachine {
    constructor(states) {
        this.states = states;
        this.state = null;
    }

    setState(targetState) {
        if (targetState === this.state || (targetState === null && this.state === null)) {
            return; // same state = noop
        }

        if (targetState === undefined) {
            console.warn("Cannot switch to state `undefined`");
            return;
        }

        if (targetState !== null && this.states[targetState] === undefined) {
            console.warn(`Cannot switch to undefined state: "${targetState}"`);
            return;
        }

        if (this.state !== null) {
            let currentState = this.states[this.state];
            if (currentState !== undefined) {
                currentState.state.onLeave(this, ...currentState.extraArgs);
            } else {
                console.warn(`Current state "${this.state}" is undefined, unable to call onLeave.`);
            }
        }

        this.state = targetState;

        if (targetState !== null) {
            let nextState = this.states[targetState];
            nextState.state.onEnter(this, ...nextState.extraArgs);

        }

    }

    step() {
        if (this.state !== null) {
            if (this.states[this.state] !== undefined) {
                this.states[this.state].state.onUpdate(this, ...this.states[this.state].extraArgs);
            }
        }
    }
}

