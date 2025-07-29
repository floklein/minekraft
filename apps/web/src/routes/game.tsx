import { createFileRoute } from "@tanstack/react-router";
import MinecraftGame from "@/components/game/MinecraftGame";

export const Route = createFileRoute("/game")({
  component: GameComponent,
});

function GameComponent() {
  return (
    <div className="h-full w-full">
      <MinecraftGame />
    </div>
  );
}
