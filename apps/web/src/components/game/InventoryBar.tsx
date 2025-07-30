import { useEffect } from "react";
import defaultDirt from "@/assets/default_dirt.png";
import defaultGrass from "@/assets/default_grass.png";
import defaultStone from "@/assets/default_stone.png";
import { BlockType } from "@/lib/blocks";
import { cn } from "@/lib/utils";
import { useInventoryStore } from "@/zustand/inventory";

const blockImages: Record<BlockType, string> = {
  [BlockType.AIR]: "",
  [BlockType.GRASS]: defaultGrass,
  [BlockType.DIRT]: defaultDirt,
  [BlockType.STONE]: defaultStone,
};

const blockNames: Record<BlockType, string> = {
  [BlockType.AIR]: "Air",
  [BlockType.GRASS]: "Grass",
  [BlockType.DIRT]: "Dirt",
  [BlockType.STONE]: "Stone",
};

export default function InventoryBar() {
  const items = useInventoryStore((state) => state.items);
  const selectedSlot = useInventoryStore((state) => state.selectedSlot);
  const setSelectedSlot = useInventoryStore((state) => state.setSelectedSlot);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = Number.parseInt(e.key);
      if (!Number.isNaN(key) && key >= 1 && key <= items.length) {
        setSelectedSlot(key - 1);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [items.length, setSelectedSlot]);

  return (
    <div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 flex bg-gray-700/80 backdrop-blur-sm">
      {items.map((item, index) => (
        <button
          key={item.blockType}
          type="button"
          className={cn(
            "relative h-16 w-16 cursor-pointer border-4 border-gray-500 p-3 transition-all hover:scale-105",
            selectedSlot === index && "border-white",
          )}
          onClick={() => setSelectedSlot(index)}
          title={blockNames[item.blockType]}
        >
          <img
            src={blockImages[item.blockType]}
            alt={blockNames[item.blockType]}
            className="h-full w-full rounded object-cover"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="absolute top-0 left-0 px-1 text-white text-xs">
            {index + 1}
          </div>
          <div className="absolute right-0 bottom-0 px-1 text-white text-xs">
            {item.count}
          </div>
        </button>
      ))}
    </div>
  );
}
