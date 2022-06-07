import Hls from "hls.js";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import Plyr from "plyr-react";
import { Box } from "@chakra-ui/react";
import "plyr-react/dist/plyr.css";

const Viewer = () => {
  const router = useRouter();
  const ref = useRef();
  const { id } = router.query;

  useEffect(() => {
    const loadVideo = async () => {
      console.log("id: ",id)
      const video = document.getElementById("plyr");
      var hls = new Hls();
      hls.loadSource(`https://livepeercdn.com/hls/${id}/index.m3u8`);
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
  }, [id]);

  return (
    <Box>
      <Plyr
        id="plyr"
        options={{ volume: 0.1, autoplay: true }}
        source={{}}
        ref={ref}
      />
    </Box>
  );
};

export default Viewer;