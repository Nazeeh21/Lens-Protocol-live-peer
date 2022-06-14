import { ethers } from "ethers";
import ABI from "./abi.json";
import { getSigner } from "./utils";

export const lensHub = new ethers.Contract(
  "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
  ABI,
  getSigner()
);
