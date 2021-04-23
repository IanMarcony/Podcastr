import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { usePlayer } from "../../hooks/player";
import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

function Player() {
  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState,
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  const setupProgressListener = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }, [audioRef]);

  const handleSeek = useCallback(
    (amount: number) => {
      audioRef.current.currentTime = amount;

      setProgress(amount);
    },
    [audioRef]
  );

  const handleEpisodeEnded = useCallback(() => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }, []);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="cover"
          />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                min={0}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            loop={isLooping}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={() => toggleShuffle()}
            className={isShuffling ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={() => playPrevious()}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            disabled={!episode}
            className={styles.playButton}
            onClick={() => togglePlay()}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Parar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={() => playNext()}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={() => toggleLoop()}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Tocar próxima" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Player;
