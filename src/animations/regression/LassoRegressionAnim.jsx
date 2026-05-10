import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathBlock from '../../components/MathBlock';

const generateData = () => {
  const points = [];
  // True function: y = 2x + noise.
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() * 2) - 1; // -1 to 1
    const noise = (Math.random() - 0.5) * 0.5;
    const y = 2 * x + noise;
    points.push({ x, y });
  }
  return points.sort((a, b) => a.x - b.x);
};

const data = generateData();

const X_raw = data.map(p => [p.x, Math.pow(p.x, 2), Math.pow(p.x, 3), Math.pow(p.x, 4), Math.pow(p.x, 5)]);
const y_arr = data.map(p => p.y);

const means = [0, 0, 0, 0, 0];
const stds = [1, 1, 1, 1, 1];
for (let j = 0; j < 5; j++) {
  let sum = 0;
  for (let i = 0; i < 15; i++) sum += X_raw[i][j];
  means[j] = sum / 15;
  let varSum = 0;
  for (let i = 0; i < 15; i++) varSum += Math.pow(X_raw[i][j] - means[j], 2);
  stds[j] = Math.sqrt(varSum / 15) || 1;
}

const X = X_raw.map(row => row.map((val, j) => (val - means[j]) / stds[j]));

// Soft Thresholding operator for Lasso
const softThreshold = (rho, lambda) => {
  if (rho < -lambda) return rho + lambda;
  if (rho > lambda) return rho - lambda;
  return 0;
};

const LassoRegressionAnim = ({ isPlaying, speed, onComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = useMemo(() => {
    const history = [];
    const lambdaValues = [];
    for (let l = 0; l <= 50; l += 1) {
      lambdaValues.push(l * l * 0.1); 
    }

    for (let s = 0; s < lambdaValues.length; s++) {
      const lambda = lambdaValues[s];
      let w = [0, 0, 0, 0, 0];
      let b = 0;
      
      for (let epoch = 0; epoch < 100; epoch++) {
        let b_sum = 0;
        for (let i = 0; i < 15; i++) {
          let pred = 0;
          for (let j = 0; j < 5; j++) pred += w[j] * X[i][j];
          b_sum += (y_arr[i] - pred);
        }
        b = b_sum / 15;

        for (let j = 0; j < 5; j++) {
          let rho = 0;
          let z = 0;
          for (let i = 0; i < 15; i++) {
            let pred_without_j = b;
            for (let k = 0; k < 5; k++) {
              if (k !== j) pred_without_j += w[k] * X[i][k];
            }
            rho += X[i][j] * (y_arr[i] - pred_without_j);
            z += X[i][j] * X[i][j];
          }
          // Lasso update (Soft thresholding)
          w[j] = softThreshold(rho, lambda) / z;
        }
      }

      history.push({ step: s, lambda, w: [...w], b });
    }
    return history;
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStepIdx < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 2) {
            clearInterval(interval);
            if (onComplete) onComplete();
            return steps.length - 1;
          }
          return prev + 1;
        });
      }, 200 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentStepIdx, steps.length, onComplete]);

  const currentStep = steps[currentStepIdx];

  const mapTopX = (x) => ((x + 1.2) / 2.4) * 100;
  const mapTopY = (y) => ((3 - y) / 6) * 100;

  const createCurvePath = (w, b) => {
    let d = "";
    for (let px = -1.2; px <= 1.2; px += 0.05) {
      const norm_x = [];
      for (let j = 0; j < 5; j++) norm_x.push((Math.pow(px, j + 1) - means[j]) / stds[j]);
      let y = b;
      for (let j = 0; j < 5; j++) y += w[j] * norm_x[j];
      const svgX = mapTopX(px);
      const svgY = mapTopY(y);
      if (px === -1.2) d += `M ${svgX} ${svgY}`;
      else d += ` L ${svgX} ${svgY}`;
    }
    return d;
  };

  const curvePath = createCurvePath(currentStep.w, currentStep.b);

  const mapBarHeight = (val) => (Math.abs(val) / 4) * 80;
  const mapBarY = (val) => val >= 0 ? 150 - mapBarHeight(val) : 150;

  return (
    <div className="w-full h-[600px] relative p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative bg-[#020611] rounded-xl border border-gray-800 overflow-hidden shadow-inner shadow-black/50">
        <svg viewBox="0 0 100 220" className="w-full h-full drop-shadow-md" preserveAspectRatio="none">
          
          {/* TOP CHART */}
          <rect x="0" y="0" width="100" height="110" fill="#050d1a" />
          <line x1="0" y1={mapTopY(0)} x2="100" y2={mapTopY(0)} stroke="#374151" strokeWidth="0.5" strokeDasharray="1 1" />
          <text x="2" y="10" fill="#6b7280" fontSize="4" fontFamily="monospace">Polynomial Fit (Degree 5)</text>

          <motion.path
            d={curvePath}
            fill="none"
            stroke="var(--color-cat-regression)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={false}
            animate={{ d: curvePath }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />

          {data.map((p, i) => (
            <circle key={`pt-${i}`} cx={mapTopX(p.x)} cy={mapTopY(p.y)} r="1.5" fill="#e5e7eb" opacity="0.8" />
          ))}

          {/* BOTTOM CHART */}
          <rect x="0" y="110" width="100" height="110" fill="#000" opacity="0.3" />
          <line x1="0" y1="150" x2="100" y2="150" stroke="#374151" strokeWidth="0.5" />
          <text x="2" y="120" fill="#6b7280" fontSize="4" fontFamily="monospace">Coefficients magnitude (w1 to w5)</text>

          {currentStep.w.map((w_val, i) => {
            const barWidth = 10;
            const spacing = 15;
            const startX = 15;
            const isZero = Math.abs(w_val) < 0.001;
            return (
              <g key={`bar-${i}`}>
                <motion.rect
                  x={startX + i * spacing}
                  y={mapBarY(w_val)}
                  width={barWidth}
                  height={mapBarHeight(w_val)}
                  fill={isZero ? "#374151" : (w_val >= 0 ? "var(--color-cat-regression)" : "#ef4444")}
                  opacity="0.8"
                  initial={false}
                  animate={{ y: mapBarY(w_val), height: mapBarHeight(w_val) }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
                {isZero && (
                  <motion.text
                    x={startX + i * spacing - 1} y="145" fill="#ef4444" fontSize="4" fontFamily="monospace"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    ZERO
                  </motion.text>
                )}
                <text x={startX + i * spacing + 2} y="195" fill={isZero ? "#ef4444" : "#9ca3af"} fontSize="4" fontFamily="monospace">w{i+1}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="w-full md:w-64 bg-[#050d1a] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-space text-[var(--color-cat-regression)] mb-2 uppercase tracking-wide">Lambda $\lambda$: {currentStep.lambda.toFixed(1)}</h3>
          <p className="text-xs text-gray-400 font-source mb-6">
            Unlike Ridge, Lasso uses an L1 penalty. Watch the bar chart closely: coefficients don't just shrink, they snap to exactly ZERO, removing useless features!
          </p>

          <div className="space-y-6">
            <div className={`p-3 rounded-lg border transition-all duration-500 ${isPlaying ? 'bg-[var(--color-cat-regression)]/10 border-[var(--color-cat-regression)]/50' : 'bg-transparent border-gray-800'}`}>
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">Lasso Cost Function</div>
              <div className="text-[var(--color-cat-regression)] text-sm">
                <MathBlock math={`J = \\text{MSE} + \\lambda \\sum |\\beta_i|`} block={false} />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-800 bg-transparent">
              <div className="text-[10px] text-gray-500 font-space mb-1 uppercase">L1 Feature Selection</div>
              <p className="text-xs text-gray-400">
                Because of the absolute value penalty, the optimization process uses soft-thresholding. This forces less important coefficients (like $x^4$ or $x^5$) to become identically zero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LassoRegressionAnim;
