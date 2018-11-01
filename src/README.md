# singular-ml-2

Emphasize chaining, pipeline style class members (i.e. the methods of a class often perform some action on the instance and return a different class) so that the entire method chain is readable as a pipeline rather than using f(g(x)) method composition. We prefer passing functions into pipeline arguments rather than using enclosure style function composition. Example:
`new ABT().fromFile('/test.abt').learnWith(NearestNeighbors).scoreWith(MAE)`
instead of 
`MAE(NearestNeighbors(ABT('/test.abt')))`

When possible, use method names to clarify the meaning of arguments, keeping the method chain readable. Example:
`new NearestNeighbors.withDistanceWeighting(Gaussian).withFeatureWeights([1,1,1,1,1])` vs `new NearestNeighbors(Gaussian, [1,1,1,1,1])`

A consequence of this is that almost all objects passed around will be an instance of a class.


# Class Responsibilities

- Feature
    - Storing raw data
    - Manipulating data, when it doesn't need information from other features to do so
        - Normalization, denormalization, clamping, 
    - For chaining, instance methods that modify the instance return the instance when possible.
- ABT
    - Storing data as an array of features
    - Manipulating data when multiple features inform the manipulation 
        - (union, intersection, similar operations)
        - operations that concern *instances* as the fundamental unit
            - partitioning the ABT into datasets
    - Data exploration, preparation for modeling
- Model 
    - Will probably be an abstract class
    - Providing access to some learned representation of some probability distribution over some features in the ABT, perhaps conditioned on other features of the ABT (in the case of *supervised* learning)
        - Querying
        - The model should always output the probability distribution that it is designed to estimate...if some more elaborate output is required, a scoring function can convert the output to that (i.e. if the desired output for the application is actually the mode or mean of the distribution). 
    - There should be an easy way to concatenate and combine models into another object that still behaves as a model.
    - Can implement interfaces (or use abstract classes) to allow for different model types - e.g. those that can backpropagate a derivative through them.
- Learning Algorithm
    - Producing models - in general, any process that gives you the model you want vs any old model
    - Should especially consider what the ideal learning algorithm is like... you simply say, I want something that predicts y from x
    - The learning algorithm hence knows which data the model has been trained on and which it should be tested on
    - Finding optimal models
        - Cross validation
        - Running scoring methods (which should be their own objects)

**Update**

Rethinking a few things...
A model is simply a function from one vector to another.
Many common models are mappings from a vector to a scalar, which we can treat as a vector with a single component.
A model should be agnostic with respect to the normalizations/denormalizations performed before/after it operates.
A normalization is a mapping from a vector to another vector, so it is in some sense a model as well. 
Models should be chainable when they are type safe. For example, a model mapping an n-component vector to a 1-component vector can only be attached to the end of a model that outputs an n-component vector.
We can use type variables to represent model compatibility this way. There should be one type variable indicating input type and one type variable indicating output type.

Even scoring/testing can be viewed in this "everything's a model" paradigm. A scoring function is a mapping from (the output of a model + the target label) to a number. You could get the score off of some model-chaining command like this:
let score = new NearestNeighbors().learnFrom(myABT).pipe(MAE).query(queryInstance)
the query() call is last because the pipe() call returns a new model that can be queried.

could also make model representing a query instance that allow syou to put it at the front of the pipe chain!! Although this doesn't really seem possible
let score = 