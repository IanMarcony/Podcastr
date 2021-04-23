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
  toggleLoop(): void;
  toggleShuffle(): void;
  setPlayingState(state: boolean): void;
  playList(episodes: Episode[], index: number): void;
  playNext(): void;
  playPrevious(): void;
  clearPlayerState(): void;
  hasPrevious: boolean;
  hasNext: boolean;
  isLooping: boolean;
  isShuffling: boolean;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = useCallback((episode: Episode) => {
    setEpisodeList([episode]);
    setIsPlaying(true);
    setCurrentEpisodeIndex(0);
  }, []);
  const playList = useCallback((episodes: Episode[], index: number) => {
    setEpisodeList(episodes);
    setIsPlaying(true);
    setCurrentEpisodeIndex(index);
  }, []);
  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleLoop = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(!isShuffling);
  }, [isShuffling]);

  const clearPlayerState = useCallback(() => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(false);
  }, []);

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

  const playNext = useCallback(() => {
    if (isShuffling) {
      const nextRadomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      );

      setCurrentEpisodeIndex(nextRadomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }, [currentEpisodeIndex, episodeList]);

  const playPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }, [currentEpisodeIndex]);

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        hasPrevious,
        hasNext,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState,
      }}
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
