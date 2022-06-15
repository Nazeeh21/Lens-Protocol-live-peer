import { Container } from "@chakra-ui/react";
import { Client, isSupported } from "@livepeer/webrtmp-sdk";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient, createPostTypedData } from "../api";
import { createStream, exportToIpfs, uploadAsset } from "../api/livepeer";
import { StartButton, StopButton } from "../components/SearchButton";
import { uploadIpfs } from "../ipfs";
import { lensHub } from "../lenshub";
import { signedTypeData, splitSignature } from "../utils";

const Stream = () => {
  const [playbackId, setPlaybackId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const videoEl = useRef(null);
  const router = useRouter();

  const createPost = async (streamId) => {
    const ipfsResult = await uploadIpfs({
      version: "1.0.0",
      metadata_id: uuidv4(),
      description: "Description",
      content:
        "livepeer stream link: https://lens-protocol-live-peer.vercel.app/stream/" +
        streamId,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: "Name",
      attributes: [],
      media: [
        // {
        //   item: 'https://scx2.b-cdn.net/gfx/news/hires/2018/lion.jpg',
        //   // item: 'https://assets-global.website-files.com/5c38aa850637d1e7198ea850/5f4e173f16b537984687e39e_AAVE%20ARTICLE%20website%20main%201600x800.png',
        //   type: 'image/jpeg',
        // },
      ],
      appId: "testing123",
    });

    const currentProfileId = localStorage.getItem("defaultProfileId");

    console.log("create Post Ipfs result: ", { ipfsResult });
    const createPostRequest = {
      profileId: currentProfileId,
      contentURI: "ipfs://" + ipfsResult.path,
      collectModule: {
        freeCollectModule: { followerOnly: true },
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
    if (response.error) {
      alert("error while creating post");
      return;
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
    if (
      !localStorage.getItem("defaultProfileId") ||
      localStorage.getItem("defaultProfileId") === undefined
    ) {
      alert("Please Signin using your lens profile to start streaming");
      return;
    }
    if (!isSupported()) {
      alert("webrtmp-sdk is not currently supported on this browser");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    if (chainId !== 137) {
      alert("Please Switch to Polygon Mainnet");
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
      await createPost(getStreamKey.id);
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
      <video className={localStream ? "creator-video" : ""} ref={videoEl} />
    </Container>
  );
};

export default Stream;
