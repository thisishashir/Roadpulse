import React from 'react';
import { TileLayer } from 'react-leaflet';
import { useTheme } from '../context/ThemeContext';

// CartoCD dark vs light tile URLs
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

/**
 * Drop-in <TileLayer> replacement that auto-switches between
 * dark/light CARTO basemaps whenever the app theme changes.
 */
const ThemedTileLayer = () => {
    const { theme } = useTheme();
    return (
        <TileLayer
            key={theme}          // force remount on theme change
            url={theme === 'light' ? LIGHT_TILES : DARK_TILES}
            attribution={ATTRIBUTION}
        />
    );
};

export default ThemedTileLayer;
