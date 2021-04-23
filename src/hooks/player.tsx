import React, { createContext, useContext, useState, useCallback } from "react";

interface Episode {
  title: string;
  members: string;
  duration: number;
  thumbnail: string;
  url: string;
}

interface PlayerContextData {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play(episode: Episode): void;
  togglePlay(): void;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((episode: Episode) => {
    setEpisodeList([episode]);
    setIsPlaying(true);
    setCurrentEpisodeIndex(0);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

function usePlayer(): PlayerContextData {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }

  return context;
}

export { PlayerProvider, usePlayer };
