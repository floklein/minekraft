import { useEffect } from "react";
import { BlockType } from "@/lib/blocks";
import { useInventoryStore } from "@/lib/inventory-store";
import { cn } from "@/lib/utils";

const blockImages: Record<BlockType, string> = {
  [BlockType.AIR]: "",
  [BlockType.GRASS]: "/src/assets/default_grass.png",
  [BlockType.DIRT]: "/src/assets/default_dirt.png",
  [BlockType.STONE]: "/src/assets/default_stone.png",
};

const blockNames: Record<BlockType, string> = {
  [BlockType.AIR]: "Air",
  [BlockType.GRASS]: "Grass",
  [BlockType.DIRT]: "Dirt",
  [BlockType.STONE]: "Stone",
};

export default function InventoryBar() {
  const { items, selectedSlot, setSelectedSlot } = useInventoryStore();

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
    <div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50">
      <div className="flex gap-1 rounded-lg border-2 border-gray-700 bg-gray-800/80 p-2 backdrop-blur-sm">
        {items.map((item, index) => (
          <button
            key={`slot-${item.blockType}-${index}`}
            type="button"
            className={cn(
              "relative h-16 w-16 cursor-pointer rounded border-2 bg-gray-700 transition-all hover:scale-105",
              selectedSlot === index
                ? "scale-110 border-yellow-400 ring-2 ring-yellow-400/50"
                : "border-gray-600",
            )}
            onClick={() => setSelectedSlot(index)}
            title={blockNames[item.blockType]}
          >
            <img
              src={blockImages[item.blockType]}
              alt={blockNames[item.blockType]}
              className="pixelated h-full w-full rounded object-cover"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="absolute top-0 left-0 rounded-tl rounded-br bg-gray-900/80 px-1 text-white text-xs">
              {index + 1}
            </div>
            <div className="absolute right-0 bottom-0 rounded-tr rounded-bl bg-gray-900/80 px-1 text-white text-xs">
              {item.count}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-2 rounded bg-gray-900/80 px-3 py-1 text-center text-sm text-white backdrop-blur-sm">
        {blockNames[items[selectedSlot]?.blockType || BlockType.AIR]}
      </div>
    </div>
  );
}
