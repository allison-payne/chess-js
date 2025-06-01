import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import audioManager, { type AudioSettings } from '../../logic/audioManager';

// Styled components for audio controls
const AudioControlsContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      background: #66BB6A;
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      background: #66BB6A;
    }
  }
`;

const MuteButton = styled(motion.button)<{ $isMuted: boolean }>`
  background: ${props => props.$isMuted ? 'rgba(244, 67, 54, 0.8)' : 'rgba(76, 175, 80, 0.8)'};
  border: none;
  border-radius: 6px;
  padding: 6px 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;

  &:hover {
    background: ${props => props.$isMuted ? 'rgba(244, 67, 54, 1)' : 'rgba(76, 175, 80, 1)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const VolumeLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  min-width: 30px;
  text-align: center;
`;

const TestButton = styled(motion.button)`
  background: rgba(33, 150, 243, 0.8);
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  color: white;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(33, 150, 243, 1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface AudioControlsProps {
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ className }) => {
  const [settings, setSettings] = useState<AudioSettings>(audioManager.getSettings());

  // Update local state when audio manager settings change
  useEffect(() => {
    const updateSettings = () => {
      setSettings(audioManager.getSettings());
    };

    // Set up a simple polling mechanism or use event listeners if implemented
    const interval = setInterval(updateSettings, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    audioManager.setVolume(newVolume);
    setSettings(prev => ({ ...prev, volume: newVolume }));
  };

  const handleMuteToggle = () => {
    const newEnabled = !settings.enabled;
    audioManager.setEnabled(newEnabled);
    setSettings(prev => ({ ...prev, enabled: newEnabled }));
    
    // Play a test sound when unmuting
    if (newEnabled) {
      setTimeout(() => audioManager.playSound('selection'), 100);
    }
  };

  const handleTestSounds = () => {
    // Play a quick test sequence
    audioManager.playSound('move');
    setTimeout(() => audioManager.playSound('capture'), 300);
    setTimeout(() => audioManager.playSound('check'), 600);
  };

  const volumePercentage = Math.round(settings.volume * 100);

  return (
    <AudioControlsContainer
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MuteButton
        $isMuted={!settings.enabled}
        onClick={handleMuteToggle}
        whileTap={{ scale: 0.9 }}
        title={settings.enabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {settings.enabled ? '🔊' : '🔇'}
      </MuteButton>

      <VolumeSlider
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={settings.volume}
        onChange={handleVolumeChange}
        disabled={!settings.enabled}
        title={`Volume: ${volumePercentage}%`}
      />

      <VolumeLabel>{volumePercentage}%</VolumeLabel>

      <TestButton
        onClick={handleTestSounds}
        disabled={!settings.enabled}
        whileTap={{ scale: 0.9 }}
        title="Test sounds"
      >
        🎵
      </TestButton>
    </AudioControlsContainer>
  );
};

export default AudioControls;
