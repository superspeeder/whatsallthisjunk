MyUtils = {
    ObjectPool: class {
        constructor(objectParams, count, ...extraParams) {
            this.objectParams = objectParams;
            this.count = count;
            this.available = []
            this.inUse = []
            this.pool = []
            for (let i = 0; i < this.count; i++) {
                this.pool.push(objectParams.init(...extraParams));
                this.available.push(i)
                this.inUse.push(false)
            }
        }

        create(...params) {
            let index = this.available.shift();
            if (index === undefined) {
                return undefined;
            }

            let obj = this.pool[index];
            this.inUse[index] = true;

            this.objectParams.create(obj, ...params);

            return { object: obj, index: index };
        }

        release(entry) {
            let obj;
            let index;

            if (entry.index !== undefined) {
                if (this.inUse[entry.index]) {
                    obj = this.pool[entry.index]
                    index = entry.index;
                }
            } else {
                if (this.pool[entry] !== undefined) {
                    if (this.inUse[entry]) {
                        obj = this.pool[entry]
                        index = entry;
                    }
                }
            }

            if (obj !== undefined) {
                this.objectParams.release(obj);
                this.inUse[index] = false;
                this.available.push(index);
            }
        }

        releaseAll() {
            this.available = []
            for (let i = 0; i < this.count; i++) {
                this.available.push(i)
                this.inUse[i] = false
            }
        }
    },

    /**
     * @template T 
     * @param {MyUtils.DistributionDefEntry<T>[]} distribution
     */
    normalizeDistribution: function (distribution) {
        /** @type {number} */
        let totalProbability = 0.0
        for (let i = 0; i < distribution.length; i++) {
            totalProbability += distribution[i].p;
        }

        if (totalProbability == 1.0) {
            return distribution; // already normalized.
        }

        /** @type {MyUtils.DistributionDefEntry<T>[]} */
        let normalized = []
        for (let i = 0; i < distribution.length; i++) {
            normalized.push({ value: distribution[i].value, p: distribution[i].p / totalProbability });
        }

        return normalized
    },

    /**
     * @template T 
     * @param {MyUtils.DistributionDefEntry<T>[]} distribution
     * @returns {T}
     */
    weightedChoice: function (distribution) {
        /** @type {number} */
        let totalSpace = 0.0;

        for (let i = 0; i < distribution.length; i++) {
            totalSpace += distribution[i].p;
        }

        /** @type {number} */
        let offset = 0.0;

        let rv = Math.random() * totalSpace;

        for (let i = 0; i < distribution.length; i++) {
            offset += distribution[i].p;
            if (rv <= offset) {
                return distribution[i].value;
            }
        }

        // default to returning the first thing in the distribution
        // (this *shouldn't* be reachable if my logic is right but I don't want to return undefined if this does happen to get reached, unless the input isn't properly defined).
        return distribution[0].value;
    },

    /**
     * @template T 
     * @param {MyUtils.DistributionDefEntry<T>[]} distribution
     * @returns {T[]}
     */
    generateWeightedCollection: function (distribution, totalCount) {
        // We need to be using a normalized distribution for this function.
        let distributionReal = MyUtils.normalizeDistribution(distribution);

        let results = [];
        let totalGenerated = 0;

        let counts = []
        for (let i = 0 ; i < distributionReal.length ; i++) {
            let n = Math.floor(distributionReal[i].p * totalCount);
            counts.push(n);
            totalGenerated += n;
        }

        for (let i = 0 ; i < distributionReal.length ; i++) {
            for (let j = 0 ; j < counts[i] ; j++) {
                results.push(distributionReal[i].value);
            }
        }

        if (totalGenerated != totalCount) { // Everything didn't divide evenly, add some randomly weighted by the distribution.
            for (let i = 0 ; i < totalCount - totalGenerated ; i++) {
                results.push(MyUtils.weightedChoice(distributionReal));
            }
        }

        return results;
    }
}