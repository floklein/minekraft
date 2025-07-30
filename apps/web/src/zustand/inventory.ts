import { create } from "zustand";
import { BlockType } from "@/lib/blocks";

interface InventoryItem {
  blockType: BlockType;
  count: number;
}

interface InventoryStore {
  items: InventoryItem[];
  selectedSlot: number;
  selectedBlock: BlockType;
  setSelectedSlot: (slot: number) => void;
  getSelectedBlock: () => BlockType;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [
    { blockType: BlockType.GRASS, count: 999 },
    { blockType: BlockType.DIRT, count: 999 },
    { blockType: BlockType.STONE, count: 999 },
  ],
  selectedSlot: 0,
  selectedBlock: BlockType.GRASS,
  setSelectedSlot: (slot: number) => {
    const items = get().items;
    if (slot >= 0 && slot < items.length) {
      set({
        selectedSlot: slot,
        selectedBlock: items[slot].blockType,
      });
    }
  },
  getSelectedBlock: () => get().selectedBlock,
}));
