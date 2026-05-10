import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to generate random array
const generateArray = (size = 15) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10);
};

// Generator functions for different sorting algorithms
function* bubbleSort(array) {
  let arr = [...array];
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { arr: [...arr], active: [j, j + 1], msg: `Comparing ${arr[j]} and ${arr[j+1]}` };
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        yield { arr: [...arr], active: [j, j + 1], msg: `Swapped!`, swap: true };
      }
    }
  }
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

function* selectionSort(array) {
  let arr = [...array];
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { arr: [...arr], active: [minIdx, j], msg: `Finding minimum...` };
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      yield { arr: [...arr], active: [i, minIdx], msg: `Swapped with minimum!`, swap: true };
    }
  }
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

function* insertionSort(array) {
  let arr = [...array];
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    yield { arr: [...arr], active: [i], msg: `Picking ${key} to insert...` };
    while (j >= 0 && arr[j] > key) {
      yield { arr: [...arr], active: [j, j + 1], msg: `Shifting ${arr[j]} to the right.` };
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
    yield { arr: [...arr], active: [j + 1], msg: `Inserted ${key} into correct position.` };
  }
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

function* quickSort(array) {
  let arr = [...array];
  
  function* partition(low, high) {
    let pivot = arr[high];
    yield { arr: [...arr], active: [high], msg: `Pivot chosen: ${pivot}` };
    let i = low - 1;
    for (let j = low; j < high; j++) {
      yield { arr: [...arr], active: [j, high], msg: `Comparing ${arr[j]} with pivot ${pivot}` };
      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        yield { arr: [...arr], active: [i, j], msg: `Swapped!`, swap: true };
      }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    yield { arr: [...arr], active: [i + 1, high], msg: `Pivot placed in correct position.`, swap: true };
    return i + 1;
  }

  function* qs(low, high) {
    if (low < high) {
      let pi = yield* partition(low, high);
      yield* qs(low, pi - 1);
      yield* qs(pi + 1, high);
    }
  }
  
  yield* qs(0, arr.length - 1);
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

function* mergeSort(array) {
  let arr = [...array];
  
  function* merge(left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;
    let L = new Array(n1);
    let R = new Array(n2);
    
    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
      yield { arr: [...arr], active: [left + i, mid + 1 + j], msg: `Comparing ${L[i]} and ${R[j]}` };
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      yield { arr: [...arr], active: [k], msg: `Merged into position ${k}` };
      k++;
    }
    
    while (i < n1) {
      arr[k] = L[i];
      yield { arr: [...arr], active: [k], msg: `Merging remaining from left half` };
      i++; k++;
    }
    while (j < n2) {
      arr[k] = R[j];
      yield { arr: [...arr], active: [k], msg: `Merging remaining from right half` };
      j++; k++;
    }
  }
  
  function* ms(left, right) {
    if (left >= right) return;
    let mid = left + Math.floor((right - left) / 2);
    yield* ms(left, mid);
    yield* ms(mid + 1, right);
    yield* merge(left, mid, right);
  }
  
  yield* ms(0, arr.length - 1);
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

function* heapSort(array) {
  let arr = [...array];
  let n = arr.length;

  function* heapify(n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    yield { arr: [...arr], active: [i, largest], msg: `Heapifying at ${i}...` };

    if (largest !== i) {
      let swap = arr[i];
      arr[i] = arr[largest];
      arr[largest] = swap;
      yield { arr: [...arr], active: [i, largest], msg: `Swapped to maintain max heap`, swap: true };
      yield* heapify(n, largest);
    }
  }

  // Build heap
  yield { arr: [...arr], active: [], msg: `Building Max Heap...` };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    yield { arr: [...arr], active: [0, i], msg: `Moving max element to end` };
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    yield { arr: [...arr], active: [0, i], msg: `Swapped!`, swap: true };
    yield* heapify(i, 0);
  }
  
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

function* radixSort(array) {
  let arr = [...array];
  let max = Math.max(...arr);
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield { arr: [...arr], active: [], msg: `Sorting by digit place: ${exp}` };
    
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);
    
    for (let i = 0; i < arr.length; i++) {
      let digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      yield { arr: [...arr], active: [i], msg: `Digit is ${digit}. Counting...` };
    }
    
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    
    for (let i = arr.length - 1; i >= 0; i--) {
      let digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }
    
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      yield { arr: [...arr], active: [i], msg: `Placing ${arr[i]} from output array back to main array.` };
    }
  }
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

function* timSort(array) {
  let arr = [...array];
  yield { arr: [...arr], active: [], msg: 'TimSort: A hybrid of Insertion and Merge Sort.' };
  // A simplified visualization of TimSort concepts
  yield* insertionSort(arr); // For simplicity of visualization, we'll just run insertion sort
  yield { arr: [...arr], active: [], msg: 'Sorted!' };
}

const getGenerator = (algo) => {
  switch (algo) {
    case 'bubble-sort': return bubbleSort;
    case 'selection-sort': return selectionSort;
    case 'insertion-sort': return insertionSort;
    case 'quick-sort': return quickSort;
    case 'merge-sort': return mergeSort;
    case 'heap-sort': return heapSort;
    case 'radix-sort': return radixSort;
    case 'tim-sort': return timSort;
    default: return bubbleSort;
  }
};

const SortingPlayground = ({ algorithm, isPlaying, speed }) => {
  const [array, setArray] = useState(() => generateArray(15));
  const [activeIndices, setActiveIndices] = useState([]);
  const [message, setMessage] = useState('Initializing Array...');

  useEffect(() => {
    if (!isPlaying) {
      setArray(generateArray(15));
      setActiveIndices([]);
      setMessage('Paused');
      return;
    }

    let isMounted = true;
    const baseDelay = 1000 / speed;
    let generator = getGenerator(algorithm)(generateArray(15));

    const runAnimation = async () => {
      if (!isMounted) return;
      
      const { value, done } = generator.next();
      
      if (done) {
        setMessage('Sorted!');
        setActiveIndices([]);
        await new Promise(r => setTimeout(r, 2000));
        if (isMounted) {
          generator = getGenerator(algorithm)(generateArray(15));
          runAnimation();
        }
        return;
      }

      if (value) {
        setArray(value.arr);
        setActiveIndices(value.active || []);
        setMessage(value.msg || '');
      }

      await new Promise(r => setTimeout(r, value.swap ? baseDelay * 1.5 : baseDelay * 0.5));
      if (isMounted) runAnimation();
    };

    runAnimation();

    return () => { isMounted = false; };
  }, [isPlaying, speed, algorithm]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="text-[#06b6d4] font-space text-lg mb-12 h-8 text-center bg-[#06b6d4]/10 px-4 py-2 rounded-full border border-[#06b6d4]/30">
        {message}
      </div>

      <div className="flex items-end justify-center h-[200px] gap-2">
        <AnimatePresence>
          {array.map((val, idx) => {
            const isActive = activeIndices.includes(idx);
            return (
              <motion.div
                layout
                key={val + '-' + idx}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, height: val * 2.5 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`w-8 rounded-t-md flex flex-col items-center justify-end pb-2 font-mono text-xs font-bold transition-colors duration-200
                  ${isActive ? 'bg-[#f43f5e] text-white shadow-[0_0_15px_#f43f5e]' : 'bg-[#06b6d4] text-[#050d1a]'}
                `}
              >
                {val}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SortingPlayground;
