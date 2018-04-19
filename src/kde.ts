import * as utilities from './utilities';
import {ABT} from './abt';
import {Model} from './model';

export class KDE extends Model{
    //it makes sense for the KDE to store the ABT that it's using as a training set.
    //the KDE class should represent a single kernel density *estimate*, i.e. one joint probability distribution calculated from a dataset and a bandwidth, distance metric, etc.
}