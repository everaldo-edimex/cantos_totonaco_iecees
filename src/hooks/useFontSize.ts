import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { FontSize } from "@/types/preferences";

const sizes: FontSize[] = ["small", "medium", "large", "xlarge"];

export function useFontSize() {
  const [stored, setSize] = useLocalStorage<FontSize>("cantos:font-size", "medium");
  const index = sizes.includes(stored) ? sizes.indexOf(stored) : 1;
  return {
    size: sizes[index],
    increase: () => setSize(sizes[Math.min(index + 1, sizes.length - 1)]),
    decrease: () => setSize(sizes[Math.max(index - 1, 0)]),
    canIncrease: index < sizes.length - 1,
    canDecrease: index > 0
  };
}
