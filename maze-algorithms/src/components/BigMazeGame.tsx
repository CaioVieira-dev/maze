import { useState } from "react";
import { MazeGame } from "./MazeGame";
import { Section } from "./ui/Section";
import { useMazeConfig } from "../hooks/useMazeConfig";
import { MazeConfigPanel } from "./MazeConfigPanel";
import { generateMazeFromConfig } from "./mazeGenerator";
import { Button } from "./ui/Button";

export function BigMazeGame() {
  const [showConfig, setShowConfig] = useState(true);
  const mazeConfig = useMazeConfig(2);

  return (
    <Section id="bigmaze">
      <div className="flex flex-col gap-2">
        <div className="">
          <Button onClick={() => setShowConfig(!showConfig)}>
            {showConfig ? "Esconder" : "Mostrar"} Configurações
          </Button>
        </div>

        {showConfig && <MazeConfigPanel {...mazeConfig} />}
      </div>

      <MazeGame
        grid={generateMazeFromConfig(mazeConfig.rows, mazeConfig.tilesPerRow)}
        cellSize={24}
        config={
          {
            /* opções do player, cores, etc */
          }
        }
      />
    </Section>
  );
}
