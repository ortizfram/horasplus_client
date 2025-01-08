import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useVideoPlayer, VideoView } from "expo-video";

const VideoSection = () => {
  const videoSource = { uri: "https://www.example.com/video.mp4" }; // Replace with your video URL
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  return (
    <View style={styles.videoContainer}>
      <VideoView
        player={player}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />
    </View>
  );
};

export default VideoSection;

const styles = StyleSheet.create({});
