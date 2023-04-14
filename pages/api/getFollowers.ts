import { NextApiRequest, NextApiResponse } from "next";

const getFollowers = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const response = await fetch(`https://api.github.com/users/${username}/followers`);
  const data = await response.json();
  res.status(200).json(data);
}
