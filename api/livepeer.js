export const createStream = async () => {
  const stream = await fetch("https://livepeer.com/api/stream", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_APIKEY}`,
    },
    body: JSON.stringify({
      name: "test_stream",
      profiles: [
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720,
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480,
        },
        {
          name: "360p",
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360,
        },
      ],
    }),
  });

  const res = await stream.json();
  console.log(res);
  return res;
};

export const fetchStream = async (id) => {
  const stream = await fetch(`https://livepeer.com/api/stream/${id}`, {
    headers: {
      authorization: "Bearer " + process.env.NEXT_PUBLIC_LIVEPEER_APIKEY,
    },
  });

  const res = await stream.json();
  console.log("fetchStream response: ", res);
  return res;
};

export const uploadAsset = async () => {
  const stream = await fetch("https://livepeer.com/api/asset/request-upload", {
    method: "POST",
    headers: {
      authorization: "Bearer " + process.env.NEXT_PUBLIC_LIVEPEER_APIKEY,
      "Content-Type": "application/json",
    },
    // body: '{\n    "name":"Example name"\n}',
    body: JSON.stringify({
      name: "test-upload",
    }),
  });

  const res = await stream.json();
  console.log("upload Asset Res: ", res);
  return res;
};

export const exportToIpfs = async (ASSET_ID) => {
  const exportRes = await fetch(
    `https://livepeer.com/api/asset/${ASSET_ID}/export`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer" + process.env.NEXT_PUBLIC_LIVEPEER_APIKEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ipfs: {},
      }),
    }
  );

  const res = await exportRes.json();
  console.log("export to ipfs Res: ", res);
  return res;
};
