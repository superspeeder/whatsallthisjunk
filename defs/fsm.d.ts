// Type definitions for my custom fsm implementation
// Definitions and library by Andy Newton

declare class FSMState {

    /**
     * Override this to handle the onEnter state change.
     *
     * @param stateMachine The calling state machine
     * @param extraArgs The arguments stored with the state when the state machine was set up.
     */
    onEnter(stateMachine: FSMStateMachine, ...extraArgs?: any[]): void;

    /**
     * Override this to handle the onEnter state change.
     *
     * @param stateMachine The calling state machine
     * @param extraArgs The arguments stored with the state when the state machine was set up.
     */
    onLeave(stateMachine: FSMStateMachine, ...extraArgs?: any[]): void;

    /**
     * Override this to do something each step of the state machine/
     *
     * @param stateMachine The calling state machine
     * @param extraArgs The arguments stored with the state when the state machine was set up.
     */
    onUpdate(stateMachine: FSMStateMachine, ...extraArgs?: any[]): void;
}

/**
 * Mapping of state names to states and the extra args which will be passed to their callbacks.
 */
declare interface FSMStates {
    [name: string]: { state: FSMState, extraArgs: any[] }
}

/**
 * Main state machine class. Manages the states.
 */
declare class FSMStateMachine {
    constructor(states: FSMStates);

    /**
     * Set the current state.
     *
     * Calls onLeave for the current state and then onEnter for new state (in that order).
     *
     * @param targetState The new state you are switching this machine to.
     */
    setState(targetState: string);

    /**
     * Step the state machine (calls onUpdate for the current state if the current state is not null).
     */
    step();

    /**
     * Access the current state. Do not write to this externally.
     */
    state: string | null;

    /**
     * Access the collection of all states
     */
    readonly states: FSMStates;
}
