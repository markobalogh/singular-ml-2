# singular-ml-2

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