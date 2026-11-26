import 'expo-router/entry';
import TrackPlayer from 'react-native-track-player';

import { PlaybackService } from './src/player/service';

TrackPlayer.registerPlaybackService(() => PlaybackService);
