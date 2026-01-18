import { useState } from "react";
import { MazeGame } from "./MazeGame";
import { Section } from "./ui/Section";
import { useMazeConfig } from "../hooks/useMazeConfig";
import { MazeConfigPanel } from "./MazeConfigPanel";
import { generateMazeFromConfig } from "./mazeGenerator";
import { Button } from "./ui/Button";

export function BigMazeGame() {
  const [showConfig, setShowConfig] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const mazeConfig = useMazeConfig(2);

  return (
    <Section id="bigmaze">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Crie um labirinto
      </h2>
      <div className="flex flex-col gap-2 mt-4">
        <div className="">
          <Button onClick={() => setShowConfig(!showConfig)}>
            {showConfig ? "Esconder" : "Mostrar"} Configurações
          </Button>
        </div>

        {showConfig && <MazeConfigPanel {...mazeConfig} />}
      </div>
      <Button onClick={() => setShowGame(!showGame)}>
        {showGame ? "Esconder" : "Mostrar novo"} Jogo
      </Button>
      {showGame && (
        <MazeGame
          grid={generateMazeFromConfig(mazeConfig.rows, mazeConfig.tilesPerRow)}
          cellSize={24}
          config={
            {
              /* opções do player, cores, etc */
            }
          }
        />
      )}
    </Section>
  );
}
