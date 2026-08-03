import { Minus, Plus } from "lucide-react";

export function FontSizeControl({ increase, decrease, canIncrease, canDecrease }: { increase: () => void; decrease: () => void; canIncrease: boolean; canDecrease: boolean }) {
  return <div className="font-controls" aria-label="Tamaño de letra"><button onClick={decrease} disabled={!canDecrease} aria-label="Disminuir tamaño de letra"><Minus /></button><span>Aa</span><button onClick={increase} disabled={!canIncrease} aria-label="Aumentar tamaño de letra"><Plus /></button></div>;
}
