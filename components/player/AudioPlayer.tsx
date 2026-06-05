"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RiForward10Line, RiPlayLargeFill, RiReplay10Line } from "react-icons/ri";
import { IoPauseSharp } from "react-icons/io5";
import { Book } from "@/lib/types";
import styles from "./player.module.css";


const AudioPlayer = ({ book }: { book: Book }) => {

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [timeProgress, setTimeProgress] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const playAnimationRef = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress();
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    }
  }, [isPlaying, audioRef, startAnimation, updateProgress]);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        setIsPlaying(false);
        currentAudioRef.currentTime = 0;
        setTimeProgress(0);
      };
    }
    return () => {
      if (currentAudioRef) {
        currentAudioRef.onended = null;
      }
    };
  }, [audioRef]);

  enum SkipType {
    forward,
    backward,
    progressBar
  }

  const handleProgressChange = (type: SkipType) => {
    if (audioRef.current && progressBarRef.current) {
      let newTime = Number(progressBarRef.current.value);
      switch (type) {
        case SkipType.forward:
          newTime += 10;
          if (newTime > duration) {
            newTime = duration;
          }
          progressBarRef.current.value = newTime.toString();
          break;
        case SkipType.backward:
          newTime -= 10;
          if (newTime < 0) {
            newTime = 0;
          }
          progressBarRef.current.value = newTime.toString();
          break;
        case SkipType.progressBar:
          // nothing to do
          break;
      }
      audioRef.current.currentTime = newTime;
      setTimeProgress(newTime);
      // if progress bar changes while audio is on pause
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(newTime / duration) * 100}%`
      );
    }
  }

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  }

  const formatTime = (time: number | undefined): string => {
    if (typeof time === 'number' && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      // Convert to string and pad with leading zeros if necessary
      const formatMinutes = minutes.toString().padStart(2, '0');
      const formatSeconds = seconds.toString().padStart(2, '0');
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };


  return (
    <div className={styles.audioWrapper}>
      <audio
        src={book.audioLink}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <div className={styles.trackWrapper}>
        <figure className={styles.trackImageMask}>
          <figure className={styles.bookImageWrapper}>
            <img src={book.imageLink} className={styles.bookImage} alt="" />
          </figure>
        </figure>
        <div className={styles.trackDetailsWrapper}>
          <div className={styles.trackTitle}>
            {book.title}
          </div>
          <div className={styles.trackAuthor}>
            {book.author}
          </div>
        </div>
      </div>
      <div className={styles.controlsWrapper}>
        <div className={styles.controls}>
          <button
            className={styles.controlsBtn}
            onClick={() => handleProgressChange(SkipType.backward)}
          >
            <RiReplay10Line />
          </button>
          <button
            className={`${styles.controlsBtn} ${styles.controlsBtnPlay}`}
            onClick={() => setIsPlaying((prev) => !prev)}
          >
            {isPlaying ? (
              <IoPauseSharp />
            ) : (
              <RiPlayLargeFill />
            )}
          </button>
          <button
            className={styles.controlsBtn}
            onClick={() => handleProgressChange(SkipType.forward)}
          >
            <RiForward10Line />
          </button>
        </div>
      </div>
      <div className={styles.progressWrapper}>
        <div className={styles.audioTime}>
          {formatTime(timeProgress)}
        </div>
        <input
          type="range"
          className={styles.progressBar}
          name="" id=""
          ref={progressBarRef}
          defaultValue="0"
          onChange={() => handleProgressChange(SkipType.progressBar)}
        />
        <div className={styles.audioTime}>
          {formatTime(duration)}
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
