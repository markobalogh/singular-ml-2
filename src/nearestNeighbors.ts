import {TemplateMatchingModel} from './templateMatchingModel';
import {Parameter} from './parameter';
import {Instance} from './instance';
import { Normalization } from './normalization';
import {Feature} from './feature';
import {DistanceWeighting} from './distanceWeighting';
import {DistanceMetric} from './distanceMetric';
import {randomSample} from './utilities';

//SUPPORTED DISTANCE WEIGHTING MODES HERE //
export let generalizedGaussian = new DistanceWeighting();
generalizedGaussian.evaluate = function(instanceA:Instance, instanceB:Instance):number {
    return 1;
};
export let constant = new DistanceWeighting();

//SUPPORTED DISTANCE METRICS HERE //
export let euclidean = new DistanceMetric();

export enum ZeroDistanceHandling {
    continue,
    remove,
    return
}

export class NearestNeighbors extends TemplateMatchingModel {
    public k:Parameter;
    public sigma:Parameter;
    public exponent:Parameter;
    public power:Parameter;
    public featureWeights:Parameter[];

    // should I have classes for all these options?? they could have static methods. Or can I import instances of the classes directly?

    constructor(public templates:Instance[], public distanceWeighting:DistanceWeighting=GeneralizedGaussian, public featureWeighting:boolean=false, public distanceMetric:DistanceMetric=euclidean, public zeroDistanceHandling:ZeroDistanceHandling, public normalization:Normalization) {
        super();
        //handle different parameter initializations based on the behaviors specified in the constructor.
        switch (this.distanceWeighting) {
            case generalizedGaussian:
                this.sigma = new Parameter(1, false, ...this.calculateSigmaBounds());
                this.exponent = new Parameter(2)
                this.power = new Parameter(1)
        }
        this.k = new Parameter(undefined)
        this.featureWeights = [];
    }

    /**
     * Finds a reasonable lower and upper bound for searching for an optimal sigma value. Choose a random subset of the template list and calculates the lower and upper bound by finding the 1st and 99th percentiles of the distance between any two instances in this subset.
     */
    private calculateSigmaBounds():number[] {
        if (this.templates.length > 1000) {
            let instancesToTest = randomSample(this.templates, 50)
            
        }
    }
}