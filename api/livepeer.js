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
