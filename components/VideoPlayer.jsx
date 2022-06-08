import Plyr from "plyr-react";
import { useRef } from "react";

const VideoPlayer = ({ id, refreshStream }) => {
  const ref = useRef();
  useEffect(() => {
    if (playbackId) {
      const loadVideo = async () => {
        const video = document.getElementById("plyr");
        var hls = new Hls();
        hls.loadSource(`https://cdn.livepeer.com/${playbackId}/index.m3u8`);
        hls.attachMedia(video);
        ref.current.plyr.media = video;

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          const playPromise = ref.current.plyr.play();
          if (playPromise !== undefined) {
            playPromise
              .then((_) => {
                // Automatic playback started!
                // Show playing UI.
                console.log("Automatic playback started!");
              })
              .catch((error) => {
                // Auto-play was prevented
                // Show paused UI.
                console.log("ERROR:", error);
              });
          }
        });
      };
      loadVideo();
    }
  }, [refreshStream]);
  return <Plyr ref={ref} id="plyr" options={{ volume: 0.1, autoplay: true }} />;
};

export default VideoPlayer;
