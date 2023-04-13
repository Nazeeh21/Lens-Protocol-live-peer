import { Player } from "@livepeer/react";
import { useRouter } from "next/router";

const Watch = () => {
  const router = useRouter();

  const { id } = router.query;

  return ( <div>
      <div className="flex items-center w-screen justify-center mt-20">
        <div className="w-2/3">
          <Player showPipButton playbackId={id as string} />
        </div>
      </div>
    </div>)
}

export default Watch