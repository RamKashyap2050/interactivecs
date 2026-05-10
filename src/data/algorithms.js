export const algorithms = [
  // --- REGRESSION ---
  {
    id: "linear-regression",
    slug: "linear-regression",
    name: "Linear Regression",
    category: "Regression",
    tagline: "Finding the best fit straight line through data.",
    color: "#f59e0b",
    bigIdea: "Linear Regression is like trying to draw a single straight line that passes as close as possible to all the data points you have. It assumes that there is a linear relationship between the input variables and the output variable.",
    intuition: "Imagine you're trying to predict the price of a house based on its size. You plot the data points and see an upward trend. Linear regression finds the line that best captures this trend, minimizing the overall distance from the points to the line.",
    math: {
      equation: "y = \\beta_0 + \\beta_1 x_1 + \\dots + \\beta_n x_n + \\epsilon",
      costFunction: "J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2",
      complexity: { time: "O(n^2 m)", space: "O(n)" }
    },
    steps: [
      "Initialize weights randomly or to zero.",
      "Calculate predictions based on current weights.",
      "Compute the error (Cost Function) between predictions and actual values.",
      "Update weights using Gradient Descent to minimize the error.",
      "Repeat until convergence (error stops decreasing)."
    ],
    pros: ["Simple to implement and interpret", "Fast to train", "Less prone to overfitting if regularized"],
    cons: ["Assumes linear relationship", "Sensitive to outliers", "Cannot capture complex non-linear patterns"],
    code: `from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X, y)\npredictions = model.predict(X_new)`
  },
  {
    id: "multiple-regression",
    slug: "multiple-regression",
    name: "Multiple Regression",
    category: "Regression",
    tagline: "Linear regression with multiple independent variables.",
    color: "#f59e0b",
    bigIdea: "Instead of fitting a line to a 2D scatter plot, Multiple Regression fits a multidimensional hyperplane. It uses multiple features simultaneously to predict a single continuous outcome.",
    intuition: "Predicting a house price doesn't just depend on size. It also depends on the number of bedrooms, age of the house, and distance to the city center. Multiple regression combines all these factors, weighting each one based on its importance.",
    math: {
      equation: "y = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\dots + \\beta_p x_p + \\epsilon",
      costFunction: "J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2",
      complexity: { time: "O(p^2 m)", space: "O(p)" }
    },
    steps: [
      "Gather a dataset with multiple features (independent variables).",
      "Ensure features are scaled/normalized if using gradient descent.",
      "Calculate the weighted sum of inputs.",
      "Compute the Mean Squared Error against true values.",
      "Update all feature weights simultaneously to minimize error."
    ],
    pros: ["Accounts for multiple confounding factors", "Provides feature importance via coefficients"],
    cons: ["Prone to multicollinearity (correlated features)", "Assumes linear relationships across all dimensions"],
    code: `from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X_multi, y)\npredictions = model.predict(X_multi_new)`
  },
  {
    id: "ridge-regression",
    slug: "ridge-regression",
    name: "Ridge Regression",
    category: "Regression",
    tagline: "Linear regression with L2 regularization to prevent overfitting.",
    color: "#f59e0b",
    bigIdea: "Ridge Regression adds a penalty term to the linear regression cost function. This penalty shrinks the coefficients of the model towards zero, reducing model complexity and variance.",
    intuition: "Imagine linear regression is trying too hard to pass through every single noisy data point (overfitting). Ridge regression pulls the line back, making it slightly less 'perfect' on the training data, but much more stable and reliable for new data.",
    math: {
      equation: "y = X\\beta + \\epsilon",
      costFunction: "J(\\theta) = \\text{MSE} + \\lambda \\sum_{j=1}^{p} \\beta_j^2",
      complexity: { time: "O(p^3 + p^2 m)", space: "O(p^2)" }
    },
    steps: [
      "Standardize features (critical for regularization to be fair).",
      "Choose a regularization strength hyperparameter (\\lambda or alpha).",
      "Compute predictions and add the sum of squared weights to the cost.",
      "Update weights, causing them to shrink asymptotically towards zero."
    ],
    pros: ["Prevents overfitting", "Handles multicollinearity well", "Improves model generalization"],
    cons: ["Does not perform feature selection (coefficients never reach exactly zero)", "Requires tuning the penalty term"],
    code: `from sklearn.linear_model import Ridge\n\n# alpha is the regularization strength\nmodel = Ridge(alpha=1.0)\nmodel.fit(X, y)\npredictions = model.predict(X_new)`
  },
  {
    id: "lasso-regression",
    slug: "lasso-regression",
    name: "Lasso Regression",
    category: "Regression",
    tagline: "Linear regression with L1 regularization for feature selection.",
    color: "#f59e0b",
    bigIdea: "Lasso (Least Absolute Shrinkage and Selection Operator) adds an absolute value penalty. Unlike Ridge, Lasso can shrink coefficients all the way to absolute zero, effectively performing automatic feature selection.",
    intuition: "If you have 100 features but only 10 are actually useful, Ridge will give you 100 small weights. Lasso will give you 10 meaningful weights and force the other 90 to be exactly zero, throwing away the useless data.",
    math: {
      equation: "y = X\\beta + \\epsilon",
      costFunction: "J(\\theta) = \\text{MSE} + \\lambda \\sum_{j=1}^{p} |\\beta_j|",
      complexity: { time: "O(p^3 + p^2 m)", space: "O(p)" }
    },
    steps: [
      "Standardize features.",
      "Choose the L1 regularization penalty hyperparameter.",
      "Optimize the cost function (often using coordinate descent, as L1 is not differentiable at 0).",
      "Observe that less important feature coefficients become exactly 0."
    ],
    pros: ["Performs automatic feature selection", "Creates simpler, more interpretable models"],
    cons: ["Can arbitrarily select one feature among highly correlated ones", "May perform worse than Ridge if all features are actually relevant"],
    code: `from sklearn.linear_model import Lasso\n\nmodel = Lasso(alpha=0.1)\nmodel.fit(X, y)\n# Many model.coef_ values will be 0.0\npredictions = model.predict(X_new)`
  },

  // --- CLASSIFICATION ---
  {
    id: "logistic-regression",
    slug: "logistic-regression",
    name: "Logistic Regression",
    category: "Classification",
    tagline: "Predicting probability of a binary outcome.",
    color: "#8b5cf6",
    bigIdea: "Despite its name, Logistic Regression is a classification algorithm. It takes any real-valued input and squashes it into a value between 0 and 1 using a sigmoid curve, which can be interpreted as a probability.",
    intuition: "Think of it as trying to decide if an email is spam (1) or not spam (0). Linear regression might give you a value like 1.5 or -0.2. Logistic regression ensures the output is strictly between 0 and 1.",
    math: {
      equation: "P(y=1|X) = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1X)}}",
      costFunction: "J(\\theta) = -\\frac{1}{m} \\sum [y^{(i)} \\log(h_\\theta(x^{(i)})) + (1-y^{(i)}) \\log(1 - h_\\theta(x^{(i)}))]",
      complexity: { time: "O(kn)", space: "O(n)" }
    },
    steps: [
      "Calculate linear combination of inputs and weights.",
      "Apply sigmoid activation function to squash output.",
      "Calculate binary cross-entropy loss.",
      "Update weights using gradient descent."
    ],
    pros: ["Outputs calibrated probabilities", "Efficient and fast", "Linearly separable features work well"],
    cons: ["Cannot handle complex relationships easily", "Requires little or no multicollinearity"],
    code: `from sklearn.linear_model import LogisticRegression\n\nmodel = LogisticRegression()\nmodel.fit(X, y)\nprobs = model.predict_proba(X_new)`
  },
  {
    id: "cart",
    slug: "cart",
    name: "CART",
    category: "Classification",
    tagline: "Classification and Regression Trees using Gini Impurity.",
    color: "#8b5cf6",
    bigIdea: "CART builds a binary tree by splitting data into two branches at every node. It searches for the feature and threshold that results in the purest possible child nodes.",
    intuition: "It's like playing '20 Questions' with your data. The algorithm asks binary questions ('Is age > 30?') that best divide the remaining data into distinct classes.",
    math: {
      equation: "\\text{Gini}(D) = 1 - \\sum_{i=1}^{C} p_i^2",
      costFunction: "J(k, t_k) = \\frac{m_{\\text{left}}}{m} G_{\\text{left}} + \\frac{m_{\\text{right}}}{m} G_{\\text{right}}",
      complexity: { time: "O(n \\log n \\cdot d)", space: "O(\\text{depth})" }
    },
    steps: [
      "Start at the root node with the entire dataset.",
      "Calculate the Gini Impurity of the current data.",
      "Iterate over every feature and every possible split threshold.",
      "Choose the split that minimizes the weighted Gini Impurity of the two resulting branches.",
      "Recursively repeat for child nodes until a stopping criterion (e.g., max depth) is met."
    ],
    pros: ["Highly interpretable", "Handles both numerical and categorical data", "Requires little data preparation"],
    cons: ["Prone to severe overfitting if not pruned", "Unstable (small data changes cause large tree changes)"],
    code: `from sklearn.tree import DecisionTreeClassifier\n\n# CART is the default implementation in sklearn\nmodel = DecisionTreeClassifier(criterion='gini')\nmodel.fit(X, y)\npredictions = model.predict(X_new)`
  },
  {
    id: "id3",
    slug: "id3",
    name: "ID3",
    category: "Classification",
    tagline: "Iterative Dichotomiser 3 using Entropy and Information Gain.",
    color: "#8b5cf6",
    bigIdea: "ID3 builds a multi-way decision tree. Instead of Gini Impurity, it uses Shannon Entropy to measure disorder, splitting on the feature that provides the highest Information Gain.",
    intuition: "If a dataset is perfectly split between classes, its entropy is high (chaotic). ID3 finds the feature that, when split upon, reduces this chaos the most, bringing order to the child nodes.",
    math: {
      equation: "\\text{Entropy}(S) = -\\sum_{i=1}^{c} p_i \\log_2(p_i)",
      costFunction: "\\text{Gain}(S, A) = \\text{Entropy}(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} \\text{Entropy}(S_v)",
      complexity: { time: "O(n \\cdot d)", space: "O(\\text{nodes})" }
    },
    steps: [
      "Calculate the entropy of the current dataset.",
      "For each categorical feature, calculate the entropy of all its slices.",
      "Calculate the Information Gain for each feature.",
      "Pick the feature with the highest Information Gain to split the node.",
      "Repeat recursively."
    ],
    pros: ["Creates short, efficient trees", "Very intuitive logic based on information theory"],
    cons: ["Only works with categorical features natively", "Biased towards features with many distinct values"],
    code: `# ID3 is historically significant but usually superseded by C4.5/CART.\n# Can be approximated in sklearn by grouping data.\nfrom sklearn.tree import DecisionTreeClassifier\nmodel = DecisionTreeClassifier(criterion='entropy')`
  },
  {
    id: "c45",
    slug: "c45",
    name: "C4.5",
    category: "Classification",
    tagline: "The successor to ID3, handling continuous data and missing values.",
    color: "#8b5cf6",
    bigIdea: "C4.5 improves upon ID3 by using 'Gain Ratio' instead of Information Gain (fixing the bias toward high-cardinality features), handling continuous numerical variables, and allowing for missing data.",
    intuition: "When C4.5 encounters a continuous feature like 'Salary', it dynamically finds the best cut-off point (e.g., >$50k) to turn it into a binary split, while still using entropy logic.",
    math: {
      equation: "\\text{GainRatio}(S, A) = \\frac{\\text{Gain}(S, A)}{\\text{SplitInformation}(S, A)}",
      costFunction: "\\text{SplitInfo}(S, A) = -\\sum \\frac{|S_v|}{|S|} \\log_2 \\frac{|S_v|}{|S|}",
      complexity: { time: "O(n \\log n \\cdot d)", space: "O(\\text{nodes})" }
    },
    steps: [
      "Calculate Entropy.",
      "For continuous variables, sort values and evaluate every adjacent midpoint as a potential split.",
      "Calculate Information Gain and then Gain Ratio.",
      "Split on the highest Gain Ratio.",
      "Prune the tree post-creation to reduce overfitting."
    ],
    pros: ["Handles continuous and categorical data", "Handles missing values implicitly", "Built-in pruning"],
    cons: ["Slower than CART due to log calculations and sorting", "Can build overly complex trees"],
    code: `# scikit-learn uses an optimized version of CART which can behave like C4.5\nfrom sklearn.tree import DecisionTreeClassifier\nmodel = DecisionTreeClassifier(criterion='entropy')`
  },
  {
    id: "chaid",
    slug: "chaid",
    name: "CHAID",
    category: "Classification",
    tagline: "Chi-square Automatic Interaction Detection.",
    color: "#8b5cf6",
    bigIdea: "CHAID builds decision trees using statistical significance. It uses Chi-square tests to determine if splitting a node produces a statistically significant difference between the child nodes.",
    intuition: "Instead of just looking for the 'purest' split, CHAID acts like a statistician. It asks: 'Is the difference between these two groups actually statistically significant, or just random noise?' If it's noise, it stops growing.",
    math: {
      equation: "\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}",
      costFunction: "\\text{p-value of } \\chi^2 \\text{ test vs Bonferroni adjusted threshold}",
      complexity: { time: "O(n \\cdot c \\cdot d)", space: "O(\\text{nodes})" }
    },
    steps: [
      "Cross-tabulate the target variable with each predictor.",
      "Merge categories of predictors that are not statistically significantly different from each other.",
      "Calculate the Chi-square p-value for the merged predictors.",
      "Split the node using the predictor with the lowest p-value (most significant).",
      "Stop when no predictor reaches the significance threshold."
    ],
    pros: ["Naturally creates multi-way splits (not just binary)", "Prevents overfitting via statistical stopping rules (no pruning needed)"],
    cons: ["Requires large sample sizes for valid Chi-square tests", "Continuous variables must be binned into categories first"],
    code: `# CHAID is not in standard sklearn.\n# Usually implemented via third-party libraries like 'CHAID'.\nfrom CHAID import Tree\ntree = Tree.from_pandas_df(df, dict(zip(features, types)), target)`
  },

  // --- ENSEMBLE ---
  {
    id: "random-forest",
    slug: "random-forest",
    name: "Random Forest",
    category: "Ensemble",
    tagline: "Wisdom of the crowds using many decision trees.",
    color: "#06b6d4",
    bigIdea: "A Random Forest trains hundreds of independent decision trees in parallel. Each tree gets a random subset of data and a random subset of features. Their predictions are averaged out.",
    intuition: "Instead of asking one expert, you ask a whole room of experts. Because each expert trained on slightly different data, their combined vote is incredibly robust and resistant to noise.",
    math: {
      equation: "\\hat{y} = \\frac{1}{B} \\sum_{b=1}^{B} f_b(x)",
      costFunction: "Average of individual tree impurities",
      complexity: { time: "O(B \\cdot n \\log n \\cdot d)", space: "O(B \\cdot \\text{nodes})" }
    },
    steps: [
      "Draw a bootstrap sample (with replacement) from the training data.",
      "Grow a decision tree. At each node, select a random subset of features.",
      "Do not prune the tree (let it overfit its specific data).",
      "Repeat B times to create a forest.",
      "Aggregate: Majority vote for classification, mean for regression."
    ],
    pros: ["Highly accurate and robust", "Resistant to overfitting", "Provides feature importance"],
    cons: ["Can be slow to predict", "Consumes significant memory", "Black-box model"],
    code: `from sklearn.ensemble import RandomForestClassifier\n\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X, y)\npredictions = model.predict(X_new)`
  },
  {
    id: "bagging",
    slug: "bagging",
    name: "Bagging",
    category: "Ensemble",
    tagline: "Bootstrap Aggregating generic base estimators.",
    color: "#06b6d4",
    bigIdea: "Bagging is the generalized concept behind Random Forests. It takes any base model (like an SVM or a Tree), trains multiple versions of it on random data subsets, and averages them.",
    intuition: "If a model is highly sensitive to the exact training data (high variance), training it on 100 different slight variations of the data and averaging the results will cancel out the variance.",
    math: {
      equation: "f_{\\text{bag}}(x) = \\frac{1}{B} \\sum_{b=1}^{B} f^{*b}(x)",
      costFunction: "Depends on base estimator",
      complexity: { time: "O(B \\cdot \\text{Time}(f))", space: "O(B \\cdot \\text{Space}(f))" }
    },
    steps: [
      "Create B bootstrap samples from the original dataset.",
      "Train a base estimator entirely independently on each sample.",
      "Aggregate the outputs (soft voting, hard voting, or averaging)."
    ],
    pros: ["Reduces variance significantly", "Can wrap around any arbitrary model", "Highly parallelizable"],
    cons: ["Does not reduce bias (bad for underfitting models)", "Loses interpretability of the base model"],
    code: `from sklearn.ensemble import BaggingClassifier\nfrom sklearn.svm import SVC\n\nmodel = BaggingClassifier(estimator=SVC(), n_estimators=10)\nmodel.fit(X, y)`
  },
  {
    id: "gbm",
    slug: "gbm",
    name: "Gradient Boosting",
    category: "Ensemble",
    tagline: "Sequential correction of errors.",
    color: "#06b6d4",
    bigIdea: "Unlike Random Forests which build trees in parallel, GBM builds small, weak trees sequentially. Every new tree focuses exclusively on correcting the errors (residuals) made by the combination of all previous trees.",
    intuition: "Think of playing golf. Your first shot gets you close to the hole. Your second shot corrects the remaining distance. Your third corrects the final inches. GBM adds up sequential 'shots' to reach the exact target.",
    math: {
      equation: "F_m(x) = F_{m-1}(x) + \\nu \\cdot h_m(x)",
      costFunction: "L(y, F(x)) = \\frac{1}{2}(y - F(x))^2 \\implies \\text{Residuals} = y - F(x)",
      complexity: { time: "O(M \\cdot n \\log n \\cdot d)", space: "O(M \\cdot \\text{nodes})" }
    },
    steps: [
      "Initialize model with a constant value (e.g., the mean of y).",
      "Calculate the negative gradient (residuals) of the loss function.",
      "Fit a small regression tree to the residuals.",
      "Update the model by adding the new tree, scaled by a learning rate.",
      "Repeat M times."
    ],
    pros: ["Often achieves state-of-the-art accuracy", "Handles mixed data types well"],
    cons: ["Sequential nature means it cannot be easily parallelized", "Prone to overfitting if learning rate/depth is too high"],
    code: `from sklearn.ensemble import GradientBoostingClassifier\n\nmodel = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1)\nmodel.fit(X, y)`
  },
  {
    id: "xgboost",
    slug: "xgboost",
    name: "XGBoost",
    category: "Ensemble",
    tagline: "eXtreme Gradient Boosting on steroids.",
    color: "#06b6d4",
    bigIdea: "XGBoost is an optimized, highly-engineered mathematical implementation of Gradient Boosting. It introduces L1/L2 regularization to the trees, exact second-order gradients (Hessians), and extreme hardware optimization.",
    intuition: "If GBM is a standard race car, XGBoost is a Formula 1 car. It uses advanced math (Taylor expansion approximations) and computer science tricks (cache-aware memory access) to do the exact same job, but faster and better.",
    math: {
      equation: "Obj(\\theta) = \\sum L(y_i, \\hat{y}_i) + \\sum \\Omega(f_k)",
      costFunction: "\\Omega(f) = \\gamma T + \\frac{1}{2} \\lambda \\sum w_j^2 \\text{ (Regularization term)}",
      complexity: { time: "O(M \\cdot ||X||_0 \\log n)", space: "O(n + d)" }
    },
    steps: [
      "Calculate first and second order gradients of the loss function.",
      "Build trees using a highly optimized histogram-based or exact greedy algorithm.",
      "Apply L1 and L2 regularization directly to the leaf weights.",
      "Prune trees backwards based on the regularized objective."
    ],
    pros: ["Incredibly fast execution", "Built-in handling of missing values", "Dominates tabular data competitions"],
    cons: ["Many hyperparameters to tune", "Can consume significant RAM during training"],
    code: `import xgboost as xgb\n\nmodel = xgb.XGBClassifier(n_estimators=100, max_depth=3, learning_rate=0.1)\nmodel.fit(X, y)\npredictions = model.predict(X_new)`
  },
  {
    id: "catboost",
    slug: "catboost",
    name: "CatBoost",
    category: "Ensemble",
    tagline: "Gradient boosting built for categorical data.",
    color: "#06b6d4",
    bigIdea: "CatBoost (Categorical Boosting) uses ordered boosting and an innovative algorithm for processing categorical features without requiring manual one-hot encoding or target encoding.",
    intuition: "Usually, text categories like 'City=London' break machine learning models unless heavily preprocessed. CatBoost natively understands these categories and processes them on the fly, saving time and preventing data leakage.",
    math: {
      equation: "\\hat{x}_k^i = \\frac{\\sum_{j=1}^{p-1} [x_k^j = x_k^i] Y_j + a \\cdot P}{\\sum_{j=1}^{p-1} [x_k^j = x_k^i] + a}",
      costFunction: "Ordered Target Statistics (Prevents Target Leakage)",
      complexity: { time: "O(M \\cdot n \\cdot d)", space: "O(n + d)" }
    },
    steps: [
      "Perform a random permutation of the dataset.",
      "Calculate target statistics for categorical features using only historical data in the permutation.",
      "Build symmetric (oblivious) trees, meaning the same split criterion is used across the entire level.",
      "Use ordered boosting to prevent target leakage."
    ],
    pros: ["Zero categorical preprocessing required", "Very fast prediction times due to symmetric trees", "Highly resistant to overfitting"],
    cons: ["Training can be slower than LightGBM", "Symmetric tree structure can sometimes restrict expressiveness"],
    code: `from catboost import CatBoostClassifier\n\n# Automatically handles categorical indices\nmodel = CatBoostClassifier(iterations=100, cat_features=[0, 2, 5])\nmodel.fit(X, y)`
  },
  {
    id: "lightgbm",
    slug: "lightgbm",
    name: "LightGBM",
    category: "Ensemble",
    tagline: "Lightweight, highly scalable gradient boosting.",
    color: "#06b6d4",
    bigIdea: "LightGBM modifies the tree growing strategy. Instead of growing trees level-by-level (depth-wise), it grows trees leaf-by-leaf (leaf-wise), choosing the node with the maximum delta loss to split.",
    intuition: "If you have a limited number of branches you can add to a tree, you shouldn't waste them balancing the tree perfectly. You should add branches exactly where they reduce the error the most, resulting in an asymmetrical but highly optimized tree.",
    math: {
      equation: "\\text{GOSS (Gradient-based One-Side Sampling)}",
      costFunction: "EFB (Exclusive Feature Bundling) for sparsity",
      complexity: { time: "O(M \\cdot n \\cdot \\text{num\\_bins})", space: "O(\\text{num\\_bins} \\cdot d)" }
    },
    steps: [
      "Bundle mutually exclusive features together to reduce dimensionality (EFB).",
      "Keep instances with large gradients; randomly drop instances with small gradients (GOSS).",
      "Grow the tree leaf-wise, aggressively minimizing loss.",
      "Stop based on max_leaves rather than max_depth."
    ],
    pros: ["Extremely fast training times", "Low memory usage via histogram binning", "Handles massive datasets easily"],
    cons: ["Leaf-wise growth makes it very prone to overfitting on small datasets", "Requires careful max_leaves tuning"],
    code: `import lightgbm as lgb\n\nmodel = lgb.LGBMClassifier(n_estimators=100, num_leaves=31)\nmodel.fit(X, y)\npredictions = model.predict(X_new)`
  },
  {
    id: "stacking",
    slug: "stacking",
    name: "Stacking",
    category: "Ensemble",
    tagline: "Training a model to combine other models.",
    color: "#06b6d4",
    bigIdea: "Stacking involves training multiple different base models (Layer 1), then using their predictions as input features to train a final meta-model (Layer 2) which outputs the final prediction.",
    intuition: "You consult a doctor, an engineer, and a lawyer about a problem. They all give different answers based on their expertise. You are the meta-model: you learn which expert to trust for which specific types of problems.",
    math: {
      equation: "Y_{\\text{final}} = f_{\\text{meta}}(f_1(x), f_2(x), \\dots, f_k(x))",
      costFunction: "Meta-model loss (often Logistic Regression or Ridge)",
      complexity: { time: "O(\\sum \\text{Time}(f_i) + \\text{Time}(f_{\\text{meta}}))", space: "O(\\text{Models})" }
    },
    steps: [
      "Split the training data using K-Fold cross-validation.",
      "Train base models (e.g., SVM, Random Forest, KNN) on the folds.",
      "Generate out-of-fold predictions for the entire training set.",
      "Train the meta-model using the out-of-fold predictions as input features.",
      "For test data, run through base models, then feed to meta-model."
    ],
    pros: ["Can squeeze out maximum possible performance", "Leverages the unique strengths of entirely different algorithms"],
    cons: ["Extremely computationally expensive", "Prone to data leakage if cross-validation isn't perfect", "Hard to deploy to production"],
    code: `from sklearn.ensemble import StackingClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.svm import SVC\n\nestimators = [('rf', RandomForestClassifier()), ('svr', SVC())]\nmodel = StackingClassifier(estimators=estimators, final_estimator=LogisticRegression())\nmodel.fit(X, y)`
  },

  // --- UNSUPERVISED ---
  {
    id: "k-means",
    slug: "k-means",
    name: "K-Means++",
    category: "Unsupervised",
    tagline: "Finding hidden groups in unlabeled data.",
    color: "#10b981",
    bigIdea: "K-Means tries to find 'k' centers within your data. Each data point is assigned to the nearest center, forming a cluster. The centers then move to the middle of their respective clusters, and the process repeats until stable.",
    intuition: "Imagine you're trying to open 3 pizzerias to serve customers quickly. You randomly pick 3 spots, see which customers are closest to each, then move the pizzerias to the exact center of their customer bases. Repeat until stable.",
    math: {
      equation: "J = \\sum_{j=1}^{k} \\sum_{i=1}^{n} ||x_i^{(j)} - c_j||^2",
      costFunction: "Inertia (Within-Cluster Sum of Squares)",
      complexity: { time: "O(t \\cdot k \\cdot n \\cdot d)", space: "O(k \\cdot d)" }
    },
    steps: [
      "Initialize 'k' centroids smartly using probability distribution (K-Means++).",
      "Assign each data point to the closest centroid.",
      "Recalculate the position of each centroid as the mean of its assigned points.",
      "Repeat assignment and recalculation until centroids stop moving."
    ],
    pros: ["Easy to implement and understand", "Scales to large data sets natively", "Guarantees convergence"],
    cons: ["Need to choose 'k' manually", "Struggles with non-spherical clusters", "Sensitive to outliers"],
    code: `from sklearn.cluster import KMeans\n\nmodel = KMeans(n_clusters=3, init='k-means++')\nmodel.fit(X)\nlabels = model.labels_`
  },
  {
    id: "dbscan",
    slug: "dbscan",
    name: "DBSCAN",
    category: "Unsupervised",
    tagline: "Density-Based Spatial Clustering of Applications with Noise.",
    color: "#10b981",
    bigIdea: "DBSCAN defines clusters as continuous regions of high density. It grows clusters outward from core points and automatically labels sparse, isolated points as noise/outliers.",
    intuition: "Imagine looking at a satellite map of cities at night. DBSCAN groups the bright, densely packed light pixels into distinct cities. Any random dim light in the middle of nowhere is ignored as noise.",
    math: {
      equation: "N_{\\epsilon}(p) = \\{q \\in D | \\text{dist}(p, q) \\le \\epsilon\\}",
      costFunction: "\\text{Density reachability constraint logic}",
      complexity: { time: "O(n \\log n) \\text{ with spatial index}", space: "O(n)" }
    },
    steps: [
      "Pick an arbitrary unvisited point.",
      "Retrieve its neighborhood within radius \\epsilon.",
      "If neighborhood size >= MinPts, start a new cluster.",
      "Recursively expand the cluster by evaluating the neighborhoods of all points within it.",
      "If neighborhood < MinPts, mark as noise."
    ],
    pros: ["Does not require specifying the number of clusters 'k'", "Finds clusters of arbitrary shapes", "Robust to outliers"],
    cons: ["Struggles with clusters of varying densities", "Highly sensitive to the \\epsilon and MinPts hyperparameters"],
    code: `from sklearn.cluster import DBSCAN\n\nmodel = DBSCAN(eps=0.5, min_samples=5)\nmodel.fit(X)\n# Noise points receive a label of -1\nlabels = model.labels_`
  },
  {
    id: "hierarchical",
    slug: "hierarchical",
    name: "Hierarchical Clustering",
    category: "Unsupervised",
    tagline: "Building a tree of clusters (Dendrogram) bottom-up.",
    color: "#10b981",
    bigIdea: "Agglomerative Hierarchical Clustering treats every single data point as its own cluster. It then iteratively merges the two closest clusters together until only one giant cluster remains, creating a tree.",
    intuition: "Think of an evolutionary tree (phylogeny). You start with individual species, group them into genera, then families, then orders, until everything traces back to a single common root.",
    math: {
      equation: "D(C_i, C_j) = \\min_{x \\in C_i, y \\in C_j} ||x - y|| \\text{ (Single Linkage)}",
      costFunction: "Ward's method: Minimize variance within merged clusters",
      complexity: { time: "O(n^3) \\text{ standard, } O(n^2) \\text{ optimized}", space: "O(n^2)" }
    },
    steps: [
      "Compute the distance matrix between all points.",
      "Treat each data point as a single cluster.",
      "Find the two closest clusters based on a linkage criterion (Ward, Single, Complete).",
      "Merge them into a new cluster and update the distance matrix.",
      "Repeat until all points are in a single cluster, then slice the tree to get 'k' clusters."
    ],
    pros: ["Outputs a visual dendrogram, allowing flexible choice of 'k' later", "Does not require specifying 'k' initially"],
    cons: ["Very computationally expensive (O(N^2) memory)", "Once a merge is done, it cannot be undone (greedy approach)"],
    code: `from sklearn.cluster import AgglomerativeClustering\n\n# Ward linkage minimizes within-cluster variance\nmodel = AgglomerativeClustering(n_clusters=3, linkage='ward')\nmodel.fit(X)\nlabels = model.labels_`
  }
];

export const categories = [
  { id: "all", name: "All Algorithms", color: "#f3f4f6" },
  { id: "Regression", name: "Regression", color: "#f59e0b" },
  { id: "Classification", name: "Classification", color: "#8b5cf6" },
  { id: "Ensemble", name: "Ensemble Methods", color: "#06b6d4" },
  { id: "Unsupervised", name: "Unsupervised Learning", color: "#10b981" }
];
