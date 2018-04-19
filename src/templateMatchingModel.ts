import {Model} from './model';
import {Instance} from './instance';
import * as utilities from './utilities';

/**
 * Template matching models compare query instances against a set of template instances in order to make a prediction.
 */
export abstract class TemplateMatchingModel extends Model {
    public abstract templates:Instance[];
}