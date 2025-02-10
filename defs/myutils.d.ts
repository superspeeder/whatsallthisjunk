interface PoolObjectParams {
    /**
     * Called to setup the initial objects. Try to fit the common heavy calls in here instead of in create because that's what makes the object pool useful.
     * 
     * @param extraParams Extra parameters passed in from the constructor of the pool
     * @returns The object in an initialized but not in use state (i.e. a physics object that is disabled and invisible so that it doesn't effect the world)
     */
    init: (...extraParams: ?any[]) => any;

    /**
     * 
     * @param object The object to "create"/configure
     * @param params The parameters passed in to the original call to create on the pool itself.
     */
    create: (object: any, ...params: ?any[]) => void;

    /**
     * This should reset the object state into the not-in-use state it started in.
     * 
     * @param object The object being released back to the pool
     */
    release: (object: any) => void;
}

/**
 * The return value from the create function of an ObjectPool. Also used to release entries in the pool.
 */
interface PoolEntry {
    object: any,
    index: integer,
}

class ObjectPool {
    /**
     * A simple object pool implementation
     * 
     * @param objectParams The set of callbacks which are used on objects
     * @param count How many objects the pool has
     */
    constructor(objectParams: PoolObjectParams, count: integer);

    /**
     * "Create" an object from this pool. Will return an object like { object: yourObject, index: poolIndex }.
     * If there are no available objects in the pool, returns null.
     * 
     * @param params Parameters to be passed to the create function
     */
    create(...params: ?any[]): PoolEntry | null;

    /**
     * Release an object back to the pool. Does nothing if the object has already been released.
     * 
     * @param entry The entry to release
     */
    release(entry: PoolEntry | integer);

    /**
     * Release all objects
     */
    releaseAll();
}

interface DistributionDefEntry<T> {
    value: T,
    p: number,
};

function normalizeDistribution<T>(distribution: DistributionDefEntry<T>[]): DistributionDefEntry<T>[];

function weightedChoice<T>(distribution: DistributionDefEntry<T>[]): T;

/**
 * Generates a reasonable collection of elements with limited randomness based on weights from a distribution.
 * Not intended to be used for actual randomness, but instead for doing reasonable setup of things when you need 40% of your collection to be a value.
 */
function generateWeightedCollection<T>(distribution: DistributionDefEntry<T>[], totalCount: integer): T[];