import { Box, Button, Container } from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { Client, isSupported } from "@livepeer/webrtmp-sdk";
import { createStream, exportToIpfs, uploadAsset } from "../api/livepeer";
import { StartButton, StopButton } from "../components/SearchButton";
import { useRouter } from "next/router";
import { createClient, createPostTypedData } from "../api";
import { signedTypeData, splitSignature } from "../utils";

const Stream = () => {
  const [playbackId, setPlaybackId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const videoEl = useRef(null);
  const router = useRouter();

  const createPost = async () => {
    const createPostRequest = {
      profileId: "0x2598",
      contentURI: "ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl.json",
      collectModule: {
        timedFeeCollectModule: {
          amount: {
            currency: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            value: "0.01",
          },
          recipient: "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
          referralFee: 10.5,
          followerOnly: false,
        },
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    const lensClient = await createClient();
    const response = await lensClient
      .mutation(createPostTypedData, { request: createPostRequest })
      .toPromise();

      console.log("response from createPostMutation: ", response);
      if(response.error) {
        alert("error while creating post")
        return
      }
    const typedData = response.data.createPostTypedData.typedData;
    const signature = await signedTypeData(
      typedData.domain,
      typedData.types,
      typedData.value
    );
    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });

    console.log("tx data from createPost: ", tx.hash);
  };

  const livepeerClient = new Client();
  const startStream = async () => {
    if (!isSupported()) {
      alert("webrtmp-sdk is not currently supported on this browser");
      return;
    }
    const getStreamKey = await createStream();
    const streamKey = getStreamKey.streamKey;
    setPlaybackId(getStreamKey.playbackId);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    const session = livepeerClient.cast(stream, streamKey);
    session.on("open", () => {
      console.log("Stream started.");
    });

    session.on("close", () => {
      console.log("Stream stopped.");
    });

    session.on("error", (err) => {
      console.log("Stream error.", err.message);
    });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      videoEl.current.volume = 0;
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      window.stream = stream.current;
      videoEl.current.srcObject = stream.current;
      videoEl.current.play();
      setLocalStream(stream);
      await createPost();
    }
  };

  const stopStream = async () => {
    if (localStream) {
      videoEl.current.srcObject.getTracks().forEach((track) => track.stop());
      await localStream.getTracks().forEach((track) => track.stop());
      router.push("/");
    }
  };

  const saveVideo = async () => {
    const { asset } = await uploadAsset();
    const res = await exportToIpfs(asset.id);

    console.log("export to IPFS res: ", res);
  };

  return (
    <Container m="auto" h="full">
      <StartButton onClick={startStream}>Start stream</StartButton>
      <StopButton onClick={stopStream}>Stop Stream</StopButton>
      <video className="creator-video" ref={videoEl} />
    </Container>
  );
};

export default Stream;
