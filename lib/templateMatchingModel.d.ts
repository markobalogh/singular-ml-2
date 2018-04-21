import { Model } from './model';
import { Instance } from './instance';
/**
 * Template matching models compare query instances against a set of template instances in order to make a prediction.
 */
export declare abstract class TemplateMatchingModel extends Model {
    abstract templates: Instance[];
}
